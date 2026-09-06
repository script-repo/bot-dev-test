#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:8080}"

echo "== eval against ${BASE_URL} =="
curl -fsS "${BASE_URL}/health" | tee /tmp/bot-dev-test-health.json
grep -q '"status":"ok"' /tmp/bot-dev-test-health.json
curl -fsS "${BASE_URL}/" | grep -q "avatar.js"
curl -fsS "${BASE_URL}/avatar.js" | grep -q "speechSynthesis"
echo "OK: health + avatar page + TTS script"
