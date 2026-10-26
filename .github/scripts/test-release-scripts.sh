#!/usr/bin/env bash
# Tests the release scripts and git hooks against throwaway git repos and a fake `gh`.
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
# expect_ok_saying <name> <pattern> <command...>: succeeds and prints <pattern>
expect_ok_saying() {
    local name=$1 pattern=$2 out; shift 2
    if ! out=$("$@" 2>&1); then bad "$name" "$out"
    elif ! grep -qE -- "$pattern" <<<"$out"; then bad "$name (wrong output)" "$out"
    else ok; fi
}
expect_fail() {
    local name=$1 pattern=$2 out; shift 2
    if out=$("$@" 2>&1); then bad "$name (expected a failure)" "$out"
    elif ! grep -qE -- "$pattern" <<<"$out"; then bad "$name (wrong message)" "$out"
    else ok; fi
}

# Every commit gets its own, later timestamp: release-please and the guard walk
# history in commit-date order, so tests can't leave that to chance.
clock=1767225600    # 2026-01-01
tick() { clock=$((clock + 60)); export GIT_AUTHOR_DATE="@$clock +0000" GIT_COMMITTER_DATE="@$clock +0000"; }

# A repo shaped like this one: config, manifest, a pom, backend/ and frontend/.
new_repo() {
    repo="$work/repo$RANDOM$RANDOM"
    mkdir -p "$repo/.github/scripts" "$repo/.githooks" "$repo/backend" "$repo/frontend" "$repo/bin"
    cd "$repo"
    git init -q -b develop
    git config user.name "Test" && git config user.email test@example.com && git config commit.gpgsign false
    cp "$src"/.github/scripts/*.sh .github/scripts/
    cp "$src"/.githooks/* .githooks/
    cp "$src"/release-please-config.json .
    set_version 1.0.0
    echo a >frontend/app.txt && echo a >backend/App.java
    tick && git add -A && git commit -qm "chore: init" && git tag backend-v1.0.0
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
commit() { tick; echo "$RANDOM" >>"$1"; git add -A; printf '%b\n' "$2" | git commit -q --no-verify -F -; }
# commit_at <unix time> <file to touch> <message>: a commit dated in the past
commit_at() {
    echo "$RANDOM" >>"$2"; git add -A
    printf '%b\n' "$3" | GIT_AUTHOR_DATE="@$1 +0000" GIT_COMMITTER_DATE="@$1 +0000" git commit -q --no-verify -F -
}
# What release-please does on develop: bump manifest + pom in one commit, tag it.
release_backend() { tick; set_version "$1"; git add -A; git commit -q --no-verify -m "chore(develop): release backend $1 (#$RANDOM)"; git tag "backend-v$1"; }
merge() { tick; git merge -q --no-ff --no-verify --no-edit -m "$(printf '%b' "$1")" "$2"; }    # message may contain \n
msg_file() { printf '%b\n' "$1" >"$work/msg"; echo "$work/msg"; }
check_msg() { local f; f=$(msg_file "$1"); shift; .github/scripts/check-commit-message.sh "$@" "$f"; }
x() { printf 'x%.0s' $(seq "$1"); }    # x 3 -> xxx

# ----------------------------------------------------------- commit messages
new_repo
for m in "fix: keep the donate tab on screen" "feat(api): add an events endpoint" \
    "feat!: drop the old contact payload" "deps: bump org.postgresql:postgresql from 42.7.4 to 42.7.5 in /backend" \
    "chore(develop): release backend 1.0.1 (#12)" "revert: fix: keep the donate tab on screen" \
    "fix: one\n\nA longer explanation." "\n\nfix: leading blank lines" "fixup! fix: something" \
    "fix: x\n\n# Please enter the commit message\n# ------------------------ >8 ------------------------\ndiff --git a/x b/x\nnot a summary" \
    "# a comment first\nfix: after a comment" "fix: $(x 95)" "fix: $(x 95) (#123)"; do
    expect_ok "valid: $m" check_msg "$m"
done
for m in "Fix the donate tab" "fix:no space" "fix : space before colon" "Fix: capital type" \
    "feature: unknown type" "fix(): empty scope" "fix: " "Revert \"fix: x\"" "fix: $(x 96)" "fix: $(x 96) (#123)" \
    "Merge duplicate user records" "Merge branch 'develop'"; do
    expect_fail "invalid: $m" "Commit message rejected" check_msg "$m"
done
expect_ok "a real merge may say Merge" check_msg "Merge pull request #12 from tunneln/dependabot/maven/backend/x" --merge
expect_ok "a real local merge may say Merge" check_msg "Merge branch 'develop'" --merge
expect_fail "invalid: no blank line before details" "blank line" check_msg "fix: one\nsecond line"
expect_fail "invalid in CI: fixup!" "autosquash" check_msg "fixup! fix: something" --ci
expect_fail "saved commit: a #-line is text, not a comment" "Commit message rejected" check_msg "#12 Update stuff" --ci
expect_fail "saved commit: empty message" "empty message" check_msg "" --ci
expect_ok "bots skip the length limit" check_msg "deps: $(x 150)" --no-length
git config core.commentChar ';'
expect_ok "custom comment character" check_msg "fix: x\n; Please enter the commit message"
expect_fail "custom comment character: # is text" "blank line" check_msg "fix: x\n# not a comment"
git config --unset core.commentChar
git config core.commentString '%%'
expect_ok "custom comment string (git 2.45+)" check_msg "fix: x\n%% Please enter the commit message"
git config --unset core.commentString
# The hooks themselves, through git.
git config core.hooksPath .githooks
tick && echo b >>frontend/app.txt && git add -A
expect_fail "hook blocks a bad message" "Commit message rejected" git commit -qm "update stuff"
expect_fail "hook blocks a plain commit that says Merge" "Commit message rejected" git commit -qm "Merge duplicate user records"
expect_ok "hook allows a good message" git commit -qm "fix: a good message"
tick && git checkout -q -b side && echo c >>frontend/app.txt && git commit -qam "fix: side work" && git checkout -q develop
tick && expect_ok "hook allows a real merge" git merge -q --no-ff --no-edit side
git config --unset core.hooksPath

# --------------------------------------------- CI and pre-push commit checks
new_repo
base=$(git rev-parse HEAD)
commit frontend/app.txt "fix: good one"
commit frontend/app.txt "bad one"
range() { env EVENT=push BEFORE="$base" HEAD="$(git rev-parse HEAD)" .github/scripts/check-commit-range.sh; }
expect_fail "push range with a bad commit" "bad one" range
git reset -q --hard HEAD~1
expect_ok "push range all good" range
expect_ok "new branch push checks only the newest commit" env EVENT=push BEFORE=0000000000000000000000000000000000000000 HEAD="$(git rev-parse HEAD)" .github/scripts/check-commit-range.sh
pr() { env EVENT=pull_request BASE="$base" HEAD="$(git rev-parse HEAD)" PR_TITLE="$1" PR_AUTHOR="$2" .github/scripts/check-commit-range.sh; }
expect_fail "pull request with a bad title" "Pull request title" pr "Update things" someone
expect_fail "pull request titled Merge ..." "Pull request title" pr "Merge duplicate user records" someone
expect_ok "Dependabot PR with a long title" pr "deps: $(x 120)" "dependabot[bot]"
GIT_AUTHOR_NAME="dependabot[bot]" commit backend/App.java "deps: $(x 120)"
expect_ok "bot commit with a long summary" range
git checkout -q -b feature && commit frontend/app.txt "feat: feature work" && git checkout -q develop
merge "Merge branch 'feature'" feature
expect_ok "a real merge commit passes" range
commit frontend/app.txt "Merge the user records fix"
expect_fail "a plain commit that says Merge fails" "Merge the user records fix" range
git reset -q --hard HEAD~1
# pre-push, against a bare "origin".
git init -q --bare "$work/origin.git" && git remote add origin "$work/origin.git"
git push -q origin develop && git push -q origin develop:main
git config core.hooksPath .githooks
commit frontend/app.txt "fix: pushed fine"
expect_ok "pre-push allows good commits" git push -q origin develop
tick && git revert --no-edit HEAD >/dev/null
expect_fail "pre-push stops a git revert's default message" "Push stopped" git push -q origin develop
git reset -q --hard HEAD~1
git checkout -q -b topic && GIT_AUTHOR_NAME=Test commit frontend/app.txt "wip"
expect_fail "pre-push checks a new branch" "Push stopped" git push -q origin topic
git checkout -q develop && git branch -q -D topic
git checkout -q -b topic2 && commit frontend/app.txt "feat: new branch work"
expect_ok "pre-push allows a good new branch" git push -q origin topic2
git checkout -q develop && commit frontend/app.txt "Edited on GitHub" && git push -q --no-verify origin develop && git fetch -q origin
expect_ok "pre-push allows a release, even with a bad commit already on develop" git push -q origin origin/develop:main
commit frontend/app.txt "Another bad one"
expect_fail "pre-push still stops a new bad commit on develop" "Push stopped" git push -q origin develop
git reset -q --hard origin/develop
git config --unset core.hooksPath

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
merge "Merge pull request #7 from tunneln/dependabot" dependabot
expect_fail "versioned change inside a merge commit" "deps: bump y" "$guard"
release_backend 1.1.0
# A change made and undone on a side branch nets to nothing, but release-please
# still counts its commits, so the guard must see them too.
git checkout -q -b tweak && commit backend/App.java "fix: tweak the backend"
tick && git checkout -q HEAD~1 -- backend/App.java && git commit -q --no-verify -m "revert: undo the tweak" && git checkout -q develop
merge "Merge branch 'tweak'" tweak
expect_fail "versioned change undone on a side branch" "fix: tweak the backend" "$guard"
release_backend 1.1.5
# A branch whose commits are older than the latest version, merged with a merge
# commit: release-please stops at the version and never reads them, so the guard
# must not block every release on them. It warns instead.
git checkout -q -b old-branch && commit_at $((clock - 86400)) backend/Deps.java "deps: bump z in /backend"
git checkout -q develop && commit backend/App.java "fix: newer fix" && release_backend 1.1.6
merge "Merge pull request #9 from tunneln/old-branch\n\ndeps: bump z in /backend" old-branch
expect_ok_saying "older merged-in change: warn, don't block" "missed: [0-9a-f]+ deps: bump z" "$guard"
# But a merge commit whose message carries a fix: paragraph (GitHub puts the PR title
# there) is versioned by release-please, so it must wait for its version like any fix.
git checkout -q -b old-fix && commit_at $((clock - 86400)) backend/Legacy.java "fix: stop the legacy crash"
git checkout -q develop && merge "Merge pull request #10 from tunneln/old-fix\n\nfix: stop the legacy crash" old-fix
expect_fail "merge commit with a fix: paragraph needs a version" "Merge pull request #10" "$guard"
release_backend 1.1.7
out=$("$guard" 2>&1) && ! grep -q "missed" <<<"$out" && ok || bad "versioned merge: no warning left" "$out"
commit backend/App.java "fix: after the old merge"
expect_fail "newer changes still need a version after a warning" "fix: after the old merge" "$guard"
release_backend 1.1.8
# Release-please splits a message at blank lines followed by feat/fix/perf/revert
# (and other types it never versions), but not deps or "!"; the guard mirrors that.
commit backend/App.java "chore: tidy\n\nfix: also stop the null crash"
expect_fail "a fix: paragraph inside another commit needs a version" "chore: tidy" "$guard"
release_backend 1.1.9
commit backend/App.java "chore: tidy\n\ndeps: bump y\n\nfeat!: not split by release-please"
expect_ok "deps: and type!: paragraphs aren't split out" "$guard"
set_version 1.1.0 1.1.1 && tick && git add -A && git commit -q --no-verify -m "chore: hand-edited pom"
expect_fail "pom and manifest disagree" "pom.xml says 1.1.1" "$guard"
set_version 1.2.0 && tick && git add -A && git commit -q --no-verify -m "chore: manifest ahead of its tag"
expect_fail "manifest version not tagged yet" "doesn't exist yet" "$guard"
tick && git checkout -q --orphan elsewhere && git commit -q --no-verify -m "chore: unrelated" && git tag backend-v1.2.0 && git checkout -q develop
expect_fail "tag not in this history" "isn't part of this commit's history" "$guard"

# -------------------------------------------------------------- release tagging
new_repo
noon=1783184400                         # 2026-07-04 12:00 in Dallas
tagit() { env GITHUB_SHA="$(git rev-parse HEAD)" GITHUB_REPOSITORY=owner/repo BEFORE="$1" PUSHED_AT="${2:-$noon}" GITHUB_STEP_SUMMARY= .github/scripts/tag-release.sh; }
before=$(git rev-parse HEAD)
commit frontend/app.txt "fix: first frontend fix"
expect_ok "first release" tagit "$before"
[ "$(git tag --points-at HEAD)" = "2026.07.04-backend-1.0.0" ] && ok || bad "first release tag name" "$(git tag --points-at HEAD)"
notes="$GH_LOG.2026.07.04-backend-1.0.0"
grep -q "new in this release" "$notes" && grep -q "fix: first frontend fix" "$notes" && ok || bad "first release notes" "$(cat "$notes")"
grep -q -- "--latest" "$GH_LOG" && ok || bad "release marked latest" "$(cat "$GH_LOG")"
calls=$(wc -l <"$GH_LOG")
expect_ok "re-run of the same push" tagit "$before"
[ "$(wc -l <"$GH_LOG")" = "$calls" ] && ok || bad "re-run must not create a release" "$(cat "$GH_LOG")"
prev=$(git rev-parse HEAD)
commit frontend/app.txt "fix: second frontend fix"
expect_ok "second release the same day" tagit "$prev"
notes="$GH_LOG.2026.07.04.2-backend-1.0.0"
[ -f "$notes" ] && grep -q "(unchanged)" "$notes" && grep -q "second frontend fix" "$notes" && ! grep -q "first frontend fix" "$notes" && ok || bad "second release tag and notes" "$(git tag; cat "$notes" 2>/dev/null)"
prev=$(git rev-parse HEAD)
commit backend/App.java "fix: backend bug"
release_backend 1.0.1
git checkout -q -b side && commit frontend/app.txt "feat: merged work" && git checkout -q develop && merge "Merge branch 'side'" side
expect_ok "third release with a new backend version" tagit "$prev"
notes="$GH_LOG.2026.07.04.3-backend-1.0.1"
[ -f "$notes" ] && grep -q "Backend 1.0.1 (new in this release)" "$notes" && grep -q "fix: backend bug" "$notes" && ! grep -q "Merge branch" "$notes" && grep -q "releases/tag/backend-v1.0.1" "$notes" && ok || bad "third release tag and notes" "$(git tag; cat "$notes" 2>/dev/null)"
# Dated by the push, in Dallas time, on either side of midnight.
prev=$(git rev-parse HEAD) && commit frontend/app.txt "fix: late push"
expect_ok "release pushed at 11:59:59 PM" tagit "$prev" 1783227599
[ "$(git tag --points-at HEAD)" = "2026.07.04.4-backend-1.0.1" ] && ok || bad "11:59:59 PM push is the same day" "$(git tag --points-at HEAD)"
prev=$(git rev-parse HEAD) && commit frontend/app.txt "fix: midnight push"
expect_ok "release pushed at midnight" tagit "$prev" 1783227600
[ "$(git tag --points-at HEAD)" = "2026.07.05-backend-1.0.1" ] && ok || bad "midnight push is the next day" "$(git tag --points-at HEAD)"

echo "release script tests: $passed passed, $failed failed"
[ "$failed" -eq 0 ]
