#!/usr/bin/env bash
# Runs on main before tagging or deploying. Fails if this commit carries backend
# changes that release-please is about to version but hasn't yet: they reach
# develop, the "Version backend" workflow versions them about a minute later, and
# only then should main be fast-forwarded. Also fails if the pom and the
# manifest disagree. See docs/RELEASING.md.
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
tag_sha=$(git rev-parse "$tag^{commit}")

# Release-please's rule: a commit needs a version when it touches backend/ and its
# type has a visible changelog section, or it's a breaking change.
types=$(jq -r '[."changelog-sections"[] | select(.hidden != true) | .type] | join("|")' "$root/release-please-config.json")
needs_version="^($types)(\([^()]+\))?!?: |^[a-z]+(\([^()]+\))?!: "
needs_a_version() {
    local subject body
    subject=$(git log -1 --format=%s "$1")
    body=$(git log -1 --format=%b "$1")
    [[ $subject =~ $needs_version ]] || grep -qE '^BREAKING[ -]CHANGE: ' <<<"$body"
}
touches_backend() {    # against the first parent, like GitHub's file list for a commit
    ! git diff --quiet "$1^1" "$1" -- backend/
}

# Walk history the way release-please does (git log order: newest commit date
# first) and stop at the tag. Release-please only versions what it meets on the way.
seen=" "
pending=()
for sha in $(git rev-list HEAD); do
    [ "$sha" = "$tag_sha" ] && break
    seen="$seen$sha "
    if touches_backend "$sha" && needs_a_version "$sha"; then
        pending+=("$(git log -1 --format='%h %s' "$sha")")
    fi
done

if [ ${#pending[@]} -gt 0 ]; then
    {
        echo "✖ These backend changes aren't in a version yet (latest is $version):"
        printf '    %s\n' "${pending[@]}"
        echo "  The Version backend workflow on develop is probably still running."
        echo "  Wait for it to finish, then: git fetch origin && git push origin origin/develop:main"
    } >&2
    exit 1
fi

# Commits that are in this history but older than the tag never come up in that
# walk: a branch with older commits merged in with a merge commit. Release-please
# will never version them, so say so instead of blocking every release.
missed=()
while IFS= read -r sha; do
    [ -z "$sha" ] && continue
    case $seen in *" $sha "*) continue ;; esac
    if needs_a_version "$sha"; then
        missed+=("$(git log -1 --format='%h %s' "$sha")")
    fi
done < <(git rev-list --full-history --no-merges "$tag..HEAD" -- backend/)
if [ ${#missed[@]} -gt 0 ]; then
    echo "::warning::${#missed[@]} backend change(s) ship under $version without their own version: they came in through a merge from a branch older than $tag, which release-please never reads. Squash- or rebase-merge instead (docs/RELEASING.md)."
    printf '  missed: %s\n' "${missed[@]}"
fi
echo "Backend $version covers every backend change in $(git rev-parse --short HEAD)."
