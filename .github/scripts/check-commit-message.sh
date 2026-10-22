#!/usr/bin/env bash
# Checks one commit message against this repo's format, "type(scope)!: summary"
# (scope and ! optional), e.g. "fix: keep the donate tab on screen".
# The types come from release-please-config.json, so this check, the git hook,
# and backend versioning always agree. See docs/RELEASING.md.
#
# Usage: check-commit-message.sh [--ci] [--no-length] <message-file>
#   --ci         also reject fixup!/squash!/amend! commits (fine locally, never pushed)
#   --no-length  skip the 100-character summary limit (bot commits)
set -euo pipefail

ci=false max=100
while [ $# -gt 1 ]; do
    case $1 in
        --ci) ci=true ;;
        --no-length) max=0 ;;
        *) echo "unknown option: $1" >&2; exit 2 ;;
    esac
    shift
done
file=${1:?usage: check-commit-message.sh [--ci] [--no-length] <message-file>}

command -v jq >/dev/null || { echo "commit message check needs jq (brew install jq)" >&2; exit 1; }
config="$(git rev-parse --show-toplevel)/release-please-config.json"
versioned=$(jq -r '[."changelog-sections"[] | select(.hidden != true) | .type] | join(" ")' "$config")
unversioned=$(jq -r '[."changelog-sections"[] | select(.hidden == true) | .type] | join(" ")' "$config")
types="${versioned// /|}|${unversioned// /|}"

# Git hands the hook the raw message: drop what git itself drops (comment lines,
# everything under the `git commit -v` scissors line), then leading blank lines.
msg=$(sed -e '/^# -\{24\} >8 -\{24\}$/,$d' -e '/^#/d' "$file" | sed '/[^[:space:]]/,$!d')
header=$(printf '%s\n' "$msg" | sed -n 1p)
second=$(printf '%s\n' "$msg" | sed -n 2p)

[ -z "$header" ] && exit 0                    # empty: git aborts the commit itself
[[ $header == "Merge "* ]] && exit 0          # merge commits (git and GitHub)
if [[ $header =~ ^(fixup|squash|amend)!\  ]]; then
    $ci || exit 0
    echo "✖ \"$header\" is an autosquash commit; squash it before pushing (git rebase -i --autosquash)." >&2
    exit 1
fi

problems=()
pattern="^($types)(\([^()]+\))?!?: [^[:space:]]"
[[ $header =~ $pattern ]] || problems+=("The summary must look like \"type: summary\" or \"type(scope): summary\".")
if [ "$max" -gt 0 ] && [ "${#header}" -gt "$max" ]; then
    problems+=("The summary is ${#header} characters; keep it to $max or fewer.")
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
