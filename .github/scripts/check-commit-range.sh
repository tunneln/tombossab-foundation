#!/usr/bin/env bash
# CI: checks every commit a push or pull request adds (check-commits.sh), plus
# the pull request's title, which becomes the commit when squash-merging.
# Needs EVENT, BEFORE, BASE, HEAD, PR_TITLE, PR_AUTHOR from the workflow.
set -euo pipefail

scripts="$(git rev-parse --show-toplevel)/.github/scripts"
zero=0000000000000000000000000000000000000000
failed=0

if [ "$EVENT" = pull_request ]; then
    range="$BASE..$HEAD"
    title=$(mktemp)
    printf '%s\n' "$PR_TITLE" >"$title"
    flags=(--ci)    # never --merge: a title is never a merge commit
    [[ $PR_AUTHOR == *"[bot]"* ]] && flags+=(--no-length)
    echo "Pull request title: $PR_TITLE"
    "$scripts/check-commit-message.sh" "${flags[@]}" "$title" || failed=1
elif [ -n "${BEFORE:-}" ] && [ "$BEFORE" != "$zero" ] && git cat-file -e "${BEFORE}^{commit}" 2>/dev/null; then
    range="$BEFORE..$HEAD"
else
    range="$HEAD^!"    # new branch or rewritten history: check the newest commit only
fi

"$scripts/check-commits.sh" "$range" || failed=1
exit $failed
