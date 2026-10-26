#!/usr/bin/env bash
# Runs check-commit-message.sh on every commit `git rev-list <args>` lists, e.g.
#   check-commits.sh origin/develop..HEAD
#   check-commits.sh <sha> --not --remotes=origin
# Real merge commits may say "Merge ...", and bot commits (Dependabot,
# release-please) skip the length limit. Used by CI and the pre-push hook.
set -euo pipefail

check="$(git rev-parse --show-toplevel)/.github/scripts/check-commit-message.sh"
msg=$(mktemp)
trap 'rm -f "$msg"' EXIT
shas=$(git rev-list --reverse "$@")    # an assignment, so a bad range fails loudly
failed=0
for sha in $shas; do
    git log -1 --format=%B "$sha" >"$msg"
    flags=(--ci)
    [[ $(git log -1 --format=%an "$sha") == *"[bot]"* ]] && flags+=(--no-length)
    [[ $(git log -1 --format=%P "$sha") == *" "* ]] && flags+=(--merge)    # 2+ parents
    git log -1 --format='%h %s' "$sha"
    "$check" "${flags[@]}" "$msg" || failed=1
done
exit $failed
