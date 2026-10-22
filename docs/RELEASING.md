# Commits, versions, and releases

Work lands on `develop`. Fast-forwarding `main` to `develop` is a release: Vercel
deploys the frontend and `deploy.yml` deploys the backend. Two kinds of tag record
what happened:

| Tag | Example | Made by | Means |
|---|---|---|---|
| Backend version | `backend-v1.4.1` | release-please, on `develop` | The API reached this version. Only changes when `backend/` does. |
| Release | `2026.10.21-backend-1.4.1` | `release.yml`, on `main` | This batch went live on Oct 21 (Dallas time), with backend 1.4.1. A second release that day is `2026.10.21.2-…`. |

Tags are permanent: never move or delete one. A tag says a version exists; GitHub's
**Deployments** page (`api-production`) says what's actually live.

## Commit messages

```
type: summary            fix: keep the donate tab on screen
type(scope): summary     feat(api): add an events endpoint
type!: summary           feat!: drop the old contact payload   (breaking change)
```

Keep the summary to 100 characters or fewer, with a blank line before any
details. A git hook checks every commit, and CI checks again on push.

| Type | Use for | New backend version? (only if it touches `backend/`) |
|---|---|---|
| `feat` | new behavior | yes, minor: 1.4.1 → 1.5.0 |
| `fix` | bug fix | yes, patch: 1.4.1 → 1.4.2 |
| `perf` | faster, same behavior | yes, patch |
| `deps` | dependency upgrade that ships (Dependabot uses it) | yes, patch |
| `revert` | undoing an earlier commit: `revert: fix: keep the donate tab on screen` | yes, patch |
| `refactor`, `docs`, `test`, `build`, `ci`, `chore`, `style` | everything else | no |
| any type with `!` | breaking API change | yes, major: 1.4.1 → 2.0.0 |

Breaking changes should be rare: add first and remove later ("expand, then contract").
A new field or endpoint ships in one release, and the old one is removed in a later
release once nothing uses it. That keeps every rollback safe.

## Day to day

1. Branch off `develop`, commit, and merge back into `develop` (fast-forward).
2. `git push origin develop`.
3. If the push included a backend `feat`/`fix`/`perf`/`deps`/`revert`, the
   **Version backend** workflow bumps `backend/pom.xml`, writes
   `backend/CHANGELOG.md`, tags `backend-vX.Y.Z`, and pushes that as one commit to
   `develop` (about a minute). Pull before your next push: `git pull --rebase`.
   Frontend-only pushes change nothing.

## Releasing

When the **Version backend** run for your last push is green:

```bash
git fetch origin && git push origin origin/develop:main
```

The **Release** workflow tags the release and publishes its notes; Vercel and
**Deploy backend** ship it.

If **Release** fails with "These backend changes aren't in a version yet", the
version commit hadn't reached `develop` when you pushed. Wait for **Version backend**
to finish and run the same command again. Nothing was tagged or deployed.

## Rolling back

- **Frontend:** Vercel → Deployments → Instant Rollback for an emergency. Then
  `git revert` the bad commit (message `revert: <original summary>`) and release
  normally. Never force-push `main` or `develop`.
- **Backend:** Actions → **Deploy backend** → Run workflow → "Use workflow from" →
  pick the tag, e.g. `backend-v1.4.0`. It builds and deploys that version. Then fix
  forward with a `revert:` or `fix:` commit.
- **Database:** rolling back the app doesn't undo migrations; the expand-then-contract
  rule above keeps old app versions working. Nightly backups are the last resort.

## Never by hand

- The version in `backend/pom.xml`, `.release-please-manifest.json`, and
  `backend/CHANGELOG.md`: release-please owns them. The Release check fails if the
  pom and manifest disagree.
- Tags: workflows create them all.

## One-time setup

- **Each clone:** turn on the commit-message hook:
  `git config core.hooksPath .githooks` (needs `jq`; macOS ships it).
- **The GitHub repo, once:** Settings → Actions → General → Workflow permissions →
  tick "Allow GitHub Actions to create and approve pull requests". Without it,
  **Version backend** can't open its version PR.

## How it works

- `release-please-config.json` + `.release-please-manifest.json`: release-please
  versions the `backend` package (Maven type) and keeps the commit types above.
- `.github/workflows/version.yml` (push to `develop`): release-please opens a
  version PR, the workflow merges and tags it in the same run. Its first ever run
  tags the starting version, `backend-v1.0.0`.
- `.github/workflows/release.yml` (push to `main`): `check-backend-version.sh`
  then `tag-release.sh`.
- `.github/workflows/deploy.yml`: runs the same check before deploying a push.
- `.githooks/commit-msg` and CI's `release-tooling` job: `check-commit-message.sh`.
- `.github/scripts/test-release-scripts.sh`: tests for all of the scripts (CI runs it).
