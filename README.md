# YouTube Turntable Pitch Bookmarklet

Converts YouTube and YouTube Music playback into a physical turntable setup: locks playback rate to pitch, provides nudging controls, and includes an on-screen HUD.

---

## 1. The Bookmarklet Code

Copy the code block below and paste it into the **URL** field of a new browser bookmark:

```javascript
javascript:(()=>{if(window.__turntableActive){alert('Turntable%20already%20active!');return;}window.__turntableActive=true;let hud=document.getElementById('tt-hud');if(!hud){hud=document.createElement('div');hud.id='tt-hud';hud.style.cssText='position:fixed;top:60px;right:20px;z-index:999999;background:rgba(0,0,0,0.85);color:#0f0;font-family:monospace;font-size:14px;padding:8px%2014px;border-radius:6px;border:1px%20solid%20#333;pointer-events:none;box-shadow:0%204px%2012px%20rgba(0,0,0,0.5);transition:opacity%200.3s;';document.body.appendChild(hud);}const getM=()=>document.querySelector('video')||document.querySelector('audio');const setR=(m,r)=>{m.preservesPitch=m.mozPreservesPitch=m.webkitPreservesPitch=false;const c=Math.max(0.0625,Math.min(16,r));m.playbackRate=c;const p=((c-1)*100).toFixed(2);hud.textContent=`Turntable:%20${c.toFixed(3)}x%20(${c>=1?'+':''}${p}%)`;hud.style.opacity='1';clearTimeout(hud._to);hud._to=setTimeout(()=>hud.style.opacity='0.3',2500);};const brake=(m)=>{m.preservesPitch=false;const sr=m.playbackRate,st=performance.now();const ramp=(now)=>{const p=Math.min((now-st)/1400,1);if(p<1){m.playbackRate=Math.max(0.0625,sr*Math.pow(1-p,2));requestAnimationFrame(ramp);}else{m.pause();m.playbackRate=1;setR(m,1);}};requestAnimationFrame(ramp);};window.addEventListener('keydown',e=>{const t=e.target.tagName.toLowerCase();if(t==='input'||t==='textarea'||e.target.isContentEditable)return;const m=getM();if(!m)return;const d=e.shiftKey?0.001:0.01;if(e.key==='['){e.preventDefault();setR(m,m.playbackRate-d);}else%20if(e.key===']'){e.preventDefault();setR(m,m.playbackRate+d);}else%20if(e.key==='\\'){e.preventDefault();setR(m,1);}else%20if(e.key.toLowerCase()==='b'){e.preventDefault();brake(m);}});const im=getM();if(im)setR(im,im.playbackRate);})();
```

## 2. Installation Instructions

1. Open your browser's Bookmark Manager:
   * **Chrome / Brave / Edge:** `Ctrl + Shift + O` (Windows/Linux) or `Cmd + Option + B` (macOS)
   * **Firefox:** `Ctrl + Shift + O` (Windows/Linux) or `Cmd + Shift + O` (macOS)
2. Right-click the bookmarks bar or an empty space and choose **Add Bookmark** / **Add Page**.
3. Fill in the fields:
   * **Name:** `Turntable Speed`
   * **URL / Location:** Paste the bookmarklet code.
4. Save the bookmark.

---

## 3. Keyboard Shortcuts

| Shortcut | Action | Step Size |
| :--- | :--- | :--- |
| `[` | Pitch down / Slow down | -1.0% |
| `]` | Pitch up / Speed up | +1.0% |
| `Shift + [` | Fine pitch down | -0.1% |
| `Shift + ]` | Fine pitch up | +0.1% |
| `\` | Reset pitch to centre detent | 0.0% (1.000x) |
| `b` | Vinyl brake (motor power off) | Smooth stop over 1.4s |
