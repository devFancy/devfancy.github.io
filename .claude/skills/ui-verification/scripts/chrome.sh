#!/usr/bin/env bash
# 측정용 헤드리스 크롬을 9333 포트로 띄운다. 이미 떠 있으면 아무것도 하지 않는다.
set -e
PORT="${1:-9333}"
if curl -s -m 1 "http://127.0.0.1:$PORT/json/version" >/dev/null 2>&1; then
  echo "이미 떠 있음 (포트 $PORT)"; exit 0
fi
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CHROME" ] || CHROME="$(command -v chromium || command -v google-chrome)"
[ -x "$CHROME" ] || { echo "크롬을 찾지 못했습니다"; exit 1; }
"$CHROME" --headless=new --remote-debugging-port="$PORT" --remote-allow-origins='*' \
  --user-data-dir="/tmp/cdp-prof-$PORT" --no-first-run about:blank >/dev/null 2>&1 &
for _ in $(seq 1 10); do
  curl -s -m 1 "http://127.0.0.1:$PORT/json/version" >/dev/null 2>&1 && { echo "준비 완료 (포트 $PORT)"; exit 0; }
  sleep 1
done
echo "띄우지 못했습니다"; exit 1
