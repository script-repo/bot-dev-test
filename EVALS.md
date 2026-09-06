# Codex eval checklist — bot-dev-test

Use Codex CLI on lab-hp to verify this harness app.

## Checks
1. `npm install && npm test` passes.
2. `docker build -t bot-dev-test:local .` succeeds.
3. Container serves `GET /health` → `{"status":"ok"}` and `/` contains `Harness online`.
4. Kubernetes manifests under `deploy/` are valid YAML and Service is `type: NodePort` with `nodePort: 30080`.
5. `.github/workflows/ghcr.yml` builds/pushes `ghcr.io/script-repo/bot-dev-test`.

## Commands
```bash
npm install && npm test
docker build -t bot-dev-test:local .
docker run --rm -p 8080:8080 bot-dev-test:local
BASE_URL=http://127.0.0.1:8080 ./scripts/eval-checklist.sh
kubectl apply --dry-run=client -k deploy/
```
