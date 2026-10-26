#!/usr/bin/env bash
# Checks one commit message against this repo's format, "type(scope)!: summary"
# (scope and ! optional), e.g. "fix: keep the donate tab on screen".
# The types come from release-please-config.json, so this check, the git hooks,
# and backend versioning always agree. See docs/RELEASING.md.
#
# Usage: check-commit-message.sh [--ci] [--merge] [--no-length] <message-file>
#   --ci         also reject fixup!/squash!/amend! commits (fine locally, never pushed)
#   --merge      the message belongs to a real merge commit: "Merge ..." is allowed
#   --no-length  skip the 100-character summary limit (bot commits)
set -euo pipefail

ci=false merge=false max=100
while [ $# -gt 1 ]; do
    case $1 in
        --ci) ci=true ;;
        --merge) merge=true ;;
        --no-length) max=0 ;;
        *) echo "unknown option: $1" >&2; exit 2 ;;
    esac
    shift
done
file=${1:?usage: check-commit-message.sh [--ci] [--merge] [--no-length] <message-file>}

command -v jq >/dev/null || { echo "commit message check needs jq (brew install jq)" >&2; exit 1; }
config="$(git rev-parse --show-toplevel)/release-please-config.json"
versioned=$(jq -r '[."changelog-sections"[] | select(.hidden != true) | .type] | join(" ")' "$config")
unversioned=$(jq -r '[."changelog-sections"[] | select(.hidden == true) | .type] | join(" ")' "$config")
types="${versioned// /|}|${unversioned// /|}"

# The commit-msg hook gets the raw message: drop what git itself drops (comment
# lines, everything under the `git commit -v` scissors line). A saved commit or a
# PR title (--ci) has no comments, so a line like "#12 ..." is real text there.
if $ci; then
    msg=$(sed '/[^[:space:]]/,$!d' "$file")
else
    comment=$(git config --get core.commentString || git config --get core.commentChar || true)
    case $comment in '' | auto) comment='#' ;; esac
    msg=$(awk -v c="$comment" -v scissors="$comment ------------------------ >8 ------------------------" \
        '$0 == scissors { exit } index($0, c) == 1 { next } { print }' "$file" | sed '/[^[:space:]]/,$!d')
fi
header=$(printf '%s\n' "$msg" | sed -n 1p)
second=$(printf '%s\n' "$msg" | sed -n 2p)

if [ -z "$header" ]; then    # empty: git aborts such a commit itself
    $ci || exit 0
    echo "✖ Commit with an empty message." >&2
    exit 1
fi
$merge && [[ $header == "Merge "* ]] && exit 0  # git's and GitHub's merge commits
if [[ $header =~ ^(fixup|squash|amend)!\  ]]; then
    $ci || exit 0
    echo "✖ \"$header\" is an autosquash commit; squash it before pushing (git rebase -i --autosquash)." >&2
    exit 1
fi

problems=()
pattern="^($types)(\([^()]+\))?!?: [^[:space:]]"
[[ $header =~ $pattern ]] || problems+=("The summary must look like \"type: summary\" or \"type(scope): summary\".")
# GitHub appends " (#123)" when squash-merging a pull request; that doesn't count.
summary=$header
[[ $summary =~ ^(.*)\ \(#[0-9]+\)$ ]] && summary=${BASH_REMATCH[1]}
if [ "$max" -gt 0 ] && [ "${#summary}" -gt "$max" ]; then
    problems+=("The summary is ${#summary} characters; keep it to $max or fewer.")
fi
[ -n "$second" ] && problems+=("Leave a blank line between the summary and the details.")

[ ${#problems[@]} -eq 0 ] && exit 0
{
    echo "✖ Commit message rejected:"
    for p in "${problems[@]}"; do echo "    $p"; done
    echo "  Got:    $header"
    echo "  Format: type(optional scope)!: summary     e.g. fix: keep the donate tab on screen"
    echo "  Types that give the backend a new version when they touch backend/: $versioned"
    echo "  Types that never do: $unversioned"
    echo "  Breaking API change: add ! after the type (feat!: ...). Details: docs/RELEASING.md"
} >&2
exit 1
