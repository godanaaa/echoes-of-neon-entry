export function createInput(canvas) {
  const down = new Set(), pressed = new Set(); let pointer = { x: 0, y: 0 }, firing = false, aiming = false;
  window.addEventListener('keydown', e => { if (!down.has(e.code)) pressed.add(e.code); down.add(e.code); if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) e.preventDefault(); });
  window.addEventListener('keyup', e => down.delete(e.code)); window.addEventListener('blur', () => { down.clear(); firing = false; });
  const pos = e => { const r = canvas.getBoundingClientRect(); pointer = { x:e.clientX-r.left, y:e.clientY-r.top }; };
  canvas.addEventListener('pointermove', pos); canvas.addEventListener('pointerdown', e => { pos(e); if (e.button === 0) firing = true; if (e.button === 2) aiming = true; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointerup', e => { if (e.button === 0) firing = false; if (e.button === 2) aiming = false; }); canvas.addEventListener('contextmenu', e => e.preventDefault());
  return { down, pressed, pointer:() => pointer, get firing(){return firing;}, get aiming(){return aiming;}, take(code){const v=pressed.has(code);pressed.delete(code);return v;}, clear(){pressed.clear();} };
}
