#!/usr/bin/env bash
# Tests the release scripts against throwaway git repos and a fake `gh`.
# Run from anywhere: .github/scripts/test-release-scripts.sh (CI runs it too).
# `cond && ok || bad` is safe here: ok never fails.
# shellcheck disable=SC2015
set -euo pipefail

src=$(cd "$(dirname "$0")/../.." && pwd)
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
passed=0 failed=0

ok() { passed=$((passed + 1)); }
bad() { failed=$((failed + 1)); echo "FAIL: $1"; [ -n "${2:-}" ] && printf '%s\n' "$2" | sed 's/^/    /'; return 0; }
expect_ok() {
    local name=$1 out; shift
    if out=$("$@" 2>&1); then ok; else bad "$name" "$out"; fi
}
expect_fail() {
    local name=$1 pattern=$2 out; shift 2
    if out=$("$@" 2>&1); then bad "$name (expected a failure)" "$out"
    elif ! grep -qE -- "$pattern" <<<"$out"; then bad "$name (wrong message)" "$out"
    else ok; fi
}

# A repo shaped like this one: config, manifest, a pom, backend/ and frontend/.
new_repo() {
    repo="$work/repo$RANDOM$RANDOM"
    mkdir -p "$repo/.github/scripts" "$repo/.githooks" "$repo/backend" "$repo/frontend" "$repo/bin"
    cd "$repo"
    git init -q -b develop
    git config user.name "Test" && git config user.email test@example.com && git config commit.gpgsign false
    cp "$src"/.github/scripts/*.sh .github/scripts/
    cp "$src"/.githooks/commit-msg .githooks/
    cp "$src"/release-please-config.json .
    set_version 1.0.0
    echo a >frontend/app.txt && echo a >backend/App.java
    git add -A && git commit -qm "chore: init" && git tag backend-v1.0.0
    # Fake gh: logs every call; `release create` makes the tag and keeps the notes.
    cat >bin/gh <<'EOF'
#!/usr/bin/env bash
echo "$*" >>"$GH_LOG"
if [ "$1 $2" = "release create" ]; then
    tag=$3 target= notes=; shift 3
    while [ $# -gt 0 ]; do case $1 in --target) target=$2; shift ;; --notes-file) notes=$2; shift ;; esac; shift; done
    git tag "$tag" "$target" && cp "$notes" "$GH_LOG.$tag"
fi
EOF
    chmod +x bin/gh
    export GH_LOG="$repo/gh.log" PATH="$repo/bin:$PATH"
    : >"$GH_LOG"
}
set_version() {
    printf '{\n  "backend": "%s"\n}\n' "$1" >.release-please-manifest.json
    printf '%s\n' '<?xml version="1.0" encoding="UTF-8"?>' \
        '<project xmlns="http://maven.apache.org/POM/4.0.0">' \
        '	<parent><artifactId>spring-boot-starter-parent</artifactId><version>3.5.3</version></parent>' \
        '	<artifactId>backend</artifactId>' \
        "	<version>${2:-$1}</version>" '</project>' >backend/pom.xml
}
# commit <file to touch> <message, may contain \n>
commit() { echo "$RANDOM" >>"$1"; git add -A; printf '%b\n' "$2" | git commit -q --no-verify -F -; }
# What release-please does on develop: bump manifest + pom in one commit, tag it.
release_backend() { set_version "$1"; git add -A; git commit -qm "chore(develop): release backend $1 (#$RANDOM)"; git tag "backend-v$1"; }
msg_file() { printf '%b\n' "$1" >"$work/msg"; echo "$work/msg"; }
check_msg() { local f; f=$(msg_file "$1"); shift; .github/scripts/check-commit-message.sh "$@" "$f"; }

# ----------------------------------------------------------- commit messages
new_repo
for m in "fix: keep the donate tab on screen" "feat(api): add an events endpoint" \
    "feat!: drop the old contact payload" "deps: bump org.postgresql:postgresql from 42.7.4 to 42.7.5 in /backend" \
    "chore(develop): release backend 1.0.1 (#12)" "revert: fix: keep the donate tab on screen" \
    "fix: one\n\nA longer explanation." "\n\nfix: leading blank lines" \
    "Merge pull request #12 from tunneln/dependabot/maven/backend/x" "Merge branch 'develop'" \
    "fixup! fix: something" "fix: x\n\n# Please enter the commit message\n# ------------------------ >8 ------------------------\ndiff --git a/x b/x\nnot a summary" \
    "# a comment first\nfix: after a comment" "fix: $(printf 'x%.0s' $(seq 95))"; do
    expect_ok "valid: $m" check_msg "$m"
done
for m in "Fix the donate tab" "fix:no space" "fix : space before colon" "Fix: capital type" \
    "feature: unknown type" "fix(): empty scope" "fix: " "Revert \"fix: x\"" "fix: $(printf 'x%.0s' $(seq 96))"; do
    expect_fail "invalid: $m" "Commit message rejected" check_msg "$m"
done
expect_fail "invalid: no blank line before details" "blank line" check_msg "fix: one\nsecond line"
expect_fail "invalid in CI: fixup!" "autosquash" check_msg "fixup! fix: something" --ci
expect_ok "bots skip the length limit" check_msg "deps: $(printf 'x%.0s' $(seq 150))" --no-length
# The hook itself, through git.
git config core.hooksPath .githooks
echo b >>frontend/app.txt && git add -A
expect_fail "hook blocks a bad message" "Commit message rejected" git commit -qm "update stuff"
expect_ok "hook allows a good message" git commit -qm "fix: a good message"
git config --unset core.hooksPath

# ------------------------------------------------------- CI commit-range check
new_repo
base=$(git rev-parse HEAD)
commit frontend/app.txt "fix: good one"
commit frontend/app.txt "bad one"
expect_fail "push range with a bad commit" "bad one" env EVENT=push BEFORE="$base" HEAD="$(git rev-parse HEAD)" .github/scripts/check-commit-range.sh
git reset -q --hard HEAD~1
expect_ok "push range all good" env EVENT=push BEFORE="$base" HEAD="$(git rev-parse HEAD)" .github/scripts/check-commit-range.sh
expect_ok "new branch push checks only the newest commit" env EVENT=push BEFORE=0000000000000000000000000000000000000000 HEAD="$(git rev-parse HEAD)" .github/scripts/check-commit-range.sh
expect_fail "pull request with a bad title" "Pull request title" env EVENT=pull_request BASE="$base" HEAD="$(git rev-parse HEAD)" PR_TITLE="Update things" PR_AUTHOR=someone .github/scripts/check-commit-range.sh
expect_ok "Dependabot PR with a long title" env EVENT=pull_request BASE="$base" HEAD="$(git rev-parse HEAD)" PR_TITLE="deps: $(printf 'x%.0s' $(seq 120))" PR_AUTHOR="dependabot[bot]" .github/scripts/check-commit-range.sh
GIT_AUTHOR_NAME="dependabot[bot]" commit backend/App.java "deps: $(printf 'x%.0s' $(seq 120))"
expect_ok "bot commit with a long summary" env EVENT=push BEFORE="$base" HEAD="$(git rev-parse HEAD)" .github/scripts/check-commit-range.sh

# ------------------------------------------------------------ main-branch guard
new_repo
guard=.github/scripts/check-backend-version.sh
expect_ok "nothing since the version" "$guard"
commit frontend/app.txt "fix: frontend only"
expect_ok "frontend fix needs no backend version" "$guard"
commit backend/App.java "chore: tidy the backend"
expect_ok "backend chore needs no version" "$guard"
commit backend/App.java "fix: backend bug"
expect_fail "backend fix without a version" "fix: backend bug" "$guard"
release_backend 1.0.1
expect_ok "backend fix once versioned" "$guard"
patch=1
for m in "feat: backend feature" "perf(api): faster" "deps: bump x in /backend" "revert: fix: backend bug" \
    "refactor!: rename the API" "refactor: rename\n\nBREAKING CHANGE: the API moved" "chore: x\n\nBREAKING-CHANGE: gone"; do
    commit backend/App.java "$m"
    expect_fail "needs a version: $m" "aren't in a version" "$guard"
    patch=$((patch + 1)) && release_backend "1.0.$patch"
done
git checkout -q -b dependabot && commit backend/App.java "deps: bump y in /backend" && git checkout -q develop
git merge -q --no-ff --no-edit -m "Merge pull request #7 from tunneln/dependabot" dependabot
expect_fail "versioned change inside a merge commit" "deps: bump y" "$guard"
release_backend 1.1.0
# A change made and undone on a side branch nets to nothing, but release-please
# still counts its commits, so the guard must see them too.
git checkout -q -b tweak && commit backend/App.java "fix: tweak the backend"
git checkout -q HEAD~1 -- backend/App.java && git commit -qm "revert: undo the tweak" && git checkout -q develop
git merge -q --no-ff --no-edit -m "Merge branch 'tweak'" tweak
expect_fail "versioned change undone on a side branch" "fix: tweak the backend" "$guard"
release_backend 1.1.5
set_version 1.1.0 1.1.1 && git add -A && git commit -qm "chore: hand-edited pom"
expect_fail "pom and manifest disagree" "pom.xml says 1.1.1" "$guard"
set_version 1.2.0 && git add -A && git commit -qm "chore: manifest ahead of its tag"
expect_fail "manifest version not tagged yet" "doesn't exist yet" "$guard"
git checkout -q --orphan elsewhere && git commit -qm "chore: unrelated" && git tag backend-v1.2.0 && git checkout -q develop
expect_fail "tag not in this history" "isn't part of this commit's history" "$guard"

# -------------------------------------------------------------- release tagging
new_repo
day=$(TZ=America/Chicago date +%Y.%m.%d)
before=$(git rev-parse HEAD)
commit frontend/app.txt "fix: first frontend fix"
tagit() { env GITHUB_SHA="$(git rev-parse HEAD)" GITHUB_REPOSITORY=owner/repo BEFORE="$1" GITHUB_STEP_SUMMARY= .github/scripts/tag-release.sh; }
expect_ok "first release" tagit "$before"
[ "$(git tag --points-at HEAD)" = "$day-backend-1.0.0" ] && ok || bad "first release tag name" "$(git tag --points-at HEAD)"
grep -q "new in this release" "$GH_LOG.$day-backend-1.0.0" && grep -q "fix: first frontend fix" "$GH_LOG.$day-backend-1.0.0" && ok || bad "first release notes" "$(cat "$GH_LOG.$day-backend-1.0.0")"
grep -q -- "--latest" "$GH_LOG" && ok || bad "release marked latest" "$(cat "$GH_LOG")"
calls=$(wc -l <"$GH_LOG")
expect_ok "re-run of the same push" tagit "$before"
[ "$(wc -l <"$GH_LOG")" = "$calls" ] && ok || bad "re-run must not create a release" "$(cat "$GH_LOG")"
prev=$(git rev-parse HEAD)
commit frontend/app.txt "fix: second frontend fix"
expect_ok "second release the same day" tagit "$prev"
notes="$GH_LOG.$day.2-backend-1.0.0"
[ -f "$notes" ] && grep -q "(unchanged)" "$notes" && grep -q "second frontend fix" "$notes" && ! grep -q "first frontend fix" "$notes" && ok || bad "second release tag and notes" "$(git tag; cat "$notes" 2>/dev/null)"
prev=$(git rev-parse HEAD)
commit backend/App.java "fix: backend bug"
release_backend 1.0.1
git checkout -q -b side && commit frontend/app.txt "feat: merged work" && git checkout -q develop && git merge -q --no-ff --no-edit -m "Merge branch 'side'" side
expect_ok "third release with a new backend version" tagit "$prev"
notes="$GH_LOG.$day.3-backend-1.0.1"
[ -f "$notes" ] && grep -q "Backend 1.0.1 (new in this release)" "$notes" && grep -q "fix: backend bug" "$notes" && ! grep -q "Merge branch" "$notes" && grep -q "releases/tag/backend-v1.0.1" "$notes" && ok || bad "third release tag and notes" "$(git tag; cat "$notes" 2>/dev/null)"

echo "release script tests: $passed passed, $failed failed"
[ "$failed" -eq 0 ]
