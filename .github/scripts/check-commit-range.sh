#!/usr/bin/env bash
# CI: runs check-commit-message.sh on every commit a push or pull request adds,
# plus the pull request's title (it becomes the commit when squash-merging).
# Bot commits (Dependabot, release-please) skip the length limit.
# Needs EVENT, BEFORE, BASE, HEAD, PR_TITLE, PR_AUTHOR from the workflow.
set -euo pipefail

check="$(git rev-parse --show-toplevel)/.github/scripts/check-commit-message.sh"
zero=0000000000000000000000000000000000000000
msg=$(mktemp)
failed=0
is_bot() { [[ $1 == *"[bot]"* ]]; }

if [ "$EVENT" = pull_request ]; then
    range="$BASE..$HEAD"
    printf '%s\n' "$PR_TITLE" >"$msg"
    flags=(--ci)
    is_bot "$PR_AUTHOR" && flags+=(--no-length)
    echo "Pull request title: $PR_TITLE"
    "$check" "${flags[@]}" "$msg" || failed=1
elif [ -n "${BEFORE:-}" ] && [ "$BEFORE" != "$zero" ] && git cat-file -e "${BEFORE}^{commit}" 2>/dev/null; then
    range="$BEFORE..$HEAD"
else
    range="$HEAD^!"    # new branch or rewritten history: check the newest commit only
fi

shas=$(git rev-list --reverse "$range")    # an assignment, so a bad range fails the job
for sha in $shas; do
    git log -1 --format=%B "$sha" >"$msg"
    flags=(--ci)
    is_bot "$(git log -1 --format=%an "$sha")" && flags+=(--no-length)
    git log -1 --format='%h %s' "$sha"
    "$check" "${flags[@]}" "$msg" || failed=1
done
exit $failed
