#!/usr/bin/env bash
# Nightly Postgres dump to S3. Requires awscli configured (or an instance role)
# and the compose stack running. Installed via crontab.txt.
set -euo pipefail

DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DEPLOY_DIR"

set -a
# shellcheck disable=SC1091
source ./.env
set +a

BUCKET="${BACKUP_BUCKET:-tombossab-backups}"
KEY="pg/$(date +%F).sql.gz"

docker compose exec -T db pg_dump -U "${POSTGRES_USER:-tombossa}" "${POSTGRES_DB:-tombossa}" \
  | gzip \
  | aws s3 cp - "s3://${BUCKET}/${KEY}"

echo "backup ok: s3://${BUCKET}/${KEY}"
