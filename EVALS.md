# Codex eval checklist — bot-dev-test

Use Codex CLI on lab-hp to verify this harness app.

## Checks
1. `npm install && npm test` passes (health + avatar page + avatar.js).
2. `docker build` / `podman build` succeeds.
3. Container serves `GET /health` → `{"status":"ok"}` and `/` references `avatar.js` / three.js.
4. `avatar.js` includes Speech Synthesis (“Hello world”) and caption/mouth logic.
5. Kubernetes manifests under `deploy/` are valid YAML and Service is `type: NodePort` with `nodePort: 30080`.
6. `.github/workflows/ghcr.yml` builds/pushes `ghcr.io/script-repo/bot-dev-test`.

## Commands
```bash
npm install && npm test
docker build -t bot-dev-test:local .
docker run --rm -p 8080:8080 bot-dev-test:local
BASE_URL=http://127.0.0.1:8080 ./scripts/eval-checklist.sh
kubectl apply --dry-run=client -k deploy/
```
