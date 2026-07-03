# Cutover & Ops Runbook

Moving tombossabfoundation.org from "old jar + nginx on Lightsail" to
"Vercel frontend + this Docker stack (`api.` subdomain)". The old site keeps
serving production until step 7 — every step before that is reversible by
simply not proceeding, and afterwards by DNS revert (step 9).

## 0. Prerequisites (one-time provisioning)

- **S3 backups**: create bucket `tombossab-backups`, add a 30-day expiry
  lifecycle rule on prefix `pg/`, create an IAM user with `s3:PutObject` on
  that prefix only; configure its keys on the box (`aws configure`).
- **GitHub**: repo secrets `LIGHTSAIL_HOST`, `LIGHTSAIL_USER`,
  `LIGHTSAIL_SSH_KEY` (a deploy-only keypair), `REVALIDATE_SECRET`
  (generate: `openssl rand -hex 32`). Leave repo variable `DEPLOY_ENABLED`
  unset for now (the deploy workflow is a no-op until step 8).
- **Vercel**: create the project with root directory `frontend/`, framework
  Next.js, Node 22. Environment variables (Production):
  `API_BASE_URL=https://api.tombossabfoundation.org`,
  `NEXT_PUBLIC_API_BASE_URL=https://api.tombossabfoundation.org`,
  `REVALIDATE_SECRET=<same value as the GitHub secret>`.
  Do NOT set them for Preview — previews render fixtures by design.

## 1. Prepare the box (does not touch the live site)

```bash
# as the admin user on the Lightsail box
sudo dnf install -y docker && sudo systemctl enable --now docker
sudo usermod -aG docker $USER   # re-login
# docker compose v2 plugin if not bundled:
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -fsSL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
  -o /usr/local/lib/docker/cli-plugins/docker-compose && sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
# 1 GB swap as OOM insurance (2 GB box running JVM + Postgres):
sudo fallocate -l 1G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

Copy this `deploy/` directory to `/opt/tombossab/deploy`, create `.env` from
`.env.example` with real values (Postgres password, SMTP password), and
install the backup cron: `crontab -l | cat - backup/crontab.txt | crontab -`.

## 2. First stack boot — on alternate ports

nginx currently owns 80/443 for the old site, so bring Caddy up on side ports
for smoke testing. Temporarily add to the `caddy:` service in
`docker-compose.yml`: change ports to `"8081:80"` and `"8444:443"`.

```bash
cd /opt/tombossab/deploy
docker login ghcr.io          # or build the image locally: docker build -t ghcr.io/tunneln/tombossab-backend:latest ../backend
docker compose up -d
docker compose ps             # app + db healthy
docker compose exec app wget -qO- http://127.0.0.1:8080/actuator/health
```

## 3. DNS: point `api.` at the box (zero traffic risk — new name)

Add an `A` record: `api.tombossabfoundation.org → <Lightsail static IP>`.
Open the Lightsail firewall for ports 80 and 443 if not already.

## 4. Give Caddy the real ports

Caddy needs :80 for the Let's Encrypt HTTP challenge. nginx keeps :80/:443
for the apex site, so for coexistence during the transition EITHER:

- **Option A (recommended, simplest):** proxy through nginx until cutover —
  add an nginx server block for `api.tombossabfoundation.org` proxying to
  `127.0.0.1:8081`, with its own certbot cert. Keep Caddy on side ports.
- **Option B:** skip TLS smoke now and jump to step 7 in one maintenance
  window (the stack is already proven over HTTP in step 2).

Then verify from your laptop:

```bash
curl -s https://api.tombossabfoundation.org/api/recipients | head -c 120
curl -s -X POST https://api.tombossabfoundation.org/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Cutover Test","email":"you@example.com","phone":"555","message":"prod smoke"}' -i
# expect 202; the contact@ inbox receives the notification (real SMTP now)
curl -s -o /dev/null -w '%{http_code}\n' https://api.tombossabfoundation.org/actuator/env   # 403
```

## 5. Vercel production deploy + cross-origin check

Deploy via the Vercel Git integration (push/redeploy). On the production URL,
open the site in a real browser and submit the contact form — this exercises
the CORS preflight from the real origin. Verify recipients/newsletters/events
pages show content (DB-backed), and `POST /api/revalidate` with the secret
returns `{"revalidated":true}`.

## 6. DNS cutover: apex + www → Vercel

In Vercel, add domains `tombossabfoundation.org` and `www`; set the DNS
records it prescribes (A/ALIAS + CNAME). Lower TTL beforehand if possible.
The old jar + nginx keep answering stragglers until TTL expires.

## 7. Retire nginx; Caddy takes 80/443

Once apex traffic is on Vercel (check nginx access logs go quiet):

```bash
sudo systemctl disable --now nginx
# remove the temporary side-port mapping; restore ports "80:80" and "443:443"
cd /opt/tombossab/deploy && docker compose up -d
# stop the old jar service too (systemd unit or however it was launched):
sudo systemctl disable --now <old-jar-service>
```

Caddy issues the `api.` certificate automatically. Verify step 4's curls again
plus the two legacy redirects on the new site:
`/coffee-women-empowerment` and `/events-detail` → 308 → the event page.

## 8. Arm the pipeline + first backup

- Set repo variable `DEPLOY_ENABLED=true` — pushes to `main` touching
  `backend/**` or `deploy/**` now build, deploy, and revalidate automatically.
- Run one manual backup and verify the object lands in S3:
  `/opt/tombossab/deploy/backup/pg-backup.sh`
- Restore drill (do this once): `aws s3 cp s3://tombossab-backups/pg/<date>.sql.gz - | gunzip | docker compose exec -T db psql -U tombossa tombossa_restore_test`

## 9. Rollback levers

- Anything wrong after step 6: point apex DNS back at the Lightsail IP —
  nginx + old jar are still installed until you remove them (keep them for a
  grace week).
- Backend-only trouble: `docker compose pull app && docker compose up -d`
  with the previous image tag (`ghcr.io/tunneln/tombossab-backend:<old-sha>`).
- Content page trouble on Vercel: instant rollback to any previous deployment
  in the Vercel dashboard.
