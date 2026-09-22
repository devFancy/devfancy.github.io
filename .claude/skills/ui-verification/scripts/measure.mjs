#!/usr/bin/env node
/* 화면 상태를 실제 마우스 이벤트로 재서 표로 내놓는다.
 *
 *   node measure.mjs spec.json
 *
 * 준비: 헤드리스 크롬이 9333 포트로 떠 있어야 한다 (scripts/chrome.sh)
 * spec 형식은 ../reference/spec.example.json 참고
 */
import fs from 'node:fs';

const spec = JSON.parse(fs.readFileSync(process.argv[2] ?? 'spec.json', 'utf8'));
const PORT = spec.cdpPort ?? 9333;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const tabs = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
const page = tabs.find((x) => x.type === 'page');
if (!page) { console.error('크롬 탭을 찾지 못했습니다. chrome.sh 를 먼저 실행하세요.'); process.exit(1); }

const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0; const pend = new Map();
const send = (method, params = {}) =>
  new Promise((res) => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id); } };
await new Promise((r) => (ws.onopen = r));
await send('Page.enable');

const ev = (expr) => send('Runtime.evaluate', { returnByValue: true, expression: expr }).then((r) => r.result?.value);
const q = (s) => JSON.stringify(s);

/* 스크롤이 끝난 뒤에 좌표를 다시 읽는다. 이 순서를 지키지 않으면 커서가 빗나간다 */
async function boxOf(sel) {
  const n = await ev(`document.querySelectorAll(${q(sel)}).length`);
  if (!n) return null;
  await ev(`document.querySelector(${q(sel)}).scrollIntoView({block:'center'})`);
  await wait(spec.scrollWait ?? 420);
  return JSON.parse(await ev(`(()=>{const r=document.querySelector(${q(sel)}).getBoundingClientRect();
    return JSON.stringify({x:Math.round(r.x+Math.min(r.width/2,110)), y:Math.round(r.y+r.height/2),
      w:Math.round(r.width), h:Math.round(r.height)});})()`));
}

/* 값을 읽을 때 :hover 가 실제로 붙었는지 같이 확인한다 */
async function readOf(sel) {
  return JSON.parse(await ev(`(()=>{const e=document.querySelector(${q(sel)}); if(!e) return '{}';
    const c=getComputedStyle(e);
    return JSON.stringify({hover:e.matches(':hover'), pressed:e.getAttribute('aria-pressed'),
      bg:c.backgroundColor, fg:c.color, bd:c.borderTopColor, h:Math.round(e.getBoundingClientRect().height)});})()`));
}

const move = async (p) => { await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: p.x, y: p.y }); await wait(spec.hoverWait ?? 460); };
const away = async () => { await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 3, y: 3 }); await wait(220); };
const press = async (p) => {
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: p.x, y: p.y, button: 'left', clickCount: 1 });
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: p.x, y: p.y, button: 'left', clickCount: 1 });
  await wait(spec.clickWait ?? 460);
};

const rows = [];
for (const vp of spec.viewports ?? [{ w: 1440, h: 900, dpr: 2, mobile: false, name: '데스크톱' }]) {
  await send('Emulation.setDeviceMetricsOverride',
    { width: vp.w, height: vp.h, deviceScaleFactor: vp.dpr ?? 2, mobile: !!vp.mobile });
  for (const theme of spec.themes ?? ['light']) {
    for (const c of spec.cases) {
      await send('Page.navigate', { url: (spec.base ?? '') + c.url });
      await wait(spec.navWait ?? 1800);
      if (theme) { await ev(`document.documentElement.setAttribute('data-theme','${theme}')`); await wait(320); }

      /* actions 를 순서대로 밟으면서 매번 상태를 적는다 */
      const steps = c.actions ?? ['hover'];
      let stepName = '기본';
      const before = await boxOf(c.sel);
      if (!before) { rows.push({ vp: vp.name, theme, label: c.label, step: '대상 없음', out: '-' }); continue; }
      rows.push({ vp: vp.name, theme, label: c.label, step: stepName, ...(await readOf(c.sel)) });

      for (const a of steps) {
        const p = await boxOf(c.sel);          // 클릭으로 목록이 다시 그려질 수 있어 매번 다시 읽는다
        if (!p) break;
        if (a === 'hover') { await move(p); stepName = '호버'; }
        else if (a === 'click') { await press(p); stepName = '클릭'; }
        else if (a === 'away') { await away(); stepName = '커서 뗌'; }
        rows.push({ vp: vp.name, theme, label: c.label, step: stepName, ...(await readOf(c.sel)) });
      }
      await away();
    }
  }
}
ws.close();

const pad = (s, n) => String(s ?? '').padEnd(n);
console.log(pad('뷰포트', 10) + pad('테마', 7) + pad('대상', 26) + pad('단계', 9) + pad('배경', 24) + pad('글자', 24) + '상태');
for (const r of rows) {
  /* 기본·커서 뗌 단계는 커서가 없는 것이 정상이다. 호버를 시켰는데 안 닿았을 때만 알린다 */
  const missed = r.step === '호버' && r.hover === false;
  const state = [missed ? '커서안닿음 <-확인' : '', r.pressed === 'true' ? '선택됨' : ''].filter(Boolean).join(' ');
  console.log(pad(r.vp, 10) + pad(r.theme, 7) + pad(r.label, 26) + pad(r.step, 9) + pad(r.bg ?? r.out, 24) + pad(r.fg, 24) + state);
}
