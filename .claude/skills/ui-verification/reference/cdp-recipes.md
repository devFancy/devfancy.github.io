# 측정 스크립트 조각

Node 22 + 헤드리스 크롬으로 잰다. 붙여 쓰면 된다.

## 크롬 띄우기

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --remote-debugging-port=9333 --remote-allow-origins='*' \
  --user-data-dir=/tmp/cdp-prof --no-first-run about:blank &
for i in $(seq 1 8); do curl -s -m 1 http://127.0.0.1:9333/json/version >/dev/null && break; sleep 1; done
```

## 뼈대

```js
const wait=(ms)=>new Promise(r=>setTimeout(r,ms));
const list=await(await fetch('http://127.0.0.1:9333/json/list')).json();
const t=list.find(x=>x.type==='page');
const ws=new WebSocket(t.webSocketDebuggerUrl);
let id=0;const pend=new Map();
const send=(m,p={})=>new Promise(res=>{const i=++id;pend.set(i,res);ws.send(JSON.stringify({id:i,method:m,params:p}))});
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pend.has(m.id)){pend.get(m.id)(m.result);pend.delete(m.id)}};
await new Promise(r=>ws.onopen=r); await send('Page.enable');
const ev=(e)=>send('Runtime.evaluate',{returnByValue:true,expression:e}).then(r=>r.result.value);
```

실행은 nvm 을 태워서 한다.

```bash
env -i PATH=/usr/bin:/bin HOME=$HOME bash -lc \
  'export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh" >/dev/null; nvm use 22 >/dev/null; node measure.mjs'
```

## 뷰포트 고정

```js
await send('Emulation.setDeviceMetricsOverride',
  {width:390,height:844,deviceScaleFactor:3,mobile:true});   // iPhone 14
  // {width:375,height:667,deviceScaleFactor:2,mobile:true}  // SE
  // {width:1440,height:900,deviceScaleFactor:2,mobile:false}// 데스크톱
```

## 요소 위치 (스크롤 뒤에 다시 읽는다)

```js
const at = async (sel) => {
  await ev(`document.querySelector(${JSON.stringify(sel)}).scrollIntoView({block:'center'})`);
  await wait(400);                                  // 스크롤이 끝나기를 기다린다
  return JSON.parse(await ev(`(()=>{const r=document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect();
    return JSON.stringify({x:Math.round(r.x+r.width/2), y:Math.round(r.y+r.height/2),
      pageTop:Math.round(r.top+scrollY), h:Math.round(r.height)});})()`));
};
```

## 호버 (반드시 :hover 를 같이 확인한다)

```js
const hover = async (sel) => {
  const p = await at(sel);
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:p.x,y:p.y});
  await wait(450);                                  // transition 이 끝나기를 기다린다
  return await ev(`(()=>{const e=document.querySelector(${JSON.stringify(sel)}); const c=getComputedStyle(e);
    return (e.matches(':hover')?'':'[커서 안 닿음] ')+c.backgroundColor+' / '+c.color+' / '+c.borderTopColor;})()`);
};
const away = async () => { await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:3,y:3}); await wait(250); };
```

## 클릭 (누른 뒤 자리가 바뀌므로 좌표를 다시 읽는다)

```js
const click = async (sel) => {
  const p = await at(sel);
  await send('Input.dispatchMouseEvent',{type:'mousePressed',x:p.x,y:p.y,button:'left',clickCount:1});
  await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:p.x,y:p.y,button:'left',clickCount:1});
  await wait(450);
};
```

## 터치 (모바일에서 hover 가 남는지 볼 때)

```js
await send('Emulation.setEmitTouchEventsForMouse',{enabled:true,configuration:'mobile'});
const tap = async (p) => {
  await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:p.x,y:p.y}]});
  await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await wait(400);
};
```

## 테마 전환

```js
await ev(`document.documentElement.setAttribute('data-theme','dark')`);  // 또는 'light'
await wait(350);
```

## 스크린샷 (clip 은 문서 좌표다)

```js
const p = await at(sel);
const shot = await send('Page.captureScreenshot',
  {format:'png', clip:{x:0, y:Math.max(0,p.pageTop-80), width:1100, height:400, scale:1},
   captureBeyondViewport:true});
fs.writeFileSync('shot.png', Buffer.from(shot.data,'base64'));
```

## 시안 비교 (CSS 를 주입해 두 가지를 찍는다)

```js
for (const [name, css] of [['A',''], ['B','.chip:hover{background:var(--color-accent)!important}']]) {
  await send('Page.navigate',{url}); await wait(2000);
  if (css) await ev(`(()=>{const s=document.createElement('style');s.textContent=${JSON.stringify(css)};document.head.appendChild(s);})()`);
  // ... 호버 + 스크린샷
}
```

## 가로 넘침

```js
await ev(`JSON.stringify({넘침: document.documentElement.scrollWidth - innerWidth})`);
// 0 이면 정상. 음수는 세로 스크롤바 폭이라 정상
```

## 첫 화면 예산

```js
await ev(`(()=>{const V=innerHeight; const e=document.querySelector(SEL); const r=e.getBoundingClientRect();
  return JSON.stringify({시작:Math.round(r.top+scrollY), 높이:Math.round(r.height),
    첫화면에보이는양: Math.max(0, Math.min(r.bottom,V) - Math.max(r.top,0))|0});})()`);
```

## 대비비

```js
const lum=(c)=>{const [r,g,b]=c.match(/\d+/g).map(Number).map(v=>{v/=255;
  return v<=0.03928? v/12.92 : ((v+0.055)/1.055)**2.4;}); return .2126*r+.7152*g+.0722*b;};
const ratio=(a,b)=>{const [x,y]=[lum(a),lum(b)].sort((m,n)=>n-m); return ((x+.05)/(y+.05)).toFixed(2);};
// 본문 링크는 4.5:1 이상
```

## 강제 상태 (마우스를 못 올리는 요소)

```js
await send('DOM.enable'); await send('CSS.enable');
const doc = await send('DOM.getDocument',{depth:-1});
const {nodeId} = await send('DOM.querySelector',{nodeId:doc.root.nodeId, selector:sel});
await send('CSS.forcePseudoState',{nodeId, forcedPseudoClasses:['hover']});
```

진짜 마우스를 쓸 수 있으면 그쪽이 낫다. 강제 상태는 `:hover` 안에서만 도는 JS 를 안 돌린다.
