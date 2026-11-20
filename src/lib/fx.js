// Efectos visuales: monedas que vuelan al contador y confeti
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { sfx } from './sfx.js';

const COLORS = ['#E8412C', '#1D2A6B', '#FFC531', '#2E9E5B', '#5EC8F2', '#FF8FB1', '#ffffff'];

export function confettiAt(x, y, amount = 70) {
  confetti({
    particleCount: amount,
    spread: 75,
    startVelocity: 38,
    origin: { x: x / window.innerWidth, y: y / window.innerHeight },
    colors: COLORS,
    scalar: 1.1,
    zIndex: 3000,
  });
}

export function bigCelebration() {
  const end = Date.now() + 1400;
  (function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 70, origin: { x: 0, y: 0.75 }, colors: COLORS, zIndex: 3000 });
    confetti({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1, y: 0.75 }, colors: COLORS, zIndex: 3000 });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  confetti({ particleCount: 120, spread: 120, origin: { y: 0.4 }, shapes: ['star'], colors: ['#FFC531', '#FFE08A', '#E8412C'], scalar: 1.6, zIndex: 3000 });
}

// Lanza n monedas desde (x,y) hacia el contador del HUD y llama onDone al final
export function flyCoins(x, y, n, onDone) {
  const target = document.getElementById('coin-target');
  if (!target) { onDone?.(); return; }
  const t = target.getBoundingClientRect();
  const tx = t.left + t.width / 2;
  const ty = t.top + t.height / 2;
  const count = Math.min(n, 12);
  let arrived = 0;
  for (let i = 0; i < count; i++) {
    const c = document.createElement('div');
    c.className = 'flying-coin';
    c.textContent = '★';
    document.body.appendChild(c);
    gsap.set(c, { x: x - 22, y: y - 22, scale: 0.2, rotate: 0 });
    const midX = x + (Math.random() - 0.5) * 260;
    const midY = y - 120 - Math.random() * 160;
    const tl = gsap.timeline({ delay: i * 0.07 });
    tl.to(c, { x: midX - 22, y: midY - 22, scale: 1.2, rotate: 180, duration: 0.45, ease: 'power2.out' })
      .to(c, { x: tx - 22, y: ty - 22, scale: 0.55, rotate: 360, duration: 0.55, ease: 'power2.in',
        onComplete: () => {
          c.remove();
          sfx.coin();
          gsap.fromTo(target, { scale: 1.35 }, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
          arrived += 1;
          if (arrived === count) onDone?.();
        } });
  }
}

export function shake(el) {
  if (!el) return;
  gsap.fromTo(el, { x: -14 }, { x: 0, duration: 0.5, ease: 'elastic.out(1.2, 0.25)' });
}
