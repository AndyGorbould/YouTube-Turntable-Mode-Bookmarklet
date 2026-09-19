(() => {
  if (window.__turntableActive) {
    alert('Turntable already active!');
    return;
  }
  window.__turntableActive = true;

  // On-screen pitch display overlay
  let hud = document.getElementById('tt-hud');
  if (!hud) {
    hud = document.createElement('div');
    hud.id = 'tt-hud';
    hud.style.cssText =
      'position:fixed;top:60px;right:20px;z-index:999999;background:rgba(0,0,0,0.85);color:#0f0;font-family:monospace;font-size:14px;padding:8px 14px;border-radius:6px;border:1px solid #333;pointer-events:none;box-shadow:0 4px 12px rgba(0,0,0,0.5);transition:opacity 0.3s;';
    document.body.appendChild(hud);
  }

  const getMedia = () => document.querySelector('video') || document.querySelector('audio');

  const setRate = (media, rate) => {
    media.preservesPitch = media.mozPreservesPitch = media.webkitPreservesPitch = false;
    const clamped = Math.max(0.0625, Math.min(16, rate));
    media.playbackRate = clamped;

    const percent = ((clamped - 1) * 100).toFixed(2);
    hud.textContent = `Turntable: ${clamped.toFixed(3)}x (${clamped >= 1 ? '+' : ''}${percent}%)`;
    hud.style.opacity = '1';

    clearTimeout(hud._to);
    hud._to = setTimeout(() => (hud.style.opacity = '0.3'), 2500);
  };

  const brake = (media) => {
    media.preservesPitch = false;
    const startRate = media.playbackRate;
    const startTime = performance.now();

    const ramp = (now) => {
      const progress = Math.min((now - startTime) / 1400, 1);
      if (progress < 1) {
        media.playbackRate = Math.max(0.0625, startRate * Math.pow(1 - progress, 2));
        requestAnimationFrame(ramp);
      } else {
        media.pause();
        media.playbackRate = 1.0;
        setRate(media, 1.0);
      }
    };
    requestAnimationFrame(ramp);
  };

  window.addEventListener('keydown', (e) => {
    const tag = e.target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;

    const media = getMedia();
    if (!media) return;

    const delta = e.shiftKey ? 0.001 : 0.01;

    if (e.key === '[') {
      e.preventDefault();
      setRate(media, media.playbackRate - delta);
    } else if (e.key === ']') {
      e.preventDefault();
      setRate(media, media.playbackRate + delta);
    } else if (e.key === '\\') {
      e.preventDefault();
      setRate(media, 1.0);
    } else if (e.key.toLowerCase() === 'b') {
      e.preventDefault();
      brake(media);
    }
  });

  const initial = getMedia();
  if (initial) setRate(initial, initial.playbackRate);
})();
