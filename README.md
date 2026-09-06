# bot-dev-test

Simple Node/Express web app for Dev Lead harness testing:
Grok build → Codex evals → GitHub Actions → GHCR → Flux → MicroK8s NodePort.

## Local
```bash
npm install
npm test
npm start
# http://127.0.0.1:8080  and  /health
```

## Docker
```bash
docker build -t ghcr.io/script-repo/bot-dev-test:local .
docker run --rm -p 8080:8080 ghcr.io/script-repo/bot-dev-test:local
```

## GHCR
Push to `main` runs `.github/workflows/ghcr.yml` and publishes:
- `ghcr.io/script-repo/bot-dev-test:latest`
- `ghcr.io/script-repo/bot-dev-test:<sha>`

## MicroK8s / Flux
Manifests live in `deploy/` (Deployment + NodePort Service `30080`).
Flux examples: `deploy/flux/`.

After image is in GHCR and Flux/Kustomize is applied:
```bash
curl http://<node-ip>:30080/health
```

Cluster policy for this lab uses **NodePort** (coordinate with MicroK8s operator).
