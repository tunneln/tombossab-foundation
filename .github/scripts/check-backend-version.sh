#!/usr/bin/env bash
# Runs on main before tagging or deploying. Fails if this commit carries backend
# changes that release-please hasn't given a version yet: they reach develop, the
# "Version backend" workflow versions them about a minute later, and only then
# should main be fast-forwarded. Also fails if the pom and the manifest disagree.
# See docs/RELEASING.md.
set -euo pipefail

root=$(git rev-parse --show-toplevel)
version=$(jq -r '.backend' "$root/.release-please-manifest.json")
tag="backend-v$version"
fail() { printf '✖ %s\n' "$1" >&2; shift; printf '  %s\n' "$@" >&2; exit 1; }

pom_version=$(python3 -c 'import sys, xml.etree.ElementTree as ET
print(ET.parse(sys.argv[1]).getroot().findtext("{http://maven.apache.org/POM/4.0.0}version"))' "$root/backend/pom.xml")
[ "$pom_version" = "$version" ] ||
    fail "backend/pom.xml says $pom_version but .release-please-manifest.json says $version." \
         "Only release-please changes these; undo the hand edit."

git rev-parse -q --verify "refs/tags/$tag^{commit}" >/dev/null ||
    fail "Tag $tag doesn't exist yet: the Version backend workflow on develop hasn't finished (or failed)." \
         "Once it's green, pull develop and fast-forward main again."
git merge-base --is-ancestor "$tag" HEAD ||
    fail "Tag $tag isn't part of this commit's history; main must be a fast-forward of develop."

# Same rule release-please uses: a commit under backend/ needs a version when its
# type has a visible changelog section, or when it's a breaking change.
types=$(jq -r '[."changelog-sections"[] | select(.hidden != true) | .type] | join("|")' "$root/release-please-config.json")
needs_version="^($types)(\([^()]+\))?!?: |^[a-z]+(\([^()]+\))?!: "
pending=()
while IFS= read -r sha; do
    subject=$(git log -1 --format=%s "$sha")
    body=$(git log -1 --format=%b "$sha")
    if [[ $subject =~ $needs_version ]] || grep -qE '^BREAKING[ -]CHANGE: ' <<<"$body"; then
        pending+=("$(git log -1 --format='%h %s' "$sha")")
    fi
done < <(git rev-list --full-history "$tag..HEAD" -- backend/)

if [ ${#pending[@]} -gt 0 ]; then
    {
        echo "✖ These backend changes aren't in a version yet (latest is $version):"
        printf '    %s\n' "${pending[@]}"
        echo "  The Version backend workflow on develop is probably still running."
        echo "  Wait for it to finish, then: git fetch origin && git push origin origin/develop:main"
    } >&2
    exit 1
fi
echo "Backend $version covers every backend change in $(git rev-parse --short HEAD)."
