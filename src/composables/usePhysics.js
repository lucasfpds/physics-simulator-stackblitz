import { ref, onBeforeUnmount } from "vue";

const COLORS = ["#7c3aed", "#ec4899", "#fbbf24", "#34d399", "#3b82f6", "#f87171", "#14b8a6"];
const MAX_BODIES = 60;
const RESTITUTION = 0.8;
const AIR_FRICTION = 0.999;

export function usePhysics() {
  const bodies = ref([]);
  const gravity = ref(900);
  const stage = ref(null);
  let rafId = null;
  let lastTime = 0;
  let dragging = null;
  let lastPointer = { x: 0, y: 0, t: 0 };

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function addBody(x, y, r = null, color = null) {
    if (bodies.value.length >= MAX_BODIES) return;
    bodies.value.push({
      id: Math.random(),
      x,
      y,
      vx: rand(-50, 50),
      vy: rand(-50, 50),
      r: r || rand(14, 32),
      color: color || COLORS[Math.floor(Math.random() * COLORS.length)],
    });
  }

  function init() {
    const el = stage.value;
    if (!el) return;
    const w = el.clientWidth;
    for (let i = 0; i < 6; i++) {
      addBody(rand(40, w - 40), rand(20, 100));
    }
    lastTime = performance.now();
    loop();
  }

  function loop() {
    const now = performance.now();
    let dt = (now - lastTime) / 1000;
    lastTime = now;
    if (dt > 0.05) dt = 0.05;

    const el = stage.value;
    if (!el) return;
    const w = el.clientWidth;
    const h = el.clientHeight;

    for (const b of bodies.value) {
      if (b === dragging) continue;
      b.vy += gravity.value * dt;
      b.vx *= AIR_FRICTION;
      b.vy *= AIR_FRICTION;
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      if (b.x - b.r < 0) { b.x = b.r; b.vx = -b.vx * RESTITUTION; }
      if (b.x + b.r > w) { b.x = w - b.r; b.vx = -b.vx * RESTITUTION; }
      if (b.y - b.r < 0) { b.y = b.r; b.vy = -b.vy * RESTITUTION; }
      if (b.y + b.r > h) { b.y = h - b.r; b.vy = -b.vy * RESTITUTION; }
    }

    const arr = bodies.value;
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const a = arr[i];
        const c = arr[j];
        const dx = c.x - a.x;
        const dy = c.y - a.y;
        const dist = Math.hypot(dx, dy);
        const minDist = a.r + c.r;
        if (dist < minDist && dist > 0) {
          const nx = dx / dist;
          const ny = dy / dist;
          const overlap = (minDist - dist) / 2;
          a.x -= nx * overlap;
          a.y -= ny * overlap;
          c.x += nx * overlap;
          c.y += ny * overlap;

          const ma = a.r * a.r;
          const mb = c.r * c.r;
          const va = a.vx * nx + a.vy * ny;
          const vc = c.vx * nx + c.vy * ny;
          const vaNew = (va * (ma - mb) + 2 * mb * vc) / (ma + mb);
          const vcNew = (vc * (mb - ma) + 2 * ma * va) / (ma + mb);
          a.vx += (vaNew - va) * nx * RESTITUTION;
          a.vy += (vaNew - va) * ny * RESTITUTION;
          c.vx += (vcNew - vc) * nx * RESTITUTION;
          c.vy += (vcNew - vc) * ny * RESTITUTION;
        }
      }
    }

    rafId = requestAnimationFrame(loop);
  }

  function onPointerDown(e) {
    const rect = stage.value.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    for (const b of bodies.value) {
      if (Math.hypot(b.x - x, b.y - y) < b.r) {
        dragging = b;
        b.vx = 0;
        b.vy = 0;
        lastPointer = { x, y, t: performance.now() };
        e.target.setPointerCapture(e.pointerId);
        return;
      }
    }
    addBody(x, y);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const rect = stage.value.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();
    const dt = (now - lastPointer.t) / 1000;
    if (dt > 0) {
      dragging._vx = (x - lastPointer.x) / dt;
      dragging._vy = (y - lastPointer.y) / dt;
    }
    dragging.x = x;
    dragging.y = y;
    lastPointer = { x, y, t: now };
  }

  function onPointerUp() {
    if (!dragging) return;
    dragging.vx = dragging._vx || 0;
    dragging.vy = dragging._vy || 0;
    dragging = null;
  }

  function clear() {
    bodies.value = [];
  }

  onBeforeUnmount(() => {
    if (rafId) cancelAnimationFrame(rafId);
  });

  return {
    bodies,
    gravity,
    stage,
    init,
    addBody,
    clear,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}
