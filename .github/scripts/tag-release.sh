#!/usr/bin/env bash
# Tags the commit just pushed to main as one release, "<date>-backend-<version>"
# (e.g. 2026.10.21-backend-1.4.1; a second release that day is
# 2026.10.21.2-backend-1.4.1), and publishes a GitHub Release listing what's in it.
# Dated by when main was pushed, in Dallas time. Needs GH_TOKEN, GITHUB_SHA,
# GITHUB_REPOSITORY, BEFORE (main's previous commit), and PUSHED_AT (the push's
# Unix time; a queued or re-run job would otherwise date it by when it ran).
# See docs/RELEASING.md.
set -euo pipefail

root=$(git rev-parse --show-toplevel)
sha=${GITHUB_SHA:?}
version=$(jq -r '.backend' "$root/.release-please-manifest.json")
release_tag='[0-9][0-9][0-9][0-9].[0-9][0-9].[0-9][0-9]*-backend-*'

# A re-run of the same push must not make a second release.
existing=$(git tag --points-at "$sha" --list "$release_tag")
if [ -n "$existing" ]; then
    echo "$(git rev-parse --short "$sha") is already released as $existing."
    exit 0
fi

pushed_at=${PUSHED_AT:-$(date +%s)}
day=$(TZ=America/Chicago date -d "@$pushed_at" +%Y.%m.%d 2>/dev/null ||    # GNU (CI)
    TZ=America/Chicago date -r "$pushed_at" +%Y.%m.%d)                      # BSD (macOS)
count=$(git tag --list "$day-backend-*" "$day.*-backend-*" | wc -l | tr -d ' ')
if [ "$count" -eq 0 ]; then tag="$day-backend-$version"; else tag="$day.$((count + 1))-backend-$version"; fi

# What's new: everything since the previous release (or, for the very first one,
# since main's previous commit).
prev=$(git describe --tags --abbrev=0 --match "$release_tag" "$sha" 2>/dev/null || true)
if [ -n "$prev" ]; then
    range="$prev..$sha"
elif [ -n "${BEFORE:-}" ] && git cat-file -e "${BEFORE}^{commit}" 2>/dev/null; then
    range="$BEFORE..$sha"
else
    range="$sha^!"
fi
if [ -n "$prev" ] && git merge-base --is-ancestor "backend-v$version" "$prev"; then
    backend="Backend $version (unchanged)"
else
    backend="Backend $version (new in this release)"
fi

notes=$(mktemp)
{
    echo "**$backend**: [what's in it](https://github.com/$GITHUB_REPOSITORY/releases/tag/backend-v$version)"
    echo
    echo "**Commits**${prev:+ since $prev}:"
    echo
    git log --reverse --no-merges --format='- %s (%h)' "$range"
} >"$notes"

gh release create "$tag" --target "$sha" --title "$tag" --notes-file "$notes" --latest
echo "Released $(git rev-parse --short "$sha") as $tag."
[ -n "${GITHUB_STEP_SUMMARY:-}" ] && { echo "### Released as \`$tag\`"; cat "$notes"; } >>"$GITHUB_STEP_SUMMARY"
exit 0
