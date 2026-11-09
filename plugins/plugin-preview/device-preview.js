import { normalizeViewport, VIEWPORT_PRESETS } from './devices.js'

export function viewportFromUrl(url) {
  const query = new URL(url, 'http://localhost').searchParams
  const values = {}
  for (const key of ['preset', 'orientation']) if (query.has(key)) values[key] = query.get(key)
  for (const key of ['width', 'height', 'deviceScaleFactor']) if (query.has(key)) values[key] = Number(query.get(key))
  for (const key of ['isMobile', 'hasTouch']) if (query.has(key)) {
    if (!['true', 'false'].includes(query.get(key))) throw new Error(`${key} 必须为 true 或 false`)
    values[key] = query.get(key) === 'true'
  }
  return normalizeViewport(values)
}

// The frame hosts the real same-origin DSH page. Only its CSS viewport is emulated here.
export function renderDevicePreview(viewport) {
  const state = JSON.stringify({ viewport, presets: VIEWPORT_PRESETS }).replaceAll('<', '\\u003c')
  return `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DSH 仅布局视口预览</title>
<style>
:root{color-scheme:light dark;font:13px/1.5 system-ui,sans-serif;background:light-dark(#f4f6fa,#151820);color:light-dark(#273044,#e0e5ef)}*{box-sizing:border-box}body{margin:0}header{padding:12px 16px;border-bottom:1px solid light-dark(#d8dfeb,#353e50);background:light-dark(#fff,#202632)}.bar{display:flex;align-items:center;flex-wrap:wrap;gap:10px}h1{font-size:14px;margin:0 auto 0 0}.bar label{display:flex;align-items:center;gap:6px}button,select,input,a{font:inherit;min-height:36px;border:1px solid light-dark(#cbd3e0,#515d72);border-radius:7px;padding:5px 9px;color:inherit;background:light-dark(#fff,#252e3d)}a{display:inline-flex;align-items:center;text-decoration:none}input{width:78px}button{cursor:pointer}button:focus-visible,input:focus-visible,select:focus-visible,a:focus-visible{outline:2px solid #4a7cf4;outline-offset:2px}p{margin:8px 0 0;color:light-dark(#637188,#aab6ca);font-size:12px}#error{color:light-dark(#b42318,#ff958b)}main{height:calc(100dvh - var(--header-height,120px));min-height:200px;overflow:auto;padding:16px;display:flex;justify-content:flex-start;align-items:flex-start}#frame-box{flex:none;position:relative;margin-inline:auto}iframe{display:block;border:0;outline:1px solid light-dark(#cbd3e0,#515d72);border-radius:12px;background:white;box-shadow:0 12px 36px #17263c22;transform-origin:top left}#metrics{font-variant-numeric:tabular-nums}@media(max-width:600px){header{padding:10px}main{padding:8px}.bar{gap:8px}button,select,input,a{min-height:42px}h1{flex-basis:100%}}
</style><header><div class="bar"><h1>真实 DSH · 仅布局视口</h1><label>设备<select id="preset" aria-label="预览设备"></select></label><button id="rotate" type="button">旋转</button><label>宽<input id="width" aria-label="视口宽度" type="number" min="240" max="4096"></label><label>高<input id="height" aria-label="视口高度" type="number" min="240" max="4096"></label><button id="size" type="button">应用尺寸</button><button id="fit" type="button" aria-pressed="true">适应窗口</button><a href="/" target="_blank" rel="noopener noreferrer">打开原始页面</a></div><p id="metrics" role="status"></p><p>设备框用于响应式布局检查。移动设备 DPR、触控与 mobile 仿真需在 Chrome 开发者工具中应用返回的 chromeEmulation；这里不模拟原生 Android、系统键盘或安全区。</p><p id="error" role="alert" hidden></p></header><main><div id="frame-box"><iframe id="preview" src="/" title="真实 DSH 预览页面"></iframe></div></main>
<script type="module">
const data=${state};let view=data.viewport,fit=true;const $=id=>document.getElementById(id),frame=$('preview'),box=$('frame-box');
for(const preset of [...data.presets,{id:'custom',label:'自定义'}]){const option=document.createElement('option');option.value=preset.id;option.textContent=preset.label;$('preset').append(option)}
function render(){const header=document.querySelector('header');document.documentElement.style.setProperty('--header-height',header.offsetHeight+'px');const main=document.querySelector('main'),padding=innerWidth<600?16:32;const scale=fit?Math.min(1,Math.max(.01,(main.clientWidth-padding)/view.width),Math.max(.01,(main.clientHeight-padding)/view.height)):1;frame.style.width=view.width+'px';frame.style.height=view.height+'px';frame.style.transform='scale('+scale+')';box.style.width=view.width*scale+'px';box.style.height=view.height*scale+'px';$('preset').value=view.preset;$('width').value=view.width;$('height').value=view.height;$('fit').textContent=fit?'适应窗口':'1:1 尺寸';$('fit').setAttribute('aria-pressed',String(fit));$('metrics').textContent=view.width+' × '+view.height+' CSS px · '+(view.orientation==='landscape'?'横屏':'竖屏')+' · 显示缩放 '+Math.round(scale*100)+'% · 页面内部保持所选尺寸';const url=new URL(location.href);for(const[key,value]of Object.entries(view))url.searchParams.set(key,String(value));history.replaceState(null,'',url);}
$('preset').onchange=()=>{const preset=data.presets.find(p=>p.id===$('preset').value);if(!preset){view={...view,preset:'custom'};return}view={...preset,preset:preset.id,orientation:preset.width>preset.height?'landscape':'portrait'};render()};
$('rotate').onclick=()=>{view={...view,width:view.height,height:view.width,orientation:view.orientation==='portrait'?'landscape':'portrait'};render()};
$('size').onclick=()=>{const width=Number($('width').value),height=Number($('height').value);if(![width,height].every(n=>Number.isInteger(n)&&n>=240&&n<=4096)){$('error').hidden=false;$('error').textContent='宽高必须为 240–4096 的整数 CSS 像素';return}$('error').hidden=true;view={...view,preset:'custom',width,height,orientation:width>height?'landscape':'portrait'};render()};
$('fit').onclick=()=>{fit=!fit;render()};new ResizeObserver(()=>render()).observe(document.querySelector('header'));window.addEventListener('resize',render);render();
</script></html>`
}
