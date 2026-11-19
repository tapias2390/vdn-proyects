'use strict';

/* =====================================================================
   Datos fijos
   ===================================================================== */
const MIEMBROS = [
  { id: 'david', nombre: 'David' },
  { id: 'oscar', nombre: 'Oscar' },
  { id: 'nicolas', nombre: 'Nicolas' },
  { id: 'yhonatan', nombre: 'Yhonatan' },
  { id: 'alejandro', nombre: 'Alejandro' },
];
MIEMBROS.forEach((m, i) => { m.color = `var(--m${i + 1})`; m.ini = m.nombre[0]; });
const MI = Object.fromEntries(MIEMBROS.map(m => [m.id, m]));
const ESTADOS = [
  { id: 'pendiente', nombre: 'Por iniciar' },
  { id: 'progreso', nombre: 'En progreso' },
  { id: 'revision', nombre: 'En revisión' },
  { id: 'ajustes', nombre: 'Ajustes' },
  { id: 'terminado', nombre: 'Terminado' },
];
const ES = Object.fromEntries(ESTADOS.map(e => [e.id, e]));
const PRIOS = [{ id: 'baja', nombre: 'Baja' }, { id: 'media', nombre: 'Media' }, { id: 'alta', nombre: 'Alta' }];
const PR = Object.fromEntries(PRIOS.map(p => [p.id, p]));
const DISP = {
  escritorio: { w: 1440, h: 900, bezel: 0 },
  tablet: { w: 820, h: 1180, bezel: 12 },
  movil: { w: 390, h: 844, bezel: 11 },
  libre: { w: 0, h: 0, bezel: 0 },
};
const MAX_ARCHIVOS = 1800;

const ICONOS = {
  back: '<path d="M19 12H5M12 19l-7-7 7-7"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5M5 20h14"/>',
  play: '<path class="f" d="M8 5.5v13l11-6.5z"/>',
  stop: '<rect class="f" x="6.5" y="6.5" width="11" height="11" rx="1.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
  note: '<path d="M20 15a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/>',
  refresh: '<path d="M20 11.5a8 8 0 1 0-2.4 5.7M20 4.5v7h-7"/>',
  expand: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
  shrink: '<path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/>',
  monitor: '<rect x="2.5" y="4" width="19" height="12.5" rx="2"/><path d="M8.5 20.5h7M12 16.5v4"/>',
  tablet: '<rect x="5" y="2.5" width="14" height="19" rx="2.2"/><path d="M11 18h2"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M11 18h2"/>',
  fit: '<path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/>',
  alert: '<path d="M12 3.5l9 16H3z"/><path d="M12 10v4.2M12 17.2v.1"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  file: '<path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z"/><path d="M14 3v5h5"/>',
  trash: '<path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
  external: '<path d="M7 17L17 7M9 7h8v8"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
  box: '<path d="M21 8l-9-5-9 5 9 5z"/><path d="M3 8v8.5l9 5 9-5V8M12 13v8.5"/>',
  board: '<rect x="3" y="4" width="5" height="16" rx="1.2"/><rect x="10" y="4" width="5" height="11" rx="1.2"/><rect x="17" y="4" width="4" height="7" rx="1.2"/>',
  list: '<path d="M9 6h12M9 12h12M9 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.1"/>',
  blocked: '<circle cx="12" cy="12" r="9"/><path d="M5.7 5.7l12.6 12.6"/>',
  code: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
  ver: '<path d="M4 7h16M4 12h10M4 17h7"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0"/>',
  eye: '<path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.8"/>',
  eyeOff: '<path d="M3.5 3.5l17 17M10.4 5.6A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16.4 16.4 0 0 1-3.1 3.9M6.7 6.8C4 8.5 2.5 12 2.5 12s3.5 6.5 9.5 6.5c1.6 0 3-.4 4.3-1M10 10a2.8 2.8 0 0 0 4 4"/>',
  key: '<circle cx="7.5" cy="15.5" r="4"/><path d="M10.4 12.6L20 3M16.5 6.5l3 3"/>',
  logout: '<path d="M9 21H5.5A1.5 1.5 0 0 1 4 19.5v-15A1.5 1.5 0 0 1 5.5 3H9M16 17l5-5-5-5M21 12H9"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M15.5 4.6a3.5 3.5 0 0 1 0 6.8M18.5 20a6.5 6.5 0 0 0-2.6-5.2"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5"/>',
  inbox: '<path d="M3.5 13.5h4.6l1.6 2.6h4.6l1.6-2.6h4.6"/><path d="M6 5.5h12l2.5 8V18a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18v-4.5z"/>',
  rayo: '<path d="M13 3 5.5 13.2h5.8L10.6 21l7.9-10.4h-5.8z"/>',
  sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  arriba: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  calendario: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  pulso: '<path d="M3 12h4l2.5-6 5 12 2.5-6h4"/>',
};
const ic = (n, c = '') => `<svg class="ic ${c}" viewBox="0 0 24 24" aria-hidden="true">${ICONOS[n] || ''}</svg>`;

/* =====================================================================
   Utilidades
   ===================================================================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
function lsGet(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento local */ } }
function nuevoId(p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 9); }
function hoyISO(d = new Date()) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function aFecha(iso) { const [y, m, d] = String(iso).split('-').map(Number); return new Date(y, (m || 1) - 1, d || 1); }
function diasHasta(iso) { return Math.round((aFecha(iso) - aFecha(hoyISO())) / 86400000); }
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
function fmtDia(iso) { const d = aFecha(iso); const y = d.getFullYear() !== new Date().getFullYear() ? ` ${d.getFullYear()}` : ''; return `${d.getDate()} ${MESES[d.getMonth()]}${y}`; }
function fmtFecha(ms) { const d = new Date(ms); const y = d.getFullYear() !== new Date().getFullYear() ? ` ${d.getFullYear()}` : ''; return `${d.getDate()} ${MESES[d.getMonth()]}${y}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; }
function fmtRel(ms) {
  if (!ms) return '';
  const s = (Date.now() - ms) / 1000;
  if (s < 50) return 'hace un momento';
  const m = s / 60; if (m < 60) return `hace ${Math.round(m)} min`;
  const h = m / 60; if (h < 24) return `hace ${Math.round(h)} h`;
  const d = h / 24; if (d < 7) return `hace ${Math.round(d)} ${Math.round(d) === 1 ? 'día' : 'días'}`;
  return fmtFecha(ms);
}
function fmtDur(min) { min = Math.round(min || 0); const h = Math.floor(min / 60), m = min % 60; if (!h) return `${m} min`; if (!m) return `${h} h`; return `${h} h ${m} min`; }
function fmtH(min) { const h = Math.round(((min || 0) / 60) * 10) / 10; return `${h.toLocaleString('es-CO')} h`; }
function fmtReloj(ms) { const t = Math.max(0, Math.floor(ms / 1000)); return [Math.floor(t / 3600), Math.floor((t % 3600) / 60), t % 60].map(n => String(n).padStart(2, '0')).join(':'); }
function fmtBytes(b) { b = b || 0; if (b < 1024) return `${b} B`; if (b < 1048576) return `${Math.round(b / 1024)} KB`; if (b < 1073741824) return `${(b / 1048576).toFixed(1).replace('.', ',')} MB`; return `${(b / 1073741824).toFixed(1).replace('.', ',')} GB`; }
function inicioSemanaISO() { const d = new Date(); const dia = (d.getDay() + 6) % 7; d.setDate(d.getDate() - dia); return hoyISO(d); }
function av(id, cls = '') { const m = MI[id]; if (!m) return `<span class="av av-none ${cls}" aria-hidden="true">?</span>`; return `<span class="av ${cls}" style="--m:${m.color}" aria-hidden="true">${esc(m.ini)}</span>`; }
function nombre(id) { return (MI[id] && MI[id].nombre) || 'Alguien'; }
async function pool(items, n, fn, alto) {
  let i = 0;
  const trabajador = async () => { while (i < items.length) { if (alto && alto()) return; const k = i++; await fn(items[k], k); } };
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, trabajador));
}
function mensajeError(e) {
  if (e && e.name === 'QuotaExceededError') return 'El navegador se quedó sin memoria para este proyecto.';
  return (e && e.message) || 'Algo salió mal.';
}

/* =====================================================================
   Movimiento. Resortes y transiciones con la Web Animations API del
   navegador (sin librerías), con los valores del MOTION_SPEC:
   todo entra de desenfocado a nítido, en cascada y con física suave.
   ===================================================================== */
const RM = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
const reducido = () => RM.matches;
function curvaBezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t, sy = (t) => ((ay * t + by) * t + cy) * t, dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) { const e = sx(t) - x; if (Math.abs(e) < 1e-6) return sy(t); const d = dx(t); if (Math.abs(d) < 1e-6) break; t -= e / d; }
    let a = 0, b = 1;
    t = x;
    for (let i = 0; i < 40 && b - a > 1e-6; i++) { if (sx(t) < x) a = t; else b = t; t = (a + b) / 2; }
    return sy(t);
  };
}
const EASE = {
  out: { css: 'cubic-bezier(.22,1,.36,1)', fn: curvaBezier(0.22, 1, 0.36, 1) }, // entradas: fade, blur, desplazamientos
  outExpo: { css: 'cubic-bezier(.16,1,.3,1)', fn: curvaBezier(0.16, 1, 0.3, 1) }, // contadores, barras, líneas
  inOut: { css: 'cubic-bezier(.65,0,.35,1)', fn: curvaBezier(0.65, 0, 0.35, 1) }, // salidas
};
const RESORTE = {
  indicador: { stiffness: 500, damping: 26, mass: 1 }, // píldora activa: sobrepasa ~10 % a los ~170 ms
  rebote: { stiffness: 100, damping: 11, mass: 1 }, // objetos que suben con rebote
  gelatina: { stiffness: 350, damping: 8, mass: 1 }, // panel lateral al cargar (solo escalas pequeñas)
  hover: { stiffness: 400, damping: 22, mass: 1 },
  pop: { stiffness: 260, damping: 22, mass: 1 }, // aparece sin rebote visible
  suave: { stiffness: 322, damping: 36, mass: 1 }, // amortiguado crítico: ventanas y reacomodos
};
const CASCADA = { nav: 0.06, tarjetas: 0.065, interior: 0.07, items: 0.045, filas: 0.04, chat: 0.05, salida: 0.035 };

/* Resorte amortiguado (solución exacta), muestreado a 60 cuadros por segundo. */
const memoResortes = new Map();
function muestrasResorte(r, tol = 0.002) {
  const clave = `${r.stiffness}|${r.damping}|${r.mass || 1}|${tol}`;
  if (memoResortes.has(clave)) return memoResortes.get(clave);
  const k = r.stiffness, c = r.damping, m = r.mass || 1;
  const w0 = Math.sqrt(k / m), z = c / (2 * Math.sqrt(k * m));
  let x;
  if (z < 1) {
    const wd = w0 * Math.sqrt(1 - z * z);
    x = (t) => 1 - Math.exp(-z * w0 * t) * (Math.cos(wd * t) + ((z * w0) / wd) * Math.sin(wd * t));
  } else if (z === 1) {
    x = (t) => 1 - Math.exp(-w0 * t) * (1 + w0 * t);
  } else {
    const s = Math.sqrt(z * z - 1), r1 = -w0 * (z - s), r2 = -w0 * (z + s), c1 = r2 / (r1 - r2), c2 = -1 - c1;
    x = (t) => 1 + c1 * Math.exp(r1 * t) + c2 * Math.exp(r2 * t);
  }
  const dt = 1 / 60, v = [0];
  for (let i = 1, quietos = 0; i < 240; i++) {
    const p = x(i * dt);
    v.push(p);
    if (Math.abs(1 - p) < tol && Math.abs(p - v[i - 1]) < tol) { if (++quietos >= 2) break; } else quietos = 0;
  }
  v[v.length - 1] = 1;
  const res = { v, dur: (v.length - 1) * dt * 1000 };
  memoResortes.set(clave, res);
  return res;
}
/* El hover usa CSS: el resorte se convierte en una curva linear() cuando el navegador la entiende. */
function curvaCSS(r, puntos = 40) {
  const s = muestrasResorte(r, 0.003), paso = Math.max(1, Math.floor(s.v.length / puntos));
  const vals = [];
  for (let i = 0; i < s.v.length; i += paso) vals.push(+s.v[i].toFixed(4));
  if (vals[vals.length - 1] !== 1) vals.push(1);
  return { css: `linear(${vals.join(', ')})`, dur: Math.round(s.dur) };
}
try {
  if (window.CSS && CSS.supports('transition-timing-function', 'linear(0, 0.5, 1)')) {
    const h = curvaCSS(RESORTE.hover);
    document.documentElement.style.setProperty('--resorte-hover', h.css);
    document.documentElement.style.setProperty('--dur-hover', h.dur + 'ms');
  }
} catch (e) { /* se queda la curva cubic-bezier del CSS */ }

const CANALES = { transform: ['x', 'y', 'scale', 'rotate'], opacity: ['opacity'], filter: ['blur'], clipPath: ['clip'], width: ['w'], strokeDashoffset: ['dash'] };
const BASE = { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, blur: 0, dash: 0 };
function valorCanal(canal, e) {
  switch (canal) {
    case 'transform': return `translate(${(+e.x).toFixed(2)}px, ${(+e.y).toFixed(2)}px) scale(${(+e.scale).toFixed(4)}) rotate(${(+e.rotate).toFixed(2)}deg)`;
    case 'opacity': return String(+(+e.opacity).toFixed(4));
    case 'filter': return `blur(${Math.max(0, +e.blur).toFixed(2)}px)`;
    case 'clipPath': return e.clip;
    case 'width': return (+e.w).toFixed(2) + 'px';
    default: return String(e.dash);
  }
}
function estadoCanal(ks, fuente, otra) {
  const e = {};
  for (const k of CANALES.transform.concat(['opacity', 'blur', 'clip', 'w', 'dash'])) {
    if (!ks.includes(k)) continue;
    e[k] = k in fuente ? fuente[k] : (k in BASE ? BASE[k] : otra[k]);
  }
  for (const k of CANALES.transform) if (!(k in e)) e[k] = BASE[k];
  return e;
}
const vivas = new WeakMap();
/* animar(el, desde, hasta, opciones): cada canal (transform, opacity, filter…) es una animación propia.
   opciones: { dur, ease, delay, resorte, tol, por: { canal: {…} }, siempre, alFinal(el) }.
   Al terminar se cancela la animación: el elemento vuelve a su estilo normal (sin filter residual). */
function animar(el, de, a, op = {}) {
  if (!el || typeof el.animate !== 'function') return Promise.resolve();
  const red = reducido();
  const mias = vivas.get(el) || {};
  const promesas = [];
  for (const [canal, claves] of Object.entries(CANALES)) {
    const ks = claves.filter((k) => k in de || k in a);
    if (!ks.length) continue;
    if (red && canal !== 'opacity' && !op.siempre) continue;
    const cfg = Object.assign({}, op, (op.por && op.por[canal]) || {});
    const d = canal === 'transform' ? estadoCanal(CANALES.transform, de, a) : estadoCanal(ks, de, a);
    const h = canal === 'transform' ? estadoCanal(CANALES.transform, a, de) : estadoCanal(ks, a, de);
    let marcos, tiempo;
    if (cfg.resorte && !red && canal !== 'clipPath') {
      const s = muestrasResorte(cfg.resorte, cfg.tol);
      marcos = s.v.map((p) => {
        const e = {};
        for (const k in d) e[k] = typeof d[k] === 'number' ? d[k] + (h[k] - d[k]) * p : h[k];
        return { [canal]: valorCanal(canal, e) };
      });
      tiempo = { duration: s.dur, easing: 'linear' };
    } else {
      marcos = [{ [canal]: valorCanal(canal, d) }, { [canal]: valorCanal(canal, h) }];
      const dur = red ? Math.min(cfg.dur || 0.15, 0.15) : (cfg.dur || (cfg.resorte ? 0.3 : 0.35));
      tiempo = { duration: dur * 1000, easing: red ? 'ease' : (EASE[cfg.ease] || EASE.out).css };
    }
    tiempo.delay = red ? 0 : Math.max(0, cfg.delay || 0) * 1000;
    tiempo.fill = 'both';
    if (mias[canal]) mias[canal].cancel();
    let anim;
    try { anim = el.animate(marcos, tiempo); } catch (e) { continue; }
    mias[canal] = anim;
    promesas.push(anim.finished.then(() => anim, () => null));
  }
  vivas.set(el, mias);
  return Promise.all(promesas).then((anims) => {
    const hechas = anims.filter(Boolean);
    if (op.alFinal && hechas.length === promesas.length) op.alFinal(el);
    if (!op.mantener) for (const an of hechas) { an.cancel(); for (const c in mias) if (mias[c] === an) delete mias[c]; }
    return hechas.length === promesas.length;
  });
}
function detener(el) { const m = el && vivas.get(el); if (m) { for (const c in m) m[c].cancel(); vivas.delete(el); } }

/* Variantes del spec (sección 3). */
const MOV = {
  blurIn: (el, delay = 0) => animar(el, { opacity: 0, y: 12, scale: 0.98, blur: 10 }, { opacity: 1, y: 0, scale: 1, blur: 0 }, { dur: 0.45, ease: 'out', delay }),
  blurInSm: (el, delay = 0) => animar(el, { opacity: 0, y: 6, blur: 6 }, { opacity: 1, y: 0, blur: 0 }, { dur: 0.35, ease: 'out', delay }),
  /* Tarjeta que además orquesta a sus hijos (icono → label → valor → delta → gráfico). */
  cardIn(el, delay = 0, hijos = [], childDelay = 0.13, gap = CASCADA.interior) {
    hijos.forEach((h, i) => MOV.blurInSm(h, delay + childDelay + i * gap));
    return animar(el, { opacity: 0, y: 12, scale: 0.97, blur: 10 }, { opacity: 1, y: 0, scale: 1, blur: 0 }, { dur: 0.45, ease: 'out', delay });
  },
  riseIn: (el, delay = 0) => animar(el, { opacity: 0, y: 48, scale: 0.92, blur: 8 }, { opacity: 1, y: 0, scale: 1, blur: 0 }, { delay, por: { transform: { resorte: RESORTE.rebote }, opacity: { dur: 0.3 }, filter: { dur: 0.35 } } }),
  growIn: (el, delay = 0) => animar(el, { opacity: 0, y: 16, scale: 0.75, blur: 10 }, { opacity: 1, y: 0, scale: 1, blur: 0 }, { delay, por: { transform: { resorte: RESORTE.pop }, opacity: { dur: 0.25 }, filter: { dur: 0.3 } } }),
  gelatina: (el, delay = 0) => animar(el, { scale: 0.95 }, { scale: 1 }, { delay, resorte: RESORTE.gelatina, tol: 0.01 }),
  /* mantener: el elemento queda invisible hasta que quien lo oculta llama a detener(el). */
  salida: (el, delay = 0, alFinal, mantener = false) => animar(el, { opacity: 1, scale: 1, blur: 0 }, { opacity: 0, scale: 0.98, blur: 8 }, { dur: 0.25, ease: 'inOut', delay, alFinal, mantener }),
  /* Regreso simétrico de lo que salió (mismo camino, al revés). */
  vuelta: (el, delay = 0) => animar(el, { opacity: 0, scale: 0.98, blur: 8 }, { opacity: 1, scale: 1, blur: 0 }, { dur: 0.4, ease: 'out', delay }),
  fila: (el, delay = 0) => animar(el, { opacity: 0, y: 10, blur: 8 }, { opacity: 1, y: 0, blur: 0 }, { dur: 0.4, ease: 'out', delay }),
  burbuja: (el, delay = 0) => animar(el, { opacity: 0, scale: 0.8, blur: 8 }, { opacity: 1, scale: 1, blur: 0 }, { delay, por: { transform: { resorte: RESORTE.indicador }, opacity: { dur: 0.25 }, filter: { dur: 0.3 } } }),
  titulo: (el, delay = 0) => animar(el, { opacity: 0, y: 8, blur: 4 }, { opacity: 1, y: 0, blur: 0 }, { dur: 0.3, ease: 'out', delay }),
  cruce: (el) => animar(el, { opacity: 0.55, blur: 4 }, { opacity: 1, blur: 0 }, { dur: 0.25, ease: 'out' }),
  pop: (el, delay = 0) => animar(el, { scale: 0.6 }, { scale: 1 }, { delay, resorte: RESORTE.pop, tol: 0.004 }),
  relleno: (el, delay = 0, dur = 0.7) => animar(el, { clip: 'inset(0 100% 0 0 round 999px)' }, { clip: 'inset(0 0% 0 0 round 999px)' }, { dur, ease: 'outExpo', delay }),
  dibujo: (el, delay = 0) => animar(el, { dash: 1, opacity: 0 }, { dash: 0, opacity: 1 }, { delay, por: { strokeDashoffset: { dur: 0.7, ease: 'out' }, opacity: { dur: 0.15 } } }),
  aro: (el, desde, delay = 0) => animar(el, { dash: desde }, { dash: 0 }, { dur: 0.9, ease: 'outExpo', delay }),
  /* Ventanas y popovers: se materializan (escala + blur juntos) y salen por el mismo camino. */
  materializar: (el, delay = 0) => animar(el, { opacity: 0, y: 8, scale: 0.96, blur: 8 }, { opacity: 1, y: 0, scale: 1, blur: 0 }, { delay, por: { transform: { resorte: RESORTE.suave, tol: 0.003 }, opacity: { dur: 0.22 }, filter: { dur: 0.28 } } }),
  desmaterializar: (el, alFinal, mantener = false) => animar(el, { opacity: 1, scale: 1, blur: 0 }, { opacity: 0, scale: 0.97, blur: 6 }, { dur: 0.18, ease: 'inOut', alFinal, mantener }),
  fundir: (el, de, a, dur = 0.22, delay = 0, alFinal) => animar(el, { opacity: de }, { opacity: a }, { dur, ease: de < a ? 'out' : 'inOut', delay, alFinal }),
};
function cascada(els, variante, delay = 0, gap = CASCADA.tarjetas) {
  els.forEach((el, i) => variante(el, delay + i * gap));
}
/* Badges y contadores fuera de un morph: si el número cambia, hace pop. */
function ponerTexto(el, txt) {
  if (!el || el.textContent === txt) return;
  const habia = el.textContent !== '';
  el.textContent = txt;
  if (habia) MOV.pop(el);
}

/* Number ticker: cuenta con curva expo-out; si el dato cambia, anima desde el valor que se ve. */
function formatoDe(el) {
  if (el && el.getAttribute('data-fmt') === 'h') return (v) => fmtH(v);
  return (v) => Math.round(v).toLocaleString('es-CO');
}
function contar(el, hasta, op = {}) {
  if (!el) return;
  const formato = op.formato || formatoDe(el);
  cancelAnimationFrame(el._raf || 0);
  const desde = op.desde != null ? op.desde : (el._v != null ? el._v : 0);
  el._v = hasta;
  if (reducido() || desde === hasta) { el.textContent = formato(hasta); return; }
  const dur = (op.dur || 1.1) * 1000, t0 = performance.now() + (op.delay || 0) * 1000;
  el.textContent = formato(desde);
  const paso = (ahora) => {
    const t = Math.min(1, Math.max(0, (ahora - t0) / dur));
    el.textContent = formato(desde + (hasta - desde) * EASE.outExpo.fn(t));
    if (t < 1) el._raf = requestAnimationFrame(paso);
  };
  el._raf = requestAnimationFrame(paso);
}

/* Indicador activo compartido (como layoutId): una sola píldora viaja entre opciones con resorte,
   arranca desde donde se ve en ese instante y adapta su ancho al de la nueva opción. */
function moverIndicador(cont, activo, animarlo = true) {
  const ind = cont && cont.querySelector(':scope > .ind');
  if (!ind) return;
  if (!activo || !activo.offsetWidth) { ind.style.opacity = '0'; ind._pos = null; return; }
  const x = activo.offsetLeft, y = activo.offsetTop, w = activo.offsetWidth, h = activo.offsetHeight;
  const prev = ind._pos;
  if (prev && prev.x === x && prev.y === y && prev.w === w && prev.h === h) return;
  let cx = x, cy = y, cw = w;
  if (prev) {
    const corre = ind._anim && ind._anim.playState === 'running';
    if (corre) {
      const cs = getComputedStyle(ind);
      try { const mx = new DOMMatrixReadOnly(cs.transform === 'none' ? undefined : cs.transform); cx = mx.m41; cy = mx.m42; } catch (e) { cx = prev.x; cy = prev.y; }
      cw = parseFloat(cs.width) || prev.w;
      ind._anim.cancel();
    } else { cx = prev.x; cy = prev.y; cw = prev.w; }
  }
  ind.style.width = w + 'px';
  ind.style.height = h + 'px';
  ind.style.transform = `translate(${x}px, ${y}px)`;
  ind.style.opacity = '1';
  ind._pos = { x, y, w, h };
  if (!animarlo || !prev || (Math.abs(cx - x) < 0.5 && Math.abs(cy - y) < 0.5 && Math.abs(cw - w) < 0.5)) return;
  let marcos, tiempo;
  if (reducido()) {
    marcos = [{ transform: `translate(${cx}px, ${cy}px)`, width: cw + 'px' }, { transform: `translate(${x}px, ${y}px)`, width: w + 'px' }];
    tiempo = { duration: 150, easing: 'ease' };
  } else {
    const s = muestrasResorte(RESORTE.indicador, 0.002);
    marcos = s.v.map((p) => ({ transform: `translate(${(cx + (x - cx) * p).toFixed(2)}px, ${(cy + (y - cy) * p).toFixed(2)}px)`, width: Math.max(8, cw + (w - cw) * p).toFixed(2) + 'px' }));
    tiempo = { duration: s.dur, easing: 'linear' };
  }
  try { ind._anim = ind.animate(marcos, tiempo); } catch (e) { /* sin animación */ }
}
const vigiaIndicadores = typeof ResizeObserver === 'function' ? new ResizeObserver((ents) => {
  for (const en of ents) { const c = en.target; moverIndicador(c, c.querySelector('[aria-pressed="true"], [aria-selected="true"]'), false); }
}) : null;

/* Morph: actualiza el HTML de una zona sin reemplazar lo que no cambió. Así no se repiten las
   entradas al volver a pintar; lo nuevo entra, lo que se mueve viaja (FLIP) y lo que se va se difumina. */
function claveDe(n) { return n.nodeType === 1 ? n.getAttribute('data-k') : null; }
function morph(raiz, html, op = {}) {
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  let anima = op.animar !== false;
  /* Si las claves no cambian (mismo orden), no hay nada que entre, salga o viaje: no se mide nada. */
  if (anima) {
    const claves = (r) => Array.from(r.querySelectorAll('[data-k]'), (el) => el.getAttribute('data-k')).join('|');
    if (claves(tpl.content) === claves(raiz)) anima = 'igual';
  }
  const antes = new Map();
  if (anima === true) for (const el of raiz.querySelectorAll('[data-k]')) antes.set(el.getAttribute('data-k'), { el, r: el.getBoundingClientRect() });
  const ctx = { numeros: [], pops: [] };
  morphHijos(raiz, tpl.content, ctx);
  for (const [el, v] of ctx.numeros) {
    if (anima && el._v != null && el._v !== v) contar(el, v, { dur: 0.8 });
    else if (el._v !== v || !el._raf) { cancelAnimationFrame(el._raf || 0); el._raf = 0; el._v = v; el.textContent = formatoDe(el)(v); }
  }
  if (!anima) return { nuevos: [] };
  for (const el of ctx.pops) MOV.pop(el);
  if (anima !== true) return { nuevos: [] };
  const despues = new Map();
  for (const el of raiz.querySelectorAll('[data-k]')) despues.set(el.getAttribute('data-k'), el);
  if (!reducido()) {
    for (const [k, el] of despues) {
      const a = antes.get(k);
      if (!a || el.hasAttribute('data-quieto')) continue;
      const r = el.getBoundingClientRect();
      const dx = a.r.left - r.left, dy = a.r.top - r.top;
      if ((Math.abs(dx) > 1 || Math.abs(dy) > 1) && r.width) animar(el, { x: dx, y: dy }, { x: 0, y: 0 }, { resorte: RESORTE.indicador, tol: 0.003 });
    }
  }
  const nuevos = [];
  for (const [k, el] of despues) if (!antes.has(k)) nuevos.push(el);
  const tope = nuevos.filter((el) => !nuevos.some((o) => o !== el && o.contains(el)));
  if (op.alEntrar) tope.forEach((el, i) => op.alEntrar(el, i));
  if (op.alSalir !== false) {
    const idos = [];
    for (const [k, a] of antes) if (!despues.has(k) && !a.el.isConnected) idos.push(a);
    for (const a of idos) if (!idos.some((o) => o !== a && o.el.contains(a.el))) fantasma(a.el, a.r);
  }
  return { nuevos: tope };
}
function morphHijos(pv, pn, ctx) {
  const viejos = Array.from(pv.childNodes);
  const porClave = new Map();
  for (const n of viejos) { const k = claveDe(n); if (k) porClave.set(k, n); }
  const libres = viejos.filter((n) => !claveDe(n));
  let li = 0;
  const destino = [];
  for (const nn of Array.from(pn.childNodes)) {
    const k = claveDe(nn);
    let usado = null;
    if (k) {
      const v = porClave.get(k);
      if (v && v.nodeName === nn.nodeName) { porClave.delete(k); usado = v; }
    } else {
      let j = li;
      while (j < libres.length && (libres[j].nodeType !== nn.nodeType || libres[j].nodeName !== nn.nodeName)) j++;
      if (j < libres.length) { usado = libres[j]; li = j + 1; }
    }
    if (usado) { morphNodo(usado, nn, ctx); destino.push(usado); } else destino.push(nn);
  }
  const quedan = new Set(destino);
  for (const n of viejos) if (!quedan.has(n)) n.remove();
  for (let i = 0; i < destino.length; i++) {
    const n = destino[i];
    if (pv.childNodes[i] !== n) pv.insertBefore(n, pv.childNodes[i] || null);
  }
  for (const n of destino) if (n.nodeType === 1 && !n._morf) { const nums = n.matches('[data-num]') ? [n] : n.querySelectorAll('[data-num]'); for (const x of nums) { x._v = +x.getAttribute('data-num'); } }
}
function morphNodo(v, n, ctx) {
  if (v.nodeType !== 1) { if (v.nodeValue !== n.nodeValue) v.nodeValue = n.nodeValue; return; }
  v._morf = true;
  const popAntes = v.hasAttribute('data-pop') ? v.textContent : null;
  for (let i = v.attributes.length - 1; i >= 0; i--) { const at = v.attributes[i]; if (!n.hasAttribute(at.name)) v.removeAttribute(at.name); }
  for (const at of n.attributes) if (v.getAttribute(at.name) !== at.value) v.setAttribute(at.name, at.value);
  if (v.nodeName === 'INPUT' && (v.type === 'checkbox' || v.type === 'radio')) v.checked = n.hasAttribute('checked');
  if (v.hasAttribute('data-num')) { ctx.numeros.push([v, +v.getAttribute('data-num')]); return; }
  morphHijos(v, n, ctx);
  if (v.nodeName === 'SELECT' && document.activeElement !== v) { const o = Array.from(v.options).find((x) => x.hasAttribute('selected')); if (o) v.value = o.value; }
  if (popAntes != null && popAntes !== v.textContent) ctx.pops.push(v);
}
/* Lo que sale de una zona se copia en una capa fija y se difumina ahí, sin mover a los demás. */
function fantasma(el, r) {
  const capa = document.getElementById('capaFantasma');
  if (!capa || !r || !r.width || !r.height || reducido() || /^(TR|TD|TH|TBODY|THEAD|OPTION)$/.test(el.tagName)) return;
  if (r.bottom < 0 || r.top > innerHeight) return;
  const g = el.cloneNode(true);
  g.removeAttribute('data-k');
  g.removeAttribute('id');
  g.querySelectorAll('[id], [data-k]').forEach((x) => { x.removeAttribute('id'); x.removeAttribute('data-k'); });
  g.setAttribute('aria-hidden', 'true');
  g.classList.add('fantasma');
  Object.assign(g.style, { position: 'fixed', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', margin: '0', pointerEvents: 'none' });
  capa.appendChild(g);
  MOV.salida(g, 0, () => g.remove());
  setTimeout(() => g.remove(), 900);
}

const ANIM = { listo: false, firma: '', retiro: 0, cierre: null };

/* =====================================================================
   Estado
   ===================================================================== */
const S = {
  yo: null, esAdmin: false, usuarios: new Map(),
  conectado: false, sinDb: false, sinInstalar: false, motivo: '', cargando: true, desconexion: false,
  puedeEscribir: true, puedeSubir: false, puedeBorrar: false,
  v: null, desfase: 0, maxArchivoMb: 50, espacio: 0,
  proyectos: new Map(), notas: [], tiempos: [], actividad: [], cronos: new Map(),
  vista: lsGet('vitrina.vista', 'tablero') === 'lista' ? 'lista' : 'tablero',
  filtro: { q: '', quien: null, estado: null },
  detalle: null, tab: 'notas', verResueltas: false,
  detActividad: [], detVersiones: [], detToken: 0,
};

/* =====================================================================
   Lector de .zip (sin librerías: DecompressionStream del navegador)
   ===================================================================== */
const CP850 = 'ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´­±‗¾¶§÷¸°¨·¹³²■ ';
function nombreZip(b, utf8) {
  if (utf8) return new TextDecoder('utf-8').decode(b);
  try { return new TextDecoder('utf-8', { fatal: true }).decode(b); } catch (e) { /* no es UTF-8 */ }
  let s = ''; for (const c of b) s += c < 128 ? String.fromCharCode(c) : CP850[c - 128]; return s;
}
async function leerZip(file) {
  const buf = new Uint8Array(await file.arrayBuffer());
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 22 - 65535); i--) { if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; } }
  if (eocd < 0) throw new Error('Ese archivo no parece un .zip válido.');
  let total = dv.getUint16(eocd + 10, true), cdOff = dv.getUint32(eocd + 16, true);
  if (total === 0xFFFF || cdOff === 0xFFFFFFFF) {
    const loc = eocd - 20;
    if (loc >= 0 && dv.getUint32(loc, true) === 0x07064b50) {
      const z64 = Number(dv.getBigUint64(loc + 8, true));
      if (dv.getUint32(z64, true) === 0x06064b50) { total = Number(dv.getBigUint64(z64 + 32, true)); cdOff = Number(dv.getBigUint64(z64 + 48, true)); }
    }
  }
  const entradas = [];
  let p = cdOff;
  for (let i = 0; i < total; i++) {
    if (p + 46 > buf.length || dv.getUint32(p, true) !== 0x02014b50) break;
    const flags = dv.getUint16(p + 8, true), metodo = dv.getUint16(p + 10, true);
    let csize = dv.getUint32(p + 20, true), usize = dv.getUint32(p + 24, true);
    const nlen = dv.getUint16(p + 28, true), xlen = dv.getUint16(p + 30, true), clen = dv.getUint16(p + 32, true);
    let lho = dv.getUint32(p + 42, true);
    const nb = buf.subarray(p + 46, p + 46 + nlen), extra = buf.subarray(p + 46 + nlen, p + 46 + nlen + xlen);
    let nombre = null;
    for (let q = 0; q + 4 <= extra.length;) {
      const id = extra[q] | (extra[q + 1] << 8), sz = extra[q + 2] | (extra[q + 3] << 8);
      const cuerpo = extra.subarray(q + 4, q + 4 + sz);
      if (id === 0x0001) {
        const bv = new DataView(cuerpo.buffer, cuerpo.byteOffset, cuerpo.byteLength); let o = 0;
        if (usize === 0xFFFFFFFF && o + 8 <= sz) { usize = Number(bv.getBigUint64(o, true)); o += 8; }
        if (csize === 0xFFFFFFFF && o + 8 <= sz) { csize = Number(bv.getBigUint64(o, true)); o += 8; }
        if (lho === 0xFFFFFFFF && o + 8 <= sz) { lho = Number(bv.getBigUint64(o, true)); }
      } else if (id === 0x7075 && sz > 5) {
        try { nombre = new TextDecoder('utf-8', { fatal: true }).decode(cuerpo.subarray(5)); } catch (e) { /* ignorar */ }
      }
      q += 4 + sz;
    }
    if (nombre == null) nombre = nombreZip(nb, flags & 0x800);
    entradas.push({ nombre, flags, metodo, csize, usize, lho });
    p += 46 + nlen + xlen + clen;
  }
  if (!entradas.length) throw new Error('El .zip está vacío o dañado.');
  return { buf, dv, entradas };
}
async function extraerZip(z, e) {
  const p = e.lho;
  if (z.dv.getUint32(p, true) !== 0x04034b50) throw new Error('Entrada dañada en el .zip: ' + e.nombre);
  const ini = p + 30 + z.dv.getUint16(p + 26, true) + z.dv.getUint16(p + 28, true);
  const datos = z.buf.subarray(ini, ini + e.csize);
  if (e.metodo === 0) return datos.slice();
  if (e.metodo === 8) {
    const out = await new Response(new Blob([datos]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer();
    return new Uint8Array(out);
  }
  throw new Error('Compresión no compatible en ' + e.nombre);
}

const TIPOS = {
  html: 'text/html', htm: 'text/html', xhtml: 'text/html', css: 'text/css', js: 'text/javascript', mjs: 'text/javascript', cjs: 'text/javascript',
  json: 'application/json', map: 'application/json', webmanifest: 'application/manifest+json', txt: 'text/plain', md: 'text/markdown', csv: 'text/csv', xml: 'application/xml',
  svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', avif: 'image/avif', ico: 'image/x-icon', bmp: 'image/bmp',
  mp4: 'video/mp4', m4v: 'video/mp4', webm: 'video/webm', ogv: 'video/ogg', mov: 'video/quicktime', mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg', m4a: 'audio/mp4', aac: 'audio/aac',
  woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf', otf: 'font/otf', eot: 'application/vnd.ms-fontobject', pdf: 'application/pdf',
  wasm: 'application/wasm', glb: 'model/gltf-binary', gltf: 'model/gltf+json', jsx: 'text/plain', ts: 'text/plain', tsx: 'text/plain', vue: 'text/plain', scss: 'text/plain', sass: 'text/plain', less: 'text/plain',
};
const esHtml = (p) => /\.(x?html?)$/i.test(p);
const dirDe = (p) => { const i = String(p).lastIndexOf('/'); return i < 0 ? '' : String(p).slice(0, i + 1); };
function mimeDe(path) { const m = /\.([a-z0-9]+)$/i.exec(path); return (m && TIPOS[m[1].toLowerCase()]) || 'application/octet-stream'; }
function decodificar(u8) {
  if (u8.length >= 3 && u8[0] === 0xEF && u8[1] === 0xBB && u8[2] === 0xBF) return new TextDecoder('utf-8').decode(u8.subarray(3));
  if (u8.length >= 2 && u8[0] === 0xFF && u8[1] === 0xFE) return new TextDecoder('utf-16le').decode(u8.subarray(2));
  if (u8.length >= 2 && u8[0] === 0xFE && u8[1] === 0xFF) return new TextDecoder('utf-16be').decode(u8.subarray(2));
  try { return new TextDecoder('utf-8', { fatal: true }).decode(u8); } catch (e) { /* otra codificación */ }
  const cab = new TextDecoder('windows-1252').decode(u8.subarray(0, 2048));
  const m = /charset\s*=\s*["']?([\w-]+)/i.exec(cab);
  if (m) { try { return new TextDecoder(m[1]).decode(u8); } catch (e) { /* etiqueta desconocida */ } }
  return new TextDecoder('windows-1252').decode(u8);
}
function ordenPaginas(a, b) {
  const da = a.split('/').length, db = b.split('/').length;
  const ia = /(^|\/)index\.html?$/i.test(a) ? 0 : 1, ib = /(^|\/)index\.html?$/i.test(b) ? 0 : 1;
  return da - db || ia - ib || a.localeCompare(b);
}
function elegirEntrada(archivos, paginas) {
  const raiz = paginas.find(p => /^index\.html?$/i.test(p));
  if (raiz) {
    const txt = decodificar(archivos.find(f => f.p === raiz).bytes);
    if (/<script[^>]+src=["']\/?src\/main\.[jt]sx?["']/i.test(txt)) {
      const build = paginas.find(p => /^(dist|build|out)\/index\.html?$/i.test(p));
      if (build) return build;
    }
    return raiz;
  }
  const idx = paginas.filter(p => /(^|\/)index\.html?$/i.test(p)).sort(ordenPaginas);
  return idx[0] || paginas[0];
}
function tituloDe(f) {
  if (!f) return '';
  try { return new DOMParser().parseFromString(decodificar(f.bytes), 'text/html').title.trim().slice(0, 120); } catch (e) { return ''; }
}
async function prepararZip(file, alAvanzar) {
  if (typeof DecompressionStream === 'undefined') throw new Error('Este navegador no puede abrir archivos .zip. Actualízalo a una versión reciente.');
  if (file.size > 250 * 1048576) throw new Error('El .zip pesa más de 250 MB. Quita videos o carpetas que no se usen y vuelve a intentarlo.');
  const z = await leerZip(file);
  const omitidos = [];
  let lista = [];
  for (const e of z.entradas) {
    let n = e.nombre.replace(/\\/g, '/').replace(/^\/+/, '');
    try { n = n.normalize('NFC'); } catch (x) { /* sin normalizar */ }
    if (!n || n.endsWith('/')) continue;
    if (/(^|\/)(__MACOSX|\.git|\.svn|\.idea|\.vscode)\//.test(n) || /(^|\/)(\.DS_Store|Thumbs\.db|desktop\.ini)$/i.test(n) || /(^|\/)\._[^/]*$/.test(n)) continue;
    if (e.flags & 1) { omitidos.push({ p: n, r: 'protegido con contraseña' }); continue; }
    if (e.metodo !== 0 && e.metodo !== 8) { omitidos.push({ p: n, r: 'compresión no compatible' }); continue; }
    lista.push({ e, p: n });
  }
  if (!lista.length) throw new Error('El .zip no tiene archivos que se puedan usar.');
  while (lista.length && lista.every(x => x.p.includes('/'))) {
    const primero = lista[0].p.split('/')[0] + '/';
    if (!lista.every(x => x.p.startsWith(primero))) break;
    lista = lista.map(x => ({ ...x, p: x.p.slice(primero.length) }));
  }
  const usaNodeModules = lista.some(x => /\.html?$/i.test(x.p) && !x.p.includes('node_modules/') && false);
  const tieneHtml = lista.some(x => /\.html?$/i.test(x.p) && !/(^|\/)node_modules\//.test(x.p));
  if (!tieneHtml) throw new Error('El .zip no tiene ningún archivo .html.');
  const archivos = [];
  let total = 0, hechos = 0;
  const nm = lista.filter(x => /(^|\/)node_modules\//.test(x.p));
  let incluirNm = usaNodeModules;
  if (nm.length) {
    for (const x of lista) {
      if (!/\.html?$/i.test(x.p) || /(^|\/)node_modules\//.test(x.p)) continue;
      const b = await extraerZip(z, x.e);
      if (/node_modules\//.test(decodificar(b))) { incluirNm = true; break; }
    }
  }
  for (const x of lista) {
    if (!incluirNm && /(^|\/)node_modules\//.test(x.p)) continue;
    if (x.e.usize > 64 * 1048576) { omitidos.push({ p: x.p, r: 'pesa más de 64 MB' }); continue; }
    const bytes = await extraerZip(z, x.e);
    archivos.push({ p: x.p, bytes, m: mimeDe(x.p), s: bytes.length });
    total += bytes.length;
    hechos++;
    if (alAvanzar && hechos % 10 === 0) alAvanzar(hechos, lista.length);
  }
  if (nm.length && !incluirNm) omitidos.push({ p: 'node_modules/', r: `${nm.length} archivos de dependencias que las páginas no usan` });
  if (archivos.length > MAX_ARCHIVOS) throw new Error(`El proyecto tiene ${archivos.length} archivos. El máximo es ${MAX_ARCHIVOS}. Quita carpetas que no se usen.`);
  const paginas = archivos.filter(f => esHtml(f.p) && !/(^|\/)node_modules\//.test(f.p)).map(f => f.p).sort(ordenPaginas);
  const entrada = elegirEntrada(archivos, paginas);
  return { nombreZip: file.name, archivos, paginas, entrada, titulo: tituloDe(archivos.find(f => f.p === entrada)), total, omitidos };
}
function mapaArchivos(archivos) {
  const files = new Map();
  for (const f of archivos) files.set(f.p, { blob: new Blob([f.bytes], { type: f.m }), m: f.m, s: f.s });
  return files;
}

/* =====================================================================
   Motor de vista previa (corre DENTRO del iframe aislado)
   Recibe los archivos del .zip, reescribe las rutas de HTML/CSS/JS
   y escribe la página. No usa nada de esta página.
   ===================================================================== */
function zipfsEngine() {
  var empezado = false;
  window.addEventListener('message', function (ev) {
    if (ev.source !== window.parent || empezado) return;
    var d = ev.data;
    if (!d || d.type !== 'zipfs:load') return;
    empezado = true;
    construir(d).catch(function (err) {
      window.parent.postMessage({ type: 'zipfs:fatal', message: String((err && err.message) || err) }, '*');
    });
  });
  window.parent.postMessage({ type: 'zipfs:ready' }, '*');

  async function construir(d) {
    function post(type, data) { try { window.parent.postMessage(Object.assign({}, data || {}, { type: 'zipfs:' + type }), '*'); } catch (e) {} }
    function each(list, fn) { Array.prototype.forEach.call(list, fn); }
    var files = new Map(), lower = new Map(), texts = new Map(), missing = new Set();
    d.files.forEach(function (f) { files.set(f.p, f); lower.set(f.p.toLowerCase(), f.p); });
    var EXT = /^(?:[a-z][a-z0-9+.\-]*:|\/\/)/i;
    var TXT = /\.(x?html?|css|m?js|cjs|svg)$/i;
    var FONT = /^(font\/|application\/(font|x-font|vnd\.ms-fontobject))/;
    var MEDIA = /^(image|video|audio)\//;
    var SVGNS = 'http://www.w3.org/2000/svg';

    function decodeText(u8) {
      if (u8.length >= 3 && u8[0] === 0xEF && u8[1] === 0xBB && u8[2] === 0xBF) return new TextDecoder('utf-8').decode(u8.subarray(3));
      try { return new TextDecoder('utf-8', { fatal: true }).decode(u8); } catch (e) {}
      var head = new TextDecoder('windows-1252').decode(u8.subarray(0, 2048));
      var m = /charset\s*=\s*["']?([\w-]+)/i.exec(head);
      if (m) { try { return new TextDecoder(m[1]).decode(u8); } catch (e) {} }
      return new TextDecoder('windows-1252').decode(u8);
    }
    await Promise.all(d.files.map(function (f) {
      if (!TXT.test(f.p)) return null;
      return f.b.arrayBuffer().then(function (buf) { texts.set(f.p, decodeText(new Uint8Array(buf))); });
    }));

    function probeScript(src) {
      return new Promise(function (res) {
        var done = false, s = document.createElement('script');
        window.__zfProbe = 0;
        function fin() { if (!done) { done = true; res(window.__zfProbe === 1); } }
        s.onload = fin; s.onerror = fin; setTimeout(fin, 2500);
        try { s.src = src; } catch (e) { return res(false); }
        document.head.appendChild(s);
      });
    }
    function probeImg() {
      return new Promise(function (res) {
        var bin = atob('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'), u8 = new Uint8Array(bin.length), done = false;
        for (var i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
        var img = new Image();
        function fin(v) { if (!done) { done = true; res(v); } }
        img.onload = function () { fin(true); }; img.onerror = function () { fin(false); }; setTimeout(function () { fin(false); }, 2500);
        img.src = URL.createObjectURL(new Blob([u8], { type: 'image/gif' }));
      });
    }
    var pr = d.probe && typeof d.probe === 'object' ? d.probe : null;
    var blobJs = pr ? !!pr.blobJs : await probeScript(URL.createObjectURL(new Blob(['window.__zfProbe=1;'], { type: 'text/javascript' })));
    var dataJs = pr ? !!pr.dataJs : (blobJs ? false : await probeScript('data:text/javascript,window.__zfProbe%3D1%3B'));
    var blobImg = pr ? !!pr.blobImg : await probeImg();

    function toDataUrl(f) { return new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(r.result); }; r.onerror = function () { rej(r.error); }; r.readAsDataURL(new Blob([f.b], { type: f.m })); }); }
    var dataUrls = new Map(), objUrls = new Map();
    await Promise.all(d.files.filter(function (f) { return FONT.test(f.m) || (!blobImg && MEDIA.test(f.m)); }).map(function (f) { return toDataUrl(f).then(function (u) { dataUrls.set(f.p, u); }); }));
    function objUrl(key, make) { var u = objUrls.get(key); if (!u) { u = URL.createObjectURL(make()); objUrls.set(key, u); } return u; }
    function assetUrl(p) { return dataUrls.get(p) || objUrl('a:' + p, function () { var f = files.get(p); return new Blob([f.b], { type: f.m }); }); }
    function jsUrl(p) { return objUrl('j:' + p, function () { return new Blob([texts.get(p) || ''], { type: 'text/javascript;charset=utf-8' }); }); }

    function dirname(p) { var i = p.lastIndexOf('/'); return i < 0 ? '' : p.slice(0, i + 1); }
    function norm(p) { var out = []; p.split('/').forEach(function (s) { if (!s || s === '.') return; if (s === '..') out.pop(); else out.push(s); }); return out.join('/'); }
    function find(p) { if (!p) return null; if (files.has(p)) return p; return lower.get(p.toLowerCase()) || null; }
    function hashOnly(sfx) { var i = (sfx || '').indexOf('#'); return i < 0 ? '' : sfx.slice(i); }
    var siteRoot = typeof d.root === 'string' ? d.root : '';
    function resolveRef(raw, baseDir, quiet) {
      if (raw == null) return null;
      var s = String(raw).trim();
      if (!s || s.charAt(0) === '#' || EXT.test(s)) return null;
      var cut = s.search(/[?#]/), clean = cut < 0 ? s : s.slice(0, cut), sfx = cut < 0 ? '' : s.slice(cut);
      try { clean = decodeURIComponent(clean); } catch (e) {}
      try { clean = clean.normalize('NFC'); } catch (e) {}
      clean = clean.replace(/\\/g, '/');
      var rooted = clean.charAt(0) === '/';
      var dirLike = clean === '' || /\/$/.test(clean);
      /* Rutas "/algo": desde la carpeta de la página de inicio (p. ej. dist/), luego la raíz del .zip y las carpetas superiores */
      var bases = rooted ? [siteRoot, ''] : [baseDir, ''];
      if (rooted) { var parts = baseDir.split('/').filter(Boolean); for (var k = parts.length; k > 0; k--) bases.push(parts.slice(0, k).join('/') + '/'); }
      var seen = {};
      for (var i = 0; i < bases.length; i++) {
        var b = bases[i];
        if (seen[b]) continue; seen[b] = 1;
        var full = norm(b + clean);
        var cands = dirLike ? [full ? full + '/index.html' : 'index.html', full ? full + '/index.htm' : 'index.htm'] : [full, full + '.html', full + '/index.html'];
        for (var j = 0; j < cands.length; j++) { var h = find(cands[j]); if (h) return { path: h, suffix: sfx }; }
      }
      if (rooted) { var f2 = norm(clean); if (f2.indexOf('/') > 0) { var h2 = find(f2.slice(f2.indexOf('/') + 1)); if (h2) return { path: h2, suffix: sfx }; } }
      if (!quiet) missing.add(clean.slice(0, 200));
      return null;
    }

    var URL_RE = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)"'\s][^)]*?))\s*\)/gi;
    var IMPORT_RE = /@import\s+(?:url\(\s*)?(?:"([^"]*)"|'([^']*)'|([^\s"';)]+))\s*\)?\s*([^;]*);/gi;
    function cssUrls(css, baseDir) {
      return String(css).replace(URL_RE, function (m, a, b, c) {
        var ref = a != null ? a : (b != null ? b : c);
        if (!ref || /^\s*(data:|blob:|#|about:)/i.test(ref)) return m;
        var r = resolveRef(ref, baseDir);
        return r ? 'url("' + assetUrl(r.path) + hashOnly(r.suffix) + '")' : m;
      });
    }
    function processCss(css, baseDir, depth) {
      depth = depth || 0;
      var parts = [];
      var outer = String(css).replace(IMPORT_RE, function (m, a, b, c, media) {
        var ref = a != null ? a : (b != null ? b : c);
        var r = resolveRef(ref, baseDir, true);
        if (!r || depth > 6 || !texts.has(r.path)) return m;
        var inner = processCss(texts.get(r.path), dirname(r.path), depth + 1);
        media = (media || '').trim();
        parts.push(media && !/^all$/i.test(media) ? '@media ' + media + '{\n' + inner + '\n}' : inner);
        return '\u0000ZIPFS' + (parts.length - 1) + '\u0000';
      });
      outer = cssUrls(outer, baseDir).replace(/\u0000ZIPFS(\d+)\u0000/g, function (m, i) { return parts[+i]; });
      if (depth === 0) {
        var hoisted = [];
        outer = outer.replace(/@charset\s+[^;]+;/gi, '').replace(IMPORT_RE, function (m) { hoisted.push(m); return ''; });
        outer = (hoisted.length ? hoisted.join('\n') + '\n' : '') + outer;
        outer = outer.replace(/<\/(style)/gi, '<\\/$1');
      }
      return outer;
    }

    var MOD_RE = /(\bimport\s*(?:[\w$*{}\s,]+?\s*from\s*)?|\bexport\s*(?:\*\s*(?:as\s+[\w$]+\s*)?|\{[^}]*\}\s*)from\s*)(["'])([^"'\n]+)\2/g;
    var DYN_RE = /(\bimport\s*\(\s*)(["'])([^"'\n]+)\2(\s*\))/g;
    var modSrc = new Map(), modRefs = new Set();
    function spec(s, baseDir) { if (!/^\.{0,2}\//.test(s)) return s; var r = resolveRef(s, baseDir); if (!r) return s; modRefs.add(r.path); return '@zipfs/' + r.path; }
    function rewriteModule(code, baseDir) {
      return String(code).replace(MOD_RE, function (m, pre, q, s) { return pre + q + spec(s, baseDir) + q; })
        .replace(DYN_RE, function (m, pre, q, s, post) { return pre + q + spec(s, baseDir) + q + post; });
    }
    function modSource(p) { if (!modSrc.has(p)) modSrc.set(p, rewriteModule(texts.get(p) || '', dirname(p))); return modSrc.get(p); }
    function modUrl(p) {
      if (blobJs) return objUrl('m:' + p, function () { return new Blob([modSource(p)], { type: 'text/javascript;charset=utf-8' }); });
      return 'data:text/javascript;charset=utf-8,' + encodeURIComponent(modSource(p));
    }
    function safeJs(code) { return String(code).replace(/<\/(script)/gi, '<\\/$1').replace(/<\!--/g, '<\\!--'); }

    /* Si la página no permite scripts blob: ni data:, los módulos ES se convierten
       a scripts clásicos que se registran en un cargador propio (window.__zipfsDefine). */
    var modFallback = !(blobJs || dataJs);
    var userMap = null;
    function baseDirUrl() { var b = String(document.baseURI || '').replace(/[?#].*$/, ''); return b.slice(0, b.lastIndexOf('/') + 1); }
    function userResolve(spec) {
      if (!userMap || !userMap.imports) return null;
      if (typeof userMap.imports[spec] === 'string') return userMap.imports[spec];
      var best = null;
      Object.keys(userMap.imports).forEach(function (k) { if (k.slice(-1) === '/' && spec.indexOf(k) === 0 && (!best || k.length > best.length)) best = k; });
      return best ? userMap.imports[best] + spec.slice(best.length) : null;
    }
    function specToId(spec, baseDir) {
      if (/^\.{0,2}\//.test(spec)) { var r = resolveRef(spec, baseDir, true); return r ? { id: r.path } : null; }
      if (EXT.test(spec)) return { url: spec };
      var m = userResolve(spec);
      if (m) { if (EXT.test(m)) return { url: m }; var r2 = resolveRef(m, baseDir, true); return r2 ? { id: r2.path } : null; }
      return null;
    }
    var IMP_STMT = /\bimport\s*(?:([\w$]+)\s*(?:,\s*)?)?(?:\*\s*as\s+([\w$]+)\s*)?(?:\{([^}]*)\}\s*)?from\s*(["'])([^"'\n]+)\4\s*;?|\bimport\s*(["'])([^"'\n]+)\6\s*;?/g;
    function esmToDefine(code, id, baseDir) {
      var deps = [], ext = [], exp = [], n = 0;
      var meta = baseDirUrl() + id.slice(4).replace(/#m\d+$/, '');
      function key(spec, dynamic) {
        var t = specToId(spec, baseDir);
        if (!t) return JSON.stringify(spec);
        if (t.url) { if (!dynamic && ext.indexOf(t.url) < 0) ext.push(t.url); return JSON.stringify(t.url); }
        if (deps.indexOf('zip:' + t.id) < 0) deps.push('zip:' + t.id);
        return JSON.stringify('zip:' + t.id);
      }
      function list(txt, fn) { String(txt).split(',').forEach(function (part) { part = part.trim(); if (!part) return; var mm = part.split(/\s+as\s+/); fn(mm[0].trim(), (mm[1] || mm[0]).trim()); }); }
      var out = String(code)
        .replace(/\bimport\.meta\.url\b/g, JSON.stringify(meta))
        .replace(/\bimport\.meta\b/g, '({url:' + JSON.stringify(meta) + '})')
        .replace(/\bimport\s*\(\s*(["'])([^"'\n]+)\1\s*\)/g, function (m, q, s) { return '__imp(' + key(s, true) + ')'; })
        .replace(/\bimport\s*\(/g, '__imp(')
        .replace(IMP_STMT, function (m, def, ns, named, q, src, q2, src2) {
          if (src2 != null) return '__req(' + key(src2) + ');';
          var v = '__i' + (n++), s = 'const ' + v + '=__req(' + key(src) + ');';
          if (def) s += 'const ' + def + '=' + v + '.default;';
          if (ns) s += 'const ' + ns + '=' + v + ';';
          if (named) list(named, function (a, b) { s += 'const ' + b + '=' + v + '[' + JSON.stringify(a) + '];'; });
          return s;
        })
        .replace(/\bexport\s*\*\s*as\s+([\w$]+)\s*from\s*(["'])([^"'\n]+)\2\s*;?/g, function (m, ns, q, src) { var k = key(src); return '__def(__exp,' + JSON.stringify(ns) + ',function(){return __req(' + k + ');});'; })
        .replace(/\bexport\s*\*\s*from\s*(["'])([^"'\n]+)\1\s*;?/g, function (m, q, src) { return '__star(__exp,__req(' + key(src) + '));'; })
        .replace(/\bexport\s*\{([^}]*)\}\s*from\s*(["'])([^"'\n]+)\2\s*;?/g, function (m, names, q, src) {
          var v = '__r' + (n++), s = 'const ' + v + '=__req(' + key(src) + ');';
          list(names, function (a, b) { s += '__def(__exp,' + JSON.stringify(b) + ',function(){return ' + v + '[' + JSON.stringify(a) + '];});'; });
          return s;
        })
        .replace(/\bexport\s*\{([^}]*)\}\s*;?/g, function (m, names) { list(names, function (a, b) { exp.push([b, a]); }); return ''; })
        .replace(/\bexport\s+default\s+(async\s+function\s*\*?|function\s*\*?|class)\s+([\w$]+)/g, function (m, kw, name) { exp.push(['default', name]); return kw + ' ' + name; })
        .replace(/\bexport\s+default\s+/g, '__exp.default=')
        .replace(/\bexport\s+(async\s+function\s*\*?|function\s*\*?|class|const|let|var)\s+([\w$]+)/g, function (m, kw, name) { exp.push([name, name]); return kw + ' ' + name; });
      var head = exp.map(function (e) { return '__def(__exp,' + JSON.stringify(e[0]) + ',function(){return ' + e[1] + ';});'; }).join('');
      return { text: '__zipfsDefine(' + JSON.stringify(id) + ',function(__req,__exp,__imp,__def,__star){"use strict";' + head + '\n' + out + '\n});', deps: deps, ext: ext };
    }

    var ASSETY = /\.(png|jpe?g|gif|webp|avif|svg|bmp|ico|mp4|webm|ogv|mp3|wav|ogg|m4a|json|pdf|woff2?|ttf|otf)(?:[?#].*)?$/i;
    function buildPage(path) {
      var dir = dirname(path);
      var doc = new DOMParser().parseFromString(texts.get(path) || '', 'text/html');
      var baseEl = doc.querySelector('base[href]');
      if (baseEl) { var bh = String(baseEl.getAttribute('href') || '').trim(); if (bh && !EXT.test(bh)) { var nd = norm(bh.charAt(0) === '/' ? bh : dir + bh); dir = nd ? nd + '/' : ''; } }
      each(doc.querySelectorAll('base'), function (el) { el.remove(); });
      each(doc.querySelectorAll('meta[http-equiv]'), function (el) { var v = String(el.getAttribute('http-equiv') || '').toLowerCase(); if (v === 'refresh' || v === 'content-security-policy') el.remove(); });

      function rw(el, attr) { var v = el.getAttribute(attr); if (v == null || /^\s*(data:|blob:)/i.test(v)) return; var r = resolveRef(v, dir); if (r) el.setAttribute(attr, assetUrl(r.path) + hashOnly(r.suffix)); }
      function rwSet(el, attr) {
        var v = el.getAttribute(attr); if (!v || /data:/i.test(v)) return;
        el.setAttribute(attr, v.split(',').map(function (part) { var m = part.trim().match(/^(\S+)(\s+.*)?$/); if (!m) return part; var r = resolveRef(m[1], dir); return (r ? assetUrl(r.path) : m[1]) + (m[2] || ''); }).join(', '));
      }
      var sprites = new Set();
      function inlineUse(el) {
        var attr = el.hasAttribute('href') ? 'href' : 'xlink:href';
        var v = el.getAttribute(attr); if (!v || v.charAt(0) === '#') return;
        var r = resolveRef(v, dir); if (!r) return;
        var frag = hashOnly(r.suffix); if (!frag) { el.setAttribute(attr, assetUrl(r.path)); return; }
        if (!sprites.has(r.path) && texts.has(r.path)) {
          sprites.add(r.path);
          var holder = doc.createElement('div');
          holder.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden');
          holder.setAttribute('aria-hidden', 'true');
          holder.innerHTML = texts.get(r.path).replace(/<\?xml[^>]*>/i, '').replace(/<!DOCTYPE[^>]*>/i, '');
          var host = doc.body || doc.documentElement;
          host.insertBefore(holder, host.firstChild);
        }
        el.setAttribute(attr, frag);
      }
      each(doc.querySelectorAll('*'), function (el) {
        var tag = String(el.localName).toLowerCase();
        if (el.hasAttribute('style')) el.setAttribute('style', cssUrls(el.getAttribute('style'), dir));
        if (tag === 'img' || tag === 'source') { rw(el, 'src'); rwSet(el, 'srcset'); }
        else if (tag === 'video') { rw(el, 'src'); rw(el, 'poster'); }
        else if (tag === 'audio' || tag === 'track' || tag === 'embed') rw(el, 'src');
        else if (tag === 'input' && String(el.getAttribute('type')).toLowerCase() === 'image') rw(el, 'src');
        else if (tag === 'object') rw(el, 'data');
        else if (tag === 'image' || tag === 'feimage') { rw(el, 'href'); rw(el, 'xlink:href'); }
        else if (tag === 'use') inlineUse(el);
        for (var j = 0; j < el.attributes.length; j++) {
          var at = el.attributes[j];
          if (at.name.indexOf('data-') === 0 && ASSETY.test(at.value) && !/^\s*(data:|blob:)/i.test(at.value)) {
            var r = resolveRef(at.value, dir, true);
            if (r) el.setAttribute(at.name, assetUrl(r.path) + hashOnly(r.suffix));
          }
        }
      });

      each(doc.querySelectorAll('link[href]'), function (el) {
        var rel = ' ' + String(el.getAttribute('rel') || '').toLowerCase() + ' ';
        var as = String(el.getAttribute('as') || '').toLowerCase();
        var sheet = rel.indexOf(' stylesheet ') >= 0 || (rel.indexOf(' preload ') >= 0 && as === 'style');
        var icon = rel.indexOf('icon') >= 0;
        var r = resolveRef(el.getAttribute('href'), dir, !sheet && !icon);
        if (!r) return;
        if (sheet) {
          if (rel.indexOf(' alternate ') >= 0 || !texts.has(r.path)) { el.remove(); return; }
          var st = doc.createElement('style');
          var media = el.getAttribute('media');
          if (media && !(el.hasAttribute('onload') && /^print$/i.test(media.trim()))) st.setAttribute('media', media);
          st.setAttribute('data-zipfs', r.path);
          st.textContent = processCss(texts.get(r.path) || '', dirname(r.path));
          el.setAttribute('data-zipfs-href', r.path);
          el.removeAttribute('href'); el.removeAttribute('onload'); el.removeAttribute('integrity');
          el.setAttribute('rel', 'stylesheet');
          el.parentNode.insertBefore(st, el.nextSibling);
        } else if (icon) el.setAttribute('href', assetUrl(r.path));
        else el.remove();
      });
      each(doc.querySelectorAll('style'), function (el) { if (!el.hasAttribute('data-zipfs')) el.textContent = processCss(el.textContent, dir); });

      var endQueue = [], moduleUsed = false, modEntries = [], inlineN = 0;
      userMap = null;
      each(doc.querySelectorAll('script[type="importmap" i]'), function (el) {
        try { var m = JSON.parse(el.textContent || '{}'); userMap = userMap ? { imports: Object.assign({}, userMap.imports, m.imports), scopes: Object.assign({}, userMap.scopes, m.scopes) } : m; } catch (e) {}
        el.remove();
      });
      each(doc.querySelectorAll('script'), function (el) {
        var type = String(el.getAttribute('type') || '').trim().toLowerCase();
        var classic = !type || /^(text|application)\/(x-)?(java|ecma)script$/.test(type);
        var isMod = type === 'module';
        var src = el.getAttribute('src');
        if (src == null) {
          if (isMod) {
            moduleUsed = true;
            if (modFallback) { modEntries.push({ id: 'zip:' + path + '#m' + (inlineN++), code: el.textContent, base: dir }); el.remove(); }
            else el.textContent = safeJs(rewriteModule(el.textContent, dir));
          }
          return;
        }
        var r = resolveRef(src, dir, !classic && !isMod);
        if (!r) {
          if (classic && !blobJs && el.hasAttribute('defer') && !el.hasAttribute('async')) { el.removeAttribute('defer'); el.remove(); endQueue.push(el); }
          return;
        }
        el.removeAttribute('integrity');
        if (isMod) {
          moduleUsed = true;
          if (modFallback) { modEntries.push({ id: 'zip:' + r.path }); el.remove(); }
          else { modRefs.add(r.path); el.setAttribute('src', modUrl(r.path)); }
          return;
        }
        if (!classic) return;
        if (blobJs) { el.setAttribute('src', jsUrl(r.path)); return; }
        var later = el.hasAttribute('defer') || el.hasAttribute('async');
        ['src', 'defer', 'async', 'crossorigin'].forEach(function (a) { el.removeAttribute(a); });
        el.textContent = safeJs(texts.get(r.path) || '') + '\n//# sourceURL=' + encodeURI(r.path);
        if (later) { el.remove(); endQueue.push(el); }
      });
      if (modFallback && modEntries.length) {
        var defined = new Map();
        var defineMod = function (id, code, base) {
          if (defined.has(id)) return;
          var t = esmToDefine(code, id, base);
          defined.set(id, t);
          var s = doc.createElement('script');
          s.textContent = safeJs(t.text) + '\n//# sourceURL=' + encodeURI(id.slice(4));
          endQueue.push(s);
          t.deps.forEach(function (dep) { var p = dep.slice(4); if (texts.has(p)) defineMod(dep, texts.get(p), dirname(p)); });
        };
        var allExt = function (id, seen, acc) {
          if (seen.has(id)) return acc; seen.add(id);
          var t = defined.get(id); if (!t) return acc;
          t.ext.forEach(function (u) { if (acc.indexOf(u) < 0) acc.push(u); });
          t.deps.forEach(function (dd) { allExt(dd, seen, acc); });
          return acc;
        };
        modEntries.forEach(function (m) { var p = m.id.slice(4); defineMod(m.id, m.code != null ? m.code : (texts.get(p) || ''), m.base != null ? m.base : dirname(p)); });
        modEntries.forEach(function (m) { var run = doc.createElement('script'); run.textContent = '__zipfsRun(' + JSON.stringify(m.id) + ',' + JSON.stringify(allExt(m.id, new Set(), [])) + ');'; endQueue.push(run); });
      }
      var head = doc.head;
      if ((moduleUsed && !modFallback) || userMap) {
        var imports = {}, userLocal = {};
        if (userMap && userMap.imports) Object.keys(userMap.imports).forEach(function (k) {
          var v = userMap.imports[k], r = typeof v === 'string' ? resolveRef(v, dir, true) : null;
          if (r && !modFallback) { modRefs.add(r.path); userLocal[k] = r.path; } else imports[k] = v;
        });
        if (!modFallback) {
          var cola = Array.from(modRefs), hechos = new Set();
          while (cola.length) { var mp = cola.shift(); if (hechos.has(mp) || !texts.has(mp)) continue; hechos.add(mp); modSource(mp); modRefs.forEach(function (q) { if (!hechos.has(q)) cola.push(q); }); }
          hechos.forEach(function (p) { imports['@zipfs/' + p] = modUrl(p); });
          Object.keys(userLocal).forEach(function (k) { imports[k] = modUrl(userLocal[k]); });
        }
        var im = doc.createElement('script');
        im.setAttribute('type', 'importmap');
        im.textContent = JSON.stringify({ imports: imports, scopes: (userMap && userMap.scopes) || {} }).replace(/</g, '\\u003c');
        head.insertBefore(im, head.firstChild);
      }
      var shim = doc.createElement('script');
      shim.textContent = '(' + d.shim + ')();';
      head.insertBefore(shim, head.firstChild);
      endQueue.forEach(function (el) { doc.body.appendChild(el); });
      var dt = doc.doctype;
      var dtTxt = dt ? '<!DOCTYPE ' + dt.name + (dt.publicId ? ' PUBLIC "' + dt.publicId + '"' + (dt.systemId ? ' "' + dt.systemId + '"' : '') : (dt.systemId ? ' SYSTEM "' + dt.systemId + '"' : '')) + '>' : '';
      return { html: dtTxt + doc.documentElement.outerHTML, dir: dir };
    }

    var built = buildPage(d.page);
    var Z = {
      files: files, page: d.page, dir: built.dir, hash: d.hash || '', storage: d.storage || {},
      post: post, assetUrl: assetUrl, hashOnly: hashOnly, blobJs: blobJs,
      resolve: function (raw) { return resolveRef(raw, Z.dir, true); },
      resolveFrom: function (raw, baseDir) { return resolveRef(raw, baseDir, true); },
      lookup: function (raw) {
        if (raw == null) return null;
        var s = String(raw).trim();
        if (!s || /^(blob|data|javascript|mailto|tel|sms|about):/i.test(s)) return null;
        if (EXT.test(s)) {
          var base = String(document.baseURI || '').replace(/[?#].*$/, '');
          var bdir = base.slice(0, base.lastIndexOf('/') + 1);
          var om = /^[a-z][a-z0-9+.\-]*:\/\/[^\/]+/i.exec(bdir), origin = om ? om[0] : '';
          if (/^\/\//.test(s)) s = (base.split(':')[0] || 'https') + ':' + s;
          if (bdir && s.indexOf(bdir) === 0) s = s.slice(bdir.length);
          else if (origin && s.indexOf(origin + '/') === 0) s = s.slice(origin.length);
          else return null;
        }
        return resolveRef(s, Z.dir, true);
      },
      cssUrls: function (t) { return cssUrls(t, Z.dir); },
      cssFile: function (p) { return processCss(texts.get(p) || '', dirname(p)); },
      jsText: function (p) { return texts.get(p); },
      jsUrl: jsUrl
    };
    try { Object.defineProperty(window, '__zipfs', { value: Z, configurable: true, enumerable: false }); } catch (e) { window.__zipfs = Z; }
    post('built', { mode: blobJs ? 'blob' : (dataJs ? 'data' : 'inline'), probe: { blobJs: blobJs, dataJs: dataJs, blobImg: blobImg }, missing: Array.from(missing).slice(0, 80) });
    document.open();
    document.write(built.html);
    document.close();
  }
}

/* Se inyecta como primer script de cada página del proyecto. */
function zipfsShim() {
  var Z = window.__zipfs;
  if (!Z) return;
  var post = Z.post, SVGNS = 'http://www.w3.org/2000/svg';
  function desc(x) { try { if (x && x.message) return String(x.message); if (typeof x === 'object') return JSON.stringify(x).slice(0, 300); return String(x); } catch (e) { return String(x); } }
  function abs(u) { try { return new URL(String(u), document.baseURI).href; } catch (e) { return String(u); } }

  /* Almacenamiento: el iframe aislado no tiene localStorage ni cookies propias */
  try {
    var memStore = function (seed, onChange) {
      var data = Object.assign(Object.create(null), seed || {});
      var api = {
        getItem: function (k) { k = String(k); return k in data ? data[k] : null; },
        setItem: function (k, v) { data[String(k)] = String(v); onChange(data); },
        removeItem: function (k) { delete data[String(k)]; onChange(data); },
        clear: function () { Object.keys(data).forEach(function (k) { delete data[k]; }); onChange(data); },
        key: function (i) { return Object.keys(data)[i] || null; }
      };
      return new Proxy(api, {
        get: function (t, k) { if (k === 'length') return Object.keys(data).length; if (k in t) return t[k]; return typeof k === 'string' && k in data ? data[k] : undefined; },
        set: function (t, k, v) { if (k in t) return true; data[String(k)] = String(v); onChange(data); return true; },
        deleteProperty: function (t, k) { delete data[String(k)]; onChange(data); return true; },
        has: function (t, k) { return k in t || k in data; },
        ownKeys: function () { return Object.keys(data); },
        getOwnPropertyDescriptor: function (t, k) { return k in data ? { value: data[k], enumerable: true, configurable: true, writable: true } : undefined; }
      });
    };
    var pendiente = false;
    var local = memStore(Z.storage.local, function (data) {
      if (pendiente) return;
      pendiente = true;
      Promise.resolve().then(function () { pendiente = false; post('storage', { local: Object.assign({}, data) }); });
    });
    var session = memStore(null, function () {});
    Object.defineProperty(window, 'localStorage', { configurable: true, enumerable: true, get: function () { return local; } });
    Object.defineProperty(window, 'sessionStorage', { configurable: true, enumerable: true, get: function () { return session; } });
    var jar = Object.assign(Object.create(null), Z.storage.cookies || {});
    Object.defineProperty(document, 'cookie', {
      configurable: true,
      get: function () { return Object.keys(jar).map(function (k) { return k + '=' + jar[k]; }).join('; '); },
      set: function (v) {
        var raw = String(v), first = raw.split(';')[0], i = first.indexOf('=');
        if (i < 0) return;
        var k = first.slice(0, i).trim();
        if (/max-age=\s*-?0\b|expires=[^;]*1970/i.test(raw)) delete jar[k]; else jar[k] = first.slice(i + 1).trim();
        post('storage', { cookies: Object.assign({}, jar) });
      }
    });
  } catch (e) {}

  /* history solo acepta cambios de #hash en un iframe srcdoc */
  try {
    ['pushState', 'replaceState'].forEach(function (k) {
      var o = history[k];
      history[k] = function (st, t) { try { return o.apply(history, arguments); } catch (e) { try { return o.call(history, st, t); } catch (e2) {} } };
    });
  } catch (e) {}

  /* Avisos para el panel */
  var budget = 60;
  function report(type, data) { if (budget-- > 0) post(type, data); }
  window.addEventListener('error', function (e) {
    var el = e.target;
    if (el && el !== window && el.nodeType === 1) {
      var u = el.getAttribute('src') || el.getAttribute('href') || el.getAttribute('data');
      if (u && !/^\s*(blob|data):/i.test(u)) report('missing', { url: String(u).slice(0, 300) });
      return;
    }
    report('error', { message: String(e.message || 'Error'), file: String(e.filename || '').replace(/^[a-z]+:\/\/[^\/]+\//i, '').slice(0, 120), line: e.lineno || 0 });
  }, true);
  window.addEventListener('unhandledrejection', function (e) { report('error', { message: 'Promesa sin manejar: ' + desc(e.reason) }); });
  try {
    ['error', 'warn'].forEach(function (lvl) {
      var o = console[lvl];
      console[lvl] = function () { try { report('console', { level: lvl, message: Array.prototype.map.call(arguments, desc).join(' ').slice(0, 500) }); } catch (x) {} return o.apply(console, arguments); };
    });
  } catch (e) {}
  document.addEventListener('securitypolicyviolation', function (e) {
    var u = String(e.blockedURI || '');
    if (u && Z.lookup(u)) return;
    report('blocked', { url: u.slice(0, 300), what: String(e.effectiveDirective || e.violatedDirective || '') });
  });
  window.alert = function (m) { post('alert', { message: String(m == null ? '' : m).slice(0, 500) }); };
  window.confirm = function (m) { post('alert', { message: String(m == null ? '' : m).slice(0, 500) }); return true; };
  window.prompt = function (m, v) { post('alert', { message: String(m == null ? '' : m).slice(0, 500) }); return v == null ? '' : String(v); };
  window.open = function (u) { if (u) post('external', { url: abs(u) }); return null; };

  /* Rutas del proyecto → archivos del .zip */
  function mapUrl(v) { if (v == null) return v; var s = String(v); if (/^\s*(blob:|data:|#)/i.test(s)) return v; var r = Z.resolve(s); return r ? Z.assetUrl(r.path) + Z.hashOnly(r.suffix) : v; }
  function mapSet(v) { if (!v || /data:/i.test(v)) return v; return String(v).split(',').map(function (part) { var m = part.trim().match(/^(\S+)(\s+.*)?$/); return m ? mapUrl(m[1]) + (m[2] || '') : part; }).join(', '); }
  function mapCss(v) { return typeof v === 'string' && /url\(/i.test(v) ? Z.cssUrls(v) : v; }
  var setAttr = Element.prototype.setAttribute, getAttr = Element.prototype.getAttribute;
  function runLater(el) {
    var p = el.__zipfsCode; if (!p) return; el.__zipfsCode = null;
    var s = document.createElement('script');
    s.textContent = (Z.jsText(p) || '') + '\n//# sourceURL=' + encodeURI(p);
    (document.head || document.documentElement).appendChild(s);
    setTimeout(function () { el.dispatchEvent(new Event('load')); }, 0);
  }
  function scriptSrc(el, v, set) {
    var r = Z.resolve(v);
    if (!r || !/\.(m?js|cjs)$/i.test(r.path) || Z.jsText(r.path) == null) return set(el, v);
    if (Z.blobJs) return set(el, Z.jsUrl(r.path));
    el.__zipfsCode = r.path;
    if (el.isConnected) runLater(el);
  }
  function applyCss(el) {
    var p = el.__zipfsCss; if (!p || !el.parentNode) return; el.__zipfsCss = null;
    var st = el.nextElementSibling;
    if (!st || st.localName !== 'style' || !st.hasAttribute('data-zipfs')) { st = document.createElement('style'); setAttr.call(st, 'data-zipfs', p); el.parentNode.insertBefore(st, el.nextSibling); }
    st.textContent = Z.cssFile(p);
    var media = getAttr.call(el, 'media'); if (media) setAttr.call(st, 'media', media);
    setTimeout(function () { el.dispatchEvent(new Event('load')); }, 0);
  }
  function linkHref(el, v, set) {
    var r = Z.resolve(v);
    if (r && /\.css$/i.test(r.path)) { setAttr.call(el, 'data-zipfs-href', r.path); el.__zipfsCss = r.path; if (el.isConnected) applyCss(el); return; }
    if (r && /icon/i.test(String(getAttr.call(el, 'rel') || ''))) return set(el, Z.assetUrl(r.path));
    return set(el, v);
  }
  function hook(proto, prop, fn) {
    var dsc = proto && Object.getOwnPropertyDescriptor(proto, prop);
    if (!dsc || !dsc.set) return;
    Object.defineProperty(proto, prop, { configurable: true, enumerable: dsc.enumerable, get: dsc.get, set: function (v) { return fn.call(this, v, dsc.set); } });
  }
  function plain(map) { return function (v, set) { return set.call(this, map(v)); }; }
  try {
    hook(HTMLImageElement.prototype, 'src', plain(mapUrl));
    hook(HTMLImageElement.prototype, 'srcset', plain(mapSet));
    hook(HTMLSourceElement.prototype, 'src', plain(mapUrl));
    hook(HTMLSourceElement.prototype, 'srcset', plain(mapSet));
    hook(HTMLMediaElement.prototype, 'src', plain(mapUrl));
    hook(HTMLVideoElement.prototype, 'poster', plain(mapUrl));
    hook(HTMLScriptElement.prototype, 'src', function (v, set) { return scriptSrc(this, v, function (el, x) { set.call(el, x); }); });
    hook(HTMLLinkElement.prototype, 'href', function (v, set) { return linkHref(this, v, function (el, x) { set.call(el, x); }); });
    Element.prototype.setAttribute = function (name, value) {
      var n = String(name).toLowerCase(), tag = this.localName;
      try {
        if (n === 'src' && tag === 'script') return scriptSrc(this, value, function (el, x) { setAttr.call(el, 'src', x); });
        if (n === 'href' && tag === 'link') return linkHref(this, value, function (el, x) { setAttr.call(el, 'href', x); });
        if (n === 'src' || n === 'poster' || (n === 'data' && tag === 'object') || ((n === 'href' || n === 'xlink:href') && this.namespaceURI === SVGNS)) value = mapUrl(value);
        else if (n === 'srcset') value = mapSet(value);
        else if (n === 'style') value = mapCss(String(value));
      } catch (e) {}
      return setAttr.call(this, name, value);
    };
    var cssProto = Object.getPrototypeOf(document.documentElement.style);
    ['background', 'backgroundImage', 'background-image', 'borderImage', 'borderImageSource', 'listStyle', 'listStyleImage', 'maskImage', 'webkitMaskImage', 'content', 'cssText'].forEach(function (p) {
      var proto = cssProto, dsc = null;
      while (proto && !(dsc = Object.getOwnPropertyDescriptor(proto, p))) proto = Object.getPrototypeOf(proto);
      if (dsc && dsc.set) Object.defineProperty(proto, p, { configurable: true, enumerable: dsc.enumerable, get: dsc.get, set: function (v) { return dsc.set.call(this, mapCss(v)); } });
    });
    var setProp = CSSStyleDeclaration.prototype.setProperty;
    CSSStyleDeclaration.prototype.setProperty = function (n, v, pr) { return setProp.call(this, n, mapCss(v), pr); };
    var insRule = CSSStyleSheet.prototype.insertRule;
    CSSStyleSheet.prototype.insertRule = function (rule, i) { return insRule.call(this, mapCss(rule), i); };
    var NativeAudio = window.Audio;
    if (NativeAudio) { window.Audio = function (src) { var a = new NativeAudio(); if (src !== undefined) a.src = src; return a; }; window.Audio.prototype = NativeAudio.prototype; }
  } catch (e) {}

  /* Elementos que el proyecto crea o cambia después de cargar */
  var ATTRS = ['src', 'srcset', 'poster', 'style', 'href'];
  function fixAttr(el, a) {
    if (!el || el.nodeType !== 1) return;
    var tag = el.localName;
    if (tag === 'script' || tag === 'link' || tag === 'a' || tag === 'area' || tag === 'iframe' || tag === 'base') return;
    if (a === 'href' && el.namespaceURI !== SVGNS) return;
    var v = getAttr.call(el, a); if (v == null) return;
    var nv = a === 'style' ? mapCss(v) : (a === 'srcset' ? mapSet(v) : mapUrl(v));
    if (nv !== v) setAttr.call(el, a, nv);
  }
  function visit(el) {
    if (el.__zipfsCode) runLater(el);
    if (el.__zipfsCss) applyCss(el);
    if (el.localName === 'style' && !el.hasAttribute('data-zipfs') && !el.__zipfsSeen) {
      el.__zipfsSeen = true;
      var t = el.textContent; if (/url\(/i.test(t)) { var nt = Z.cssUrls(t); if (nt !== t) el.textContent = nt; }
    }
    for (var i = 0; i < ATTRS.length; i++) if (el.hasAttribute(ATTRS[i])) fixAttr(el, ATTRS[i]);
  }
  try {
    new MutationObserver(function (recs) {
      for (var i = 0; i < recs.length; i++) {
        var r = recs[i];
        if (r.type === 'attributes') { fixAttr(r.target, r.attributeName); continue; }
        for (var j = 0; j < r.addedNodes.length; j++) {
          var n = r.addedNodes[j];
          if (n.nodeType !== 1) continue;
          visit(n);
          if (n.firstElementChild) { var all = n.querySelectorAll('[src],[srcset],[poster],[style],style,image,use,script,link'); for (var k = 0; k < all.length; k++) visit(all[k]); }
        }
      }
    }).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ATTRS });
  } catch (e) {}

  /* fetch y XMLHttpRequest a archivos del .zip */
  try {
    var nativeFetch = window.fetch;
    if (nativeFetch) window.fetch = function (input, init) {
      try {
        var raw = typeof input === 'string' ? input : (input && typeof input.url === 'string' ? input.url : String(input));
        var method = String((init && init.method) || (input && input.method) || 'GET').toUpperCase();
        var r = method === 'GET' || method === 'HEAD' ? (Z.resolve(raw) || Z.lookup(raw)) : null;
        if (r) { var f = Z.files.get(r.path); return Promise.resolve(new Response(method === 'HEAD' ? null : f.b, { status: 200, statusText: 'OK', headers: { 'Content-Type': f.m } })); }
      } catch (e) {}
      return nativeFetch.apply(this, arguments);
    };
    var XP = XMLHttpRequest.prototype, xOpen = XP.open, xSend = XP.send;
    XP.open = function (method, url) {
      var r = null;
      try { if (!method || /^(get|head)$/i.test(method)) r = Z.resolve(url) || Z.lookup(url); } catch (e) {}
      this.__zipfs = r;
      if (r) { var args = Array.prototype.slice.call(arguments); args[1] = 'data:text/plain,'; args[2] = true; return xOpen.apply(this, args); }
      return xOpen.apply(this, arguments);
    };
    XP.send = function () {
      var r = this.__zipfs;
      if (!r) return xSend.apply(this, arguments);
      var xhr = this, f = Z.files.get(r.path), rt = xhr.responseType || '';
      f.b.arrayBuffer().then(function (buf) {
        var text = null, resp;
        if (rt === 'arraybuffer') resp = buf;
        else if (rt === 'blob') resp = f.b;
        else {
          text = new TextDecoder().decode(buf);
          if (rt === 'json') { try { resp = JSON.parse(text); } catch (e) { resp = null; } }
          else if (rt === 'document') resp = new DOMParser().parseFromString(text, /xml/.test(f.m) ? 'application/xml' : 'text/html');
          else resp = text;
        }
        function def(k, v) { try { Object.defineProperty(xhr, k, { configurable: true, get: function () { return v; } }); } catch (e) {} }
        def('readyState', 4); def('status', 200); def('statusText', 'OK'); def('response', resp); def('responseURL', '');
        if (rt === '' || rt === 'text') def('responseText', text);
        if (rt === 'document') def('responseXML', resp);
        xhr.getResponseHeader = function (h) { return /^content-type$/i.test(h) ? f.m : null; };
        xhr.getAllResponseHeaders = function () { return 'content-type: ' + f.m + '\r\n'; };
        xhr.dispatchEvent(new Event('readystatechange'));
        var n = buf.byteLength;
        ['load', 'loadend'].forEach(function (t) { xhr.dispatchEvent(new ProgressEvent(t, { lengthComputable: true, loaded: n, total: n })); });
      });
    };
  } catch (e) {}

  /* Cargador de módulos ES convertidos (cuando la página no admite scripts blob: ni data:) */
  try {
    var MODS = Object.create(null), DONE = Object.create(null);
    var defGet = function (o, k, g) { try { Object.defineProperty(o, k, { enumerable: true, configurable: true, get: g }); } catch (e) {} };
    var star = function (o, src) { Object.keys(src).forEach(function (k) { if (k !== 'default' && !Object.prototype.hasOwnProperty.call(o, k)) defGet(o, k, function () { return src[k]; }); }); };
    var makeImp = function (base) {
      return function (spec) {
        var s = String(spec);
        return new Promise(function (res, rej) {
          try {
            if (MODS[s] || DONE[s]) return res(modReq(s));
            if (s.indexOf('zip:') !== 0 && !/^(https?:)?\/\//i.test(s)) {
              var dir = base.slice(4).replace(/#m\d+$/, ''); dir = dir.slice(0, dir.lastIndexOf('/') + 1);
              var r = Z.resolveFrom(s, dir);
              if (r && MODS['zip:' + r.path]) return res(modReq('zip:' + r.path));
            }
            if (/^(https?:)?\/\//i.test(s)) return import(s).then(res, rej);
            rej(new Error('Módulo no disponible en la vista previa: ' + s));
          } catch (e) { rej(e); }
        });
      };
    };
    var modReq = function (id) {
      if (DONE[id]) return DONE[id];
      var fn = MODS[id];
      if (!fn) throw new Error('Módulo no disponible en la vista previa: ' + id);
      var exp = DONE[id] = {};
      fn(modReq, exp, makeImp(id), defGet, star);
      return exp;
    };
    window.__zipfsDefine = function (id, fn) { MODS[id] = fn; };
    window.__zipfsRun = function (id, ext) {
      if (!ext || !ext.length) { modReq(id); return; }
      Promise.all(ext.map(function (u) { return import(u).then(function (ns) { DONE[u] = ns; }); }))
        .then(function () { modReq(id); })
        .catch(function (e) { setTimeout(function () { throw e; }); });
    };
  } catch (e) {}

  /* Enlaces, anclas, formularios y navegación */
  function goHash(id) {
    if (!id) { try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { window.scrollTo(0, 0); } return; }
    var dec = id; try { dec = decodeURIComponent(id); } catch (e) {}
    var t = document.getElementById(dec) || document.getElementsByName(dec)[0];
    var y0 = window.scrollY;
    try { location.hash = id; } catch (e) {}
    if (t) {
      try { t.scrollIntoView(); } catch (e) {}
      setTimeout(function () { if (window.scrollY === y0 && Math.abs(t.getBoundingClientRect().top) > 4) { try { t.scrollIntoView(); } catch (e) {} } }, 80);
    }
  }
  function navTo(r) {
    var hash = Z.hashOnly(r.suffix).slice(1);
    if (r.path === Z.page) { goHash(hash); return; }
    if (/\.(x?html?)$/i.test(r.path)) post('nav', { path: r.path, hash: hash });
    else post('file', { path: r.path });
  }
  window.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0) return;
    var a = e.target && e.target.closest ? e.target.closest('a[href], area[href]') : null;
    if (!a) return;
    var raw = String(a.getAttribute('href') || '').trim();
    if (/^javascript:/i.test(raw)) return;
    e.preventDefault();
    if (!raw) return;
    if (raw.charAt(0) === '#') { goHash(raw.slice(1)); return; }
    if (/^(mailto|tel|sms|whatsapp):/i.test(raw)) { post('external', { url: raw }); return; }
    var local = Z.resolve(raw) || (/^([a-z][a-z0-9+.\-]*:)?\/\//i.test(raw) ? Z.lookup(abs(raw)) : null);
    if (local) { navTo(local); return; }
    if (/^([a-z][a-z0-9+.\-]*:)?\/\//i.test(raw)) { post('external', { url: abs(raw) }); return; }
    post('missing', { url: raw.slice(0, 300) });
  });
  window.addEventListener('submit', function (e) {
    if (e.defaultPrevented) return;
    e.preventDefault();
    var f = e.target, action = f && f.getAttribute ? String(f.getAttribute('action') || '') : '';
    var r = action ? Z.resolve(action) : null;
    if (r && /\.html?$/i.test(r.path) && String(f.method || 'get').toLowerCase() === 'get') { navTo(r); return; }
    post('form', { action: action.slice(0, 300) });
  });
  try {
    if (window.navigation && typeof navigation.addEventListener === 'function') {
      navigation.addEventListener('navigate', function (e) {
        try {
          if (e.hashChange || e.downloadRequest || !e.cancelable) return;
          if (e.navigationType === 'reload' || e.navigationType === 'traverse') return;
          var url = String((e.destination && e.destination.url) || '');
          if (/^about:srcdoc/i.test(url)) return;
          var base = String(document.baseURI || '').replace(/#.*$/, '');
          e.preventDefault();
          if (url.replace(/#.*$/, '') === base) { goHash(url.indexOf('#') >= 0 ? url.slice(url.indexOf('#') + 1) : ''); return; }
          var r = Z.lookup(url);
          if (r) navTo(r); else if (/^https?:/i.test(url)) post('external', { url: url });
        } catch (x) {}
      });
    }
  } catch (e) {}

  function sendTitle() { post('title', { title: String(document.title || '') }); }
  document.addEventListener('DOMContentLoaded', function () { sendTitle(); if (Z.hash) goHash(Z.hash); });
  window.addEventListener('load', function () { sendTitle(); post('loaded', {}); });
}

const SHIM_SRC = zipfsShim.toString();
const LOADER = '<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;height:100%;background:#fff}body{display:grid;place-items:center;font:13px system-ui,sans-serif;color:#7a8290}</style></head><body><div>Abriendo el proyecto…</div><script>(' + zipfsEngine.toString() + ')();<\/script></body></html>';

/* =====================================================================
   Visor (lado del panel)
   ===================================================================== */
const almacenProyecto = new Map();
const V = {
  iframe: null, files: null, lista: [], paginas: [], pagina: '', hash: '', clave: '', manifiesto: null, verId: null,
  arrancado: false, temporizador: 0, problemas: [], vistos: new Set(), titulo: '', modo: '',
  disp: DISP[lsGet('vitrina.disp', '')] ? lsGet('vitrina.disp', '') : (window.innerWidth < 760 ? 'movil' : 'escritorio'),
  init() {
    this.stage = $('#vStage'); this.box = $('#vBox'); this.msg = $('#vMsg');
    new ResizeObserver(() => this.ajustar()).observe(this.stage);
    window.addEventListener('message', (ev) => {
      if (!this.iframe || ev.source !== this.iframe.contentWindow) return;
      const d = ev.data;
      if (!d || typeof d.type !== 'string' || d.type.indexOf('zipfs:') !== 0) return;
      this.recibir(d.type.slice(6), d);
    });
    $('#vDisp').addEventListener('click', (e) => {
      const b = e.target.closest('[data-disp]'); if (!b) return;
      const viejo = $('#vDisp [aria-pressed="true"]');
      this.disp = b.dataset.disp; lsSet('vitrina.disp', this.disp); this.pintarBarra(); this.ajustar();
      if (viejo !== b) { MOV.cruce(b); if (viejo) MOV.cruce(viejo); if (this.iframe && !this.box.hidden) MOV.materializar(this.box); }
    });
    $('#vPagina').addEventListener('change', (e) => this.ir(e.target.value));
    $('#vRecargar').addEventListener('click', () => { if (this.files) this.ir(this.pagina, this.hash); });
    $('#vAmpliar').addEventListener('click', () => { const d = $('#detalle'); d.classList.toggle('expand'); this.pintarBarra(); requestAnimationFrame(() => this.ajustar()); });
    $('#vProblemas').addEventListener('click', (e) => { e.stopPropagation(); const p = $('#vPop'); if (p.hidden || p._cerrando) { this.pintarProblemas(); abrirPopover(p); } else cerrarPopover(p); });
    document.addEventListener('click', (e) => { const p = $('#vPop'); if (!p.hidden && !p.contains(e.target)) cerrarPopover(p); });
    if (vigiaIndicadores) vigiaIndicadores.observe($('#vDisp'));
    this.pintarBarra();
  },
  limpiar() {
    clearTimeout(this.temporizador); clearTimeout(this.tRevelar); this.nuevo = false; this.box.style.opacity = '';
    if (this.iframe) { this.iframe.remove(); this.iframe = null; }
    this.files = null; this.lista = []; this.paginas = []; this.manifiesto = null; this.verId = null;
    this.box.hidden = true; $('#vPop').hidden = true;
  },
  mensaje(html) { this.msg.innerHTML = html; this.msg.hidden = false; },
  cargando(txt) { this.box.hidden = true; this.mensaje(`<div class="v-card"><div class="spinner" aria-hidden="true"></div><p>${esc(txt)}</p></div>`); },
  error(txt) { this.box.hidden = true; this.mensaje(`<div class="v-card">${ic('alert')}<h3>No se pudo mostrar</h3><p>${esc(txt)}</p></div>`); },
  vacio() {
    if (this.iframe) { this.iframe.remove(); this.iframe = null; }
    this.files = null; this.box.hidden = true;
    this.mensaje(`<div class="v-card">${ic('box')}<h3>Este proyecto aún no tiene archivos</h3><p>Sube el .zip con el HTML del proyecto para verlo aquí.</p>${S.puedeSubir ? '<button type="button" class="btn btn-ink btn-sm" data-accion="subir-version">Subir .zip</button>' : ''}</div>`);
    this.pintarBarra();
  },
  cargar({ files, paginas, pagina, hash, clave, manifiesto, verId, raiz }) {
    this.files = files; this.paginas = paginas.filter(p => files.has(p)); this.clave = clave || ''; this.manifiesto = manifiesto || null; this.verId = verId || null;
    this.raiz = typeof raiz === 'string' ? raiz : dirDe(pagina || '');
    this.lista = Array.from(files, ([p, f]) => ({ p, b: f.blob, m: f.m }));
    this.nuevo = !reducido();
    if (this.nuevo) this.box.style.opacity = '0';
    if (!almacenProyecto.has(this.clave)) almacenProyecto.set(this.clave, { local: {}, cookies: {} });
    this.ir(files.has(pagina) ? pagina : this.paginas[0], hash);
  },
  ir(pagina, hash) {
    if (!this.files || !this.files.has(pagina)) return;
    this.pagina = pagina; this.hash = hash || ''; this.titulo = ''; this.problemas = []; this.vistos = new Set(); this.arrancado = false;
    clearTimeout(this.temporizador);
    if (this.iframe) this.iframe.remove();
    const f = document.createElement('iframe');
    f.setAttribute('sandbox', 'allow-scripts allow-forms');
    f.setAttribute('title', 'Vista previa de ' + pagina);
    f.setAttribute('referrerpolicy', 'no-referrer');
    f.srcdoc = LOADER;
    f.style.opacity = '0';
    this.box.appendChild(f);
    this.iframe = f;
    this.msg.hidden = true; this.box.hidden = false;
    this.temporizador = setTimeout(() => { if (!this.arrancado) this.error('La vista previa no arrancó. Recarga la página del panel o prueba en Chrome, Edge o Firefox recientes.'); }, 9000);
    this.ajustar(); this.pintarBarra(); pintarDetalleContexto();
  },
  recibir(t, d) {
    switch (t) {
      case 'ready':
        this.arrancado = true; clearTimeout(this.temporizador);
        this.iframe.contentWindow.postMessage({ type: 'zipfs:load', files: this.lista, page: this.pagina, hash: this.hash, root: this.raiz || '', probe: this.probe, storage: almacenProyecto.get(this.clave) || {}, shim: SHIM_SRC }, '*');
        clearTimeout(this.tRevelar); this.tRevelar = setTimeout(() => this.revelar(), 1500);
        break;
      case 'built':
        this.modo = String(d.mode || '');
        if (d.probe && typeof d.probe === 'object') this.probe = { blobJs: !!d.probe.blobJs, dataJs: !!d.probe.dataJs, blobImg: !!d.probe.blobImg };
        if (Array.isArray(d.missing)) d.missing.forEach(u => this.problema('missing', String(u)));
        this.revelar();
        break;
      case 'title': this.titulo = String(d.title || '').slice(0, 140); this.pintarBarra(); break;
      case 'nav': { const p = String(d.path || ''); if (this.files && this.files.has(p) && esHtml(p)) this.ir(p, String(d.hash || '').slice(0, 200)); break; }
      case 'external': avisoExterno(String(d.url || '')); break;
      case 'file': { const p = String(d.path || ''); if (this.files && this.files.has(p)) toast(`La página enlaza al archivo ${p}. Lo ves en la pestaña Archivos.`); break; }
      case 'form': toast('Se envió un formulario dentro de la vista previa. Aquí no se manda a ningún lado.'); break;
      case 'alert': toast('La página mostró un aviso: «' + String(d.message || '').slice(0, 220) + '»'); break;
      case 'storage': {
        const a = almacenProyecto.get(this.clave); if (!a) break;
        try { if (d.local && typeof d.local === 'object' && JSON.stringify(d.local).length < 400000) a.local = d.local; if (d.cookies && typeof d.cookies === 'object' && JSON.stringify(d.cookies).length < 20000) a.cookies = d.cookies; } catch (e) { /* ignorar */ }
        break;
      }
      case 'missing': this.problema('missing', String(d.url || '')); break;
      case 'blocked': this.problema('blocked', String(d.url || ''), String(d.what || '')); break;
      case 'error': this.problema('error', String(d.message || ''), d.file ? `${String(d.file)}${d.line ? ':' + (Number(d.line) || '') : ''}` : ''); break;
      case 'console': if (d.level === 'error') this.problema('console', String(d.message || '')); break;
      case 'fatal': this.error('El motor de vista previa falló: ' + String(d.message || '')); break;
    }
  },
  /* La página entra con un fundido cuando ya está armada; una versión nueva además se materializa. */
  revelar() {
    clearTimeout(this.tRevelar);
    const f = this.iframe;
    if (!f || f.style.opacity !== '0') return;
    MOV.fundir(f, 0, 1, 0.22, 0, () => { f.style.opacity = ''; });
    if (this.nuevo) { this.nuevo = false; this.box.style.opacity = ''; MOV.materializar(this.box); }
  },
  problema(tipo, texto, extra = '') {
    texto = texto.slice(0, 300);
    if (!texto || (tipo === 'blocked' && /^(inline|eval)$/.test(texto))) return;
    const k = tipo + '|' + texto;
    if (this.vistos.has(k) || this.problemas.length >= 80) return;
    this.vistos.add(k); this.problemas.push({ tipo, texto, extra });
    this.pintarBarra();
    if (!$('#vPop').hidden) this.pintarProblemas();
  },
  pintarProblemas() {
    const grupos = { missing: [], externo: [], error: [] };
    for (const p of this.problemas) {
      if (p.tipo === 'missing') (/^(https?:)?\/\//i.test(p.texto) ? grupos.externo : grupos.missing).push(p);
      else if (p.tipo === 'blocked') grupos.externo.push(p);
      else grupos.error.push(p);
    }
    let h = '';
    if (grupos.missing.length) h += `<h4>No están en el .zip</h4><ul>${grupos.missing.map(p => `<li>${ic('file')}<span class="mono">${esc(p.texto)}</span></li>`).join('')}</ul>`;
    if (grupos.error.length) h += `<h4>Errores de JavaScript</h4><ul>${grupos.error.map(p => `<li>${ic('code')}<span>${esc(p.texto)}${p.extra ? ` <small class="mono">${esc(p.extra)}</small>` : ''}</span></li>`).join('')}</ul>`;
    if (grupos.externo.length) h += `<h4>Recursos externos que no cargan aquí</h4><ul>${grupos.externo.map(p => `<li>${ic('blocked')}<span class="mono">${esc(p.texto)}</span></li>`).join('')}</ul><p class="muted" style="margin:0">Dentro de la vista previa solo cargan los archivos del .zip, Google Fonts y scripts de cdnjs, jsDelivr, unpkg, cdn.tailwindcss.com y code.jquery.com. En la web publicada sí cargarán.</p>`;
    if (!h) h = '<p class="muted" style="margin:0">No se detectaron problemas en esta página.</p>';
    $('#vPop').innerHTML = h;
  },
  pintarBarra() {
    const sel = $('#vPagina');
    const opciones = this.paginas.length ? this.paginas : [];
    sel.innerHTML = opciones.map(p => `<option value="${esc(p)}"${p === this.pagina ? ' selected' : ''}>${esc(p)}</option>`).join('') || '<option>Sin páginas</option>';
    sel.disabled = !this.files;
    sel.title = this.titulo ? `${this.pagina} · ${this.titulo}` : this.pagina;
    $$('#vDisp [data-disp]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.disp === this.disp)));
    moverIndicador($('#vDisp'), $('#vDisp [aria-pressed="true"]'), !$('#detalle').hidden);
    const exp = $('#detalle').classList.contains('expand');
    const ba = $('#vAmpliar'); ba.innerHTML = ic(exp ? 'shrink' : 'expand'); ba.title = exp ? 'Reducir la vista previa' : 'Ampliar la vista previa'; ba.setAttribute('aria-label', ba.title);
    const bp = $('#vProblemas');
    const n = this.problemas.length, errores = this.problemas.filter(p => p.tipo === 'error' || p.tipo === 'console').length;
    bp.hidden = !this.files;
    bp.classList.toggle('err', errores > 0);
    bp.innerHTML = n ? `${ic('alert')}${n} ${n === 1 ? 'aviso' : 'avisos'}` : `${ic('check')}Sin avisos`;
    if (!n) bp.classList.remove('probs'); else bp.classList.add('probs');
  },
  ajustar() {
    if (!this.iframe || this.box.hidden) return;
    const r = this.stage.getBoundingClientRect();
    const d = DISP[this.disp];
    this.box.className = 'dev dev-' + this.disp;
    if (!d.w || r.width < 40) {
      Object.assign(this.box.style, { left: '0px', top: '0px', width: r.width + 'px', height: r.height + 'px', borderWidth: '0px' });
      Object.assign(this.iframe.style, { width: r.width + 'px', height: r.height + 'px', transform: 'none' });
      $('#vZoom').textContent = '100%';
      return;
    }
    const pad = r.width < 600 ? 10 : 18, bz = d.bezel;
    const s = Math.max(0.1, Math.min(1, (r.width - pad * 2 - bz * 2) / d.w, (r.height - pad * 2 - bz * 2) / d.h));
    const bw = Math.round(d.w * s) + bz * 2, bh = Math.round(d.h * s) + bz * 2;
    Object.assign(this.box.style, { left: Math.round((r.width - bw) / 2) + 'px', top: Math.max(pad, Math.round((r.height - bh) / 2)) + 'px', width: bw + 'px', height: bh + 'px', borderWidth: bz + 'px' });
    Object.assign(this.iframe.style, { width: d.w + 'px', height: d.h + 'px', transform: `scale(${s})` });
    $('#vZoom').textContent = Math.round(s * 100) + '%';
  },
};
function avisoExterno(url) {
  url = url.slice(0, 500);
  if (/^https?:\/\//i.test(url)) toast({ texto: 'La página quiere abrir un enlace externo:', enlace: url });
  else if (/^(mailto|tel|sms|whatsapp):/i.test(url)) toast('La página quiere abrir: ' + url);
}

/* =====================================================================
   Avisos flotantes
   ===================================================================== */
function toast(m) {
  const o = typeof m === 'string' ? { texto: m } : m;
  const el = document.createElement('div');
  el.className = 'toast';
  const tx = document.createElement('div'); tx.className = 'tx'; tx.textContent = o.texto;
  if (o.enlace) { const a = document.createElement('a'); a.href = o.enlace; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = (o.enlace.length > 70 ? o.enlace.slice(0, 70) + '…' : o.enlace) + ' ↗'; tx.appendChild(a); }
  const x = document.createElement('button'); x.type = 'button'; x.setAttribute('aria-label', 'Cerrar aviso'); x.innerHTML = ic('x');
  x.addEventListener('click', () => quitarToast(el));
  el.append(tx, x);
  const cont = $('#toasts'); cont.appendChild(el);
  while (cont.children.length > 4) cont.firstElementChild.remove();
  animar(el, { opacity: 0, y: 14, scale: 0.96, blur: 6 }, { opacity: 1, y: 0, scale: 1, blur: 0 }, { por: { transform: { resorte: RESORTE.pop }, opacity: { dur: 0.2 }, filter: { dur: 0.25 } } });
  setTimeout(() => quitarToast(el), o.enlace ? 9000 : 6000);
}
function quitarToast(el) {
  if (!el.isConnected || el._yendo) return;
  el._yendo = true;
  MOV.desmaterializar(el, () => el.remove());
  setTimeout(() => el.remove(), 600);
}

/* =====================================================================
   Conexión con el servidor (api.php y la base de datos MySQL)
   ===================================================================== */
const API = 'api.php';
class ErrorApi extends Error {
  constructor(mensaje, estado, datos) { super(mensaje); this.estado = estado || 0; this.datos = datos || null; this.codigo = (datos && datos.codigo) || ''; }
}
function textoErrorHttp(st) {
  if (st === 404) return 'No se encontró el archivo api.php en el servidor. Revisa que se hayan subido todos los archivos del panel.';
  if (st === 403) return 'El servidor rechazó la solicitud (error 403). Si pasa al subir un .zip, pide al hosting revisar ModSecurity para esta carpeta.';
  if (st === 413) return 'El servidor rechazó el envío por tamaño (error 413).';
  if (st === 500) return 'El servidor tuvo un error (500). Revisa el registro de errores de PHP en el cPanel.';
  if (st === 502 || st === 503 || st === 504) return `El servidor no está disponible (error ${st}). Inténtalo en un momento.`;
  return `El servidor respondió con un error (${st}).`;
}
async function api(accion, { datos, query, cuerpo, formulario } = {}) {
  const qs = new URLSearchParams(Object.assign({ accion }, query || {}));
  const init = { method: 'GET', headers: { 'X-Vitrina': '1' }, credentials: 'same-origin', cache: 'no-store' };
  if (datos !== undefined) { init.method = 'POST'; init.headers['Content-Type'] = 'application/json'; init.body = JSON.stringify(datos); }
  else if (cuerpo !== undefined) { init.method = 'POST'; init.headers['Content-Type'] = 'application/octet-stream'; init.body = cuerpo; }
  else if (formulario !== undefined) { init.method = 'POST'; init.body = formulario; }
  let res;
  try { res = await fetch(API + '?' + qs.toString(), init); } catch (e) { throw new ErrorApi('No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.', 0); }
  let j = null;
  try { j = await res.json(); } catch (e) { j = null; }
  if (res.ok && j && typeof j === 'object' && !j.error) return j;
  const msg = (j && j.error) || (res.ok ? 'api.php no respondió como se esperaba. Revisa que el hosting tenga PHP 7.3 o superior.' : textoErrorHttp(res.status));
  const err = new ErrorApi(msg, res.ok ? 500 : res.status, j);
  if (res.status === 401 && accion !== 'entrar') sesionTerminada(msg);
  throw err;
}
/* Las horas del servidor se pasan a la hora de este computador, por si los relojes no coinciden. */
function aLocal(ms) { return ms ? Number(ms) - S.desfase : ms; }
let sondeo = 0, sondeando = false, otraVez = false;
async function conectar() {
  let est;
  try { est = await api('estado'); } catch (e) {
    S.cargando = false;
    if (e.codigo === 'sin_instalar') { S.sinInstalar = true; modoSinDatos(e.message); return; }
    if (e.estado === 0) { S.desconexion = true; pintar(); setTimeout(conectar, 8000); return; }
    modoSinDatos(e.message);
    return;
  }
  S.sinDb = false; S.sinInstalar = false; S.desconexion = false; S.motivo = ''; S.conectado = true;
  S.maxArchivoMb = Number(est.maxArchivoMb) || 50;
  S.desfase = (Number(est.ahora) || Date.now()) - Date.now();
  if (est.usuario) entrarComo(est.usuario);
  else { S.cargando = false; mostrarLogin(); pintar(); }
}
function modoSinDatos(motivo) {
  S.sinDb = true; S.cargando = false; S.conectado = false; S.motivo = motivo || '';
  S.puedeEscribir = false; S.puedeSubir = false;
  ocultarLogin();
  pintar();
}
function entrarComo(u) {
  if (!u || !MI[u.id]) { mostrarLogin('Ese usuario no está en la lista del equipo.'); return; }
  S.yo = u.id; S.esAdmin = !!u.esAdmin;
  S.puedeEscribir = true; S.puedeSubir = true; S.puedeBorrar = S.esAdmin;
  lsSet('vitrina.usuario', u.id);
  ocultarLogin();
  delete $('#tQuien').dataset.tocado;
  if (S.v == null) S.cargando = true;
  pintar();
  refrescar();
  programarSondeo();
}
function aplicarDatos(j) {
  S.v = j.v;
  S.proyectos = new Map((j.proyectos || []).map(p => {
    p.creado = aLocal(p.creado); p.actualizado = aLocal(p.actualizado); p.estadoDesde = aLocal(p.estadoDesde);
    if (p.version) p.version.fecha = aLocal(p.version.fecha);
    return [p.id, p];
  }));
  S.notas = (j.notas || []).map(n => Object.assign(n, { creada: aLocal(n.creada), resueltaEn: aLocal(n.resueltaEn) }));
  S.tiempos = (j.tiempos || []).map(t => Object.assign(t, { creado: aLocal(t.creado), inicio: aLocal(t.inicio), fin: aLocal(t.fin) }));
  S.actividad = (j.actividad || []).map(a => Object.assign(a, { fecha: aLocal(a.fecha) }));
  S.cronos = new Map(Object.entries(j.cronometros || {}).filter(([q]) => MI[q]).map(([q, c]) => [q, { proyectoId: c.proyectoId, inicio: aLocal(c.inicio) }]));
  S.usuarios = new Map((j.usuarios || []).map(u => [u.id, Object.assign(u, { actualizado: aLocal(u.actualizado) })]));
  S.espacio = Number(j.espacio) || 0;
  if (S.abrirPendiente && S.proyectos.has(S.abrirPendiente)) { const id = S.abrirPendiente; S.abrirPendiente = null; irAProyecto(id); }
  if (S.detalle && S.detalle !== '__ejemplo') cargarDetalle(S.detalle);
  if (!$('#mAccesos').hidden) pintarAccesos();
  aplicarRuta();
}
async function refrescar() {
  if (!S.yo) return;
  if (sondeando) { otraVez = true; return; }
  sondeando = true;
  try {
    const j = await api('datos', { query: S.v == null ? {} : { v: S.v } });
    if (!S.yo) return;
    S.desfase = (Number(j.ahora) || Date.now()) - Date.now();
    if (j.yo) { S.esAdmin = !!j.yo.esAdmin; S.puedeBorrar = S.esAdmin; }
    const antes = S.desconexion || S.cargando;
    S.desconexion = false; S.cargando = false;
    if (!j.sinCambios) aplicarDatos(j);
    if (!j.sinCambios || antes) pintar();
  } catch (e) {
    if (e.estado !== 401 && !S.desconexion) { S.desconexion = true; S.cargando = false; pintar(); }
  } finally {
    sondeando = false;
    if (otraVez && S.yo) { otraVez = false; refrescar(); }
  }
}
function programarSondeo() {
  clearTimeout(sondeo);
  sondeo = setTimeout(() => { if (S.yo && !document.hidden) refrescar(); if (S.yo) programarSondeo(); }, S.desconexion ? 10000 : 5000);
}
async function guardar(fn) {
  if (S.sinDb) { toast('El panel no está conectado al servidor. Este cambio no se puede guardar.'); return false; }
  if (!S.yo) { mostrarLogin(); return false; }
  try {
    const r = await fn();
    refrescar();
    return r || true;
  } catch (e) {
    if (e && e.estado === 401) return false;
    console.error(e);
    toast(mensajeError(e));
    S.v = null; refrescar();
    return false;
  }
}

/* =====================================================================
   Acciones sobre proyectos
   ===================================================================== */
function cambiarCampo(pid, campos) {
  const p = S.proyectos.get(pid); if (!p) return false;
  const ahora = Date.now();
  if ('estado' in campos && campos.estado !== p.estado) p.estadoDesde = ahora;
  Object.assign(p, campos, { actualizado: ahora });
  pintar();
  return guardar(() => api('actualizarProyecto', { datos: { id: pid, campos } }));
}
function cambiarEstado(pid, estado) {
  const p = S.proyectos.get(pid);
  if (!p || p.estado === estado || !ES[estado]) return;
  return cambiarCampo(pid, { estado });
}
function cambiarEncargado(pid, quien) {
  const p = S.proyectos.get(pid);
  if (!p || (p.encargado || '') === (quien || '')) return;
  return cambiarCampo(pid, { encargado: quien || null });
}
async function iniciarCrono(pid) {
  if (!S.yo) { mostrarLogin(); return; }
  const previo = S.cronos.get(S.yo);
  S.cronos.set(S.yo, { proyectoId: pid, inicio: Date.now() });
  pintar();
  const r = await guardar(() => api('iniciarCrono', { datos: { proyectoId: pid, fecha: previo ? hoyISO(new Date(previo.inicio)) : hoyISO() } }));
  if (r && r.previo && r.previo.minutos >= 1) toast(`Se registraron ${fmtDur(r.previo.minutos)} en ${S.proyectos.get(r.previo.proyectoId)?.nombre || 'el otro proyecto'}.`);
}
async function detenerCrono() {
  const c = S.cronos.get(S.yo); if (!c) return;
  S.cronos.delete(S.yo);
  pintar();
  const r = await guardar(() => api('detenerCrono', { datos: { fecha: hoyISO(new Date(c.inicio)) } }));
  if (!r) return;
  const minutos = Number(r.minutos) || 0;
  if (minutos < 1) toast('El cronómetro corrió menos de un minuto. No se registró tiempo.');
  else if (minutos > 600) toast(`Se guardaron ${fmtDur(minutos)}. Si el cronómetro quedó encendido por olvido, borra el registro y agrégalo a mano.`);
  else toast(`Se registraron ${fmtDur(minutos)} en ${S.proyectos.get(r.proyectoId || c.proyectoId)?.nombre || 'el proyecto'}.`);
}
async function borrarProyecto(pid) {
  const p = S.proyectos.get(pid); if (!p) return;
  const ok = await guardar(() => api('borrarProyecto', { datos: { id: pid } }));
  if (ok) { cerrarDetalle(); toast(`Se eliminó «${p.nombre}».`); }
}

/* =====================================================================
   Subida de archivos al servidor. Cada archivo se identifica por su
   SHA-256: si ya está en el hosting, no se vuelve a subir.
   ===================================================================== */
const K256 = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);
/* SHA-256 en JavaScript, para cuando el panel se abre sin HTTPS (ahí el navegador no ofrece crypto.subtle). */
function sha256js(datos) {
  const n = datos.length, largo = Math.ceil((n + 9) / 64) * 64;
  const m = new Uint8Array(largo);
  m.set(datos); m[n] = 0x80;
  const dv = new DataView(m.buffer);
  dv.setUint32(largo - 8, Math.floor(n / 0x20000000)); dv.setUint32(largo - 4, (n * 8) >>> 0);
  const h = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
  const w = new Uint32Array(64);
  for (let i = 0; i < largo; i += 64) {
    for (let t = 0; t < 16; t++) w[t] = dv.getUint32(i + t * 4);
    for (let t = 16; t < 64; t++) {
      const x = w[t - 15], y = w[t - 2];
      w[t] = (w[t - 16] + (((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3)) + w[t - 7] + (((y >>> 17) | (y << 15)) ^ ((y >>> 19) | (y << 13)) ^ (y >>> 10))) | 0;
    }
    let a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], k = h[7];
    for (let t = 0; t < 64; t++) {
      const t1 = (k + (((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7))) + ((e & f) ^ (~e & g)) + K256[t] + w[t]) | 0;
      const t2 = ((((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10))) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
      k = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    h[0] += a; h[1] += b; h[2] += c; h[3] += d; h[4] += e; h[5] += f; h[6] += g; h[7] += k;
  }
  return Array.from(h, x => x.toString(16).padStart(8, '0')).join('');
}
async function sha256(u8) {
  if (window.isSecureContext && window.crypto && crypto.subtle) {
    try { const r = await crypto.subtle.digest('SHA-256', u8); return Array.from(new Uint8Array(r), b => b.toString(16).padStart(2, '0')).join(''); } catch (e) { /* sigue con la versión en JavaScript */ }
  }
  return sha256js(u8);
}
const PARTE = 1024 * 1024;
const fichaSubida = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
/* Algunos firewalls de hosting (ModSecurity) rechazan cuerpos binarios: entonces se envía como formulario. */
let modoFormulario = false;
async function enviarParte(query, parte) {
  if (!modoFormulario) {
    try { return await api('subirParte', { query, cuerpo: parte }); } catch (e) {
      if (![403, 406, 415, 501].includes(e.estado)) throw e;
      modoFormulario = true;
    }
  }
  const fd = new FormData();
  fd.append('parte', parte, 'parte.bin');
  return api('subirParte', { query, formulario: fd });
}
async function subirUnArchivo(f, alAvanzar, alto) {
  const total = f.bytes.length;
  let tk = fichaSubida(), off = 0, fallos = 0, reinicios = 0;
  for (;;) {
    if (alto()) return;
    const fin = Math.min(total, off + PARTE);
    try {
      const r = await enviarParte({ sha: f.h, off, total, tk }, new Blob([f.bytes.subarray(off, fin)]));
      if (r.listo) { alAvanzar(total); return; }
      const rec = Number(r.recibido);
      if (!(rec > off)) throw new ErrorApi('El servidor no recibió la parte del archivo.', 500);
      off = rec; fallos = 0;
      alAvanzar(off);
    } catch (e) {
      if (e.estado === 409 && reinicios < 2) { reinicios++; off = 0; tk = fichaSubida(); alAvanzar(0); continue; }
      if ([0, 500, 502, 503, 504].includes(e.estado) && fallos < 3) { fallos++; await sleep(700 * fallos); continue; }
      throw e;
    }
  }
}
async function subirVersion(z, alAvanzar, cancelado) {
  const max = S.maxArchivoMb * 1048576;
  const omitidos = z.omitidos.slice(), archivos = [];
  let n = 0;
  for (const f of z.archivos) {
    if (cancelado()) return null;
    n++;
    if (f.s > max) { omitidos.push({ p: f.p, r: `pesa más de ${S.maxArchivoMb} MB` }); continue; }
    if (!f.h) f.h = await sha256(f.bytes);
    archivos.push(f);
    if (n % 25 === 0) { alAvanzar('revisar', n, z.archivos.length); await sleep(0); }
  }
  if (!archivos.length) throw new Error('Ningún archivo del .zip se puede guardar.');
  const unicos = new Map();
  for (const f of archivos) if (!unicos.has(f.h)) unicos.set(f.h, f);
  const shas = [...unicos.keys()], existentes = new Set();
  for (let i = 0; i < shas.length; i += 1000) {
    const r = await api('archivosExistentes', { datos: { shas: shas.slice(i, i + 1000) } });
    (r.existentes || []).forEach(x => existentes.add(x));
  }
  const faltan = [...unicos.values()].filter(f => !existentes.has(f.h));
  const total = faltan.reduce((t, f) => t + f.s, 0);
  const hecho = new Map();
  let fallo = null;
  const alto = () => !!fallo || cancelado();
  alAvanzar('subir', 0, total, faltan.length);
  await pool(faltan, 3, async (f) => {
    if (alto()) return;
    try { await subirUnArchivo(f, (b) => { hecho.set(f.h, b); alAvanzar('subir', [...hecho.values()].reduce((a, x) => a + x, 0), total, faltan.length); }, alto); }
    catch (e) { if (!fallo) fallo = e; }
  }, alto);
  if (cancelado()) return null;
  if (fallo) throw fallo;
  return { archivos: archivos.map(f => ({ p: f.p, sha: f.h, m: f.m, s: f.s })), omitidos, subidos: faltan.length };
}

/* =====================================================================
   Versiones guardadas → archivos para el visor
   ===================================================================== */
const cacheVer = new Map();
function guardarEnCache(mid, valor) {
  cacheVer.delete(mid); cacheVer.set(mid, valor);
  while (cacheVer.size > 4) cacheVer.delete(cacheVer.keys().next().value);
}
async function bajarArchivo(sha) {
  let res;
  try { res = await fetch(API + '?accion=archivo&sha=' + encodeURIComponent(sha), { headers: { 'X-Vitrina': '1' }, credentials: 'same-origin' }); }
  catch (e) { throw new ErrorApi('No hay conexión con el servidor.', 0); }
  if (res.status === 401) { sesionTerminada(); throw new ErrorApi('Tu sesión terminó.', 401); }
  if (!res.ok) throw new ErrorApi('HTTP ' + res.status, res.status);
  return res.blob();
}
function obtenerVersion(mid, alAvanzar) {
  if (cacheVer.has(mid)) { const v = cacheVer.get(mid); guardarEnCache(mid, v); return v; }
  const pr = (async () => {
    const m = await api('version', { query: { id: mid } });
    const lista = m.archivos || [];
    const files = new Map(), faltan = [], porSha = new Map();
    let hechos = 0;
    await pool(lista, 6, async (f) => {
      try {
        if (!porSha.has(f.sha)) porSha.set(f.sha, bajarArchivo(f.sha));
        const blob = await porSha.get(f.sha);
        files.set(f.p, { blob: new Blob([blob], { type: f.m }), m: f.m, s: f.s });
      } catch (e) { faltan.push(f.p); }
      hechos++; if (alAvanzar) alAvanzar(hechos, lista.length);
    });
    if (!files.size) throw new Error('No se pudo descargar ningún archivo de esta versión.');
    return { files, paginas: (m.paginas || []).filter(p => files.has(p)), entrada: m.entrada, manifiesto: m, faltan };
  })();
  guardarEnCache(mid, pr);
  pr.catch(() => cacheVer.delete(mid));
  return pr;
}
let tokenVisor = 0;
async function verVersion(p, mid, pagina, hash) {
  const id = mid || (p.version && p.version.id);
  if (!id) { V.limpiar(); V.vacio(); pintarArchivos(); return; }
  const token = ++tokenVisor;
  V.limpiar(); V.cargando('Descargando los archivos del proyecto…');
  try {
    const ver = await obtenerVersion(id, (h, t) => { if (token === tokenVisor && h % 5 === 0) V.cargando(`Descargando los archivos del proyecto… ${h} de ${t}`); });
    if (token !== tokenVisor || S.detalle !== p.id) return;
    const base = p.paginaInicio && ver.files.has(p.paginaInicio) ? p.paginaInicio : ver.entrada;
    const inicio = pagina && ver.files.has(pagina) ? pagina : base;
    V.cargar({ files: ver.files, paginas: ver.paginas.length ? ver.paginas : [...ver.files.keys()].filter(esHtml), pagina: inicio, hash, clave: p.id, manifiesto: ver.manifiesto, verId: id, raiz: dirDe(base) });
    ver.faltan.slice(0, 20).forEach(x => V.problema('missing', x));
  } catch (e) {
    if (token === tokenVisor) V.error(mensajeError(e));
  }
  pintarArchivos(); pintarVersionesSelect();
}

/* =====================================================================
   Pintar el tablero
   ===================================================================== */
let pendiente = false;
function pintar() {
  if (pendiente) return;
  pendiente = true;
  requestAnimationFrame(() => { pendiente = false; pintarTodo(); });
}
function pintarTodo() {
  pintarCabecera(); pintarBanner(); pintarHero(); pintarResumen(); pintarProyectos(); pintarLateral();
  if (S.detalle && S.detalle !== '__ejemplo') pintarDetalle();
  entradaInicial();
}
function agregados() {
  const minutos = new Map(), pend = new Map();
  for (const t of S.tiempos) minutos.set(t.proyectoId, (minutos.get(t.proyectoId) || 0) + (Number(t.minutos) || 0));
  for (const n of S.notas) if (!n.resuelta) pend.set(n.proyectoId, (pend.get(n.proyectoId) || 0) + 1);
  return { minutos, pend };
}
function cronosDe(pid) { return [...S.cronos].filter(([, c]) => c.proyectoId === pid); }
function infoEntrega(p) {
  if (!p.entrega) return null;
  if (p.estado === 'terminado') return { txt: `Entrega ${fmtDia(p.entrega)}`, cls: '' };
  const d = diasHasta(p.entrega);
  if (d < 0) return { txt: `Vencido hace ${-d} ${d === -1 ? 'día' : 'días'}`, cls: 'late' };
  if (d === 0) return { txt: 'Vence hoy', cls: 'late' };
  if (d === 1) return { txt: 'Vence mañana', cls: 'soon' };
  if (d <= 3) return { txt: `Vence en ${d} días`, cls: 'soon' };
  return { txt: `Entrega ${fmtDia(p.entrega)}`, cls: '' };
}
function pintarCabecera() {
  const y = $('#btnYo');
  y.hidden = !S.yo;
  y.innerHTML = S.yo ? `${av(S.yo)}<span class="nm">${esc(nombre(S.yo))}</span>` : '';
  const cn = $('#conn');
  let estado = ['', 'Conectando…', 'Conectando con el servidor del panel.'];
  if (S.sinInstalar) estado = ['off', 'Sin instalar', 'Abre instalar.php para conectar la base de datos MySQL.'];
  else if (S.sinDb) estado = ['off', 'Sin servidor', S.motivo || 'No se pudo conectar con api.php.'];
  else if (S.desconexion) estado = ['warn', 'Reconectando…', 'El servidor no responde por ahora. Lo que ves puede no estar al día.'];
  else if (S.conectado && S.yo && !S.cargando) estado = ['ok', 'Base de datos conectada', 'Proyectos, notas, horas y archivos se guardan en la base de datos MySQL del hosting. El panel se actualiza solo cada pocos segundos.'];
  cn.className = 'conn ' + estado[0]; cn.querySelector('.t').textContent = estado[1]; cn.title = estado[2]; cn.setAttribute('aria-label', estado[1]);
  const run = $('#topRun');
  const c = S.yo && S.cronos.get(S.yo);
  if (c) {
    const p = S.proyectos.get(c.proyectoId);
    run.hidden = false;
    run.innerHTML = `<span class="clock" data-desde="${Number(c.inicio)}">${fmtReloj(Date.now() - c.inicio)}</span><button type="button" class="linklike" data-abrir="${esc(c.proyectoId)}">${esc(p ? p.nombre : 'Proyecto')}</button><button type="button" class="btn btn-sm btn-ghost" data-accion="detener" title="Detener y guardar el tiempo">${ic('stop')}Detener</button>`;
  } else run.hidden = true;
}
function pintarBanner() {
  let txt = '';
  if (S.sinInstalar) txt = 'El panel aún no está instalado. Abre instalar.php en esta misma carpeta para conectar la base de datos MySQL. Mientras tanto puedes probar un .zip, pero no se guardará.';
  else if (S.sinDb) txt = (S.motivo || 'No se pudo conectar con el servidor del panel.') + ' Puedes probar un .zip, pero no se guardará.';
  else if (S.desconexion) txt = 'No hay conexión con el servidor. Lo que ves puede no estar al día. El panel reintenta solo.';
  $('#banner').hidden = !txt; $('#bannerTxt').textContent = txt;
}
const ICONO_ESTADO = { pendiente: 'inbox', progreso: 'rayo', revision: 'eye', ajustes: 'sliders', terminado: 'check' };
function entradasSemana(estado) {
  const desde = Date.now() - 7 * 86400000;
  return S.actividad.filter(a => a.tipo === 'estado' && a.a === estado && (a.fecha || 0) >= desde && S.proyectos.has(a.proyectoId)).length;
}
function pintarResumen() {
  const base = [...S.proyectos.values()].filter(p => !S.filtro.quien || p.encargado === S.filtro.quien);
  const total = base.length;
  const esperando = S.cargando && !S.sinDb && !S.proyectos.size;
  morph($('#estados'), esperando ? ESTADOS.map((e, i) => `<div class="kpi-skel" data-k="kpi-ph-${i}" aria-hidden="true"></div>`).join('') : ESTADOS.map(e => {
    const n = base.filter(p => (p.estado || 'pendiente') === e.id).length;
    const pct = total ? Math.round(n / total * 100) : 0;
    const sem = entradasSemana(e.id);
    return `<button type="button" class="kpi st-${e.id}" data-k="kpi-${e.id}" data-filtro-estado="${e.id}" aria-pressed="${S.filtro.estado === e.id}" title="Ver solo «${esc(e.nombre)}»">
      <span class="kpi-ic">${ic(ICONO_ESTADO[e.id])}</span>
      <svg class="kpi-ring" viewBox="0 0 36 36" aria-hidden="true"><circle class="pista" cx="18" cy="18" r="15.9155" pathLength="100"></circle><circle class="valor" cx="18" cy="18" r="15.9155" pathLength="100" stroke-dasharray="${pct} 100" data-pct="${pct}" opacity="${pct ? 1 : 0}"></circle></svg>
      <span class="kpi-l">${esc(e.nombre)}</span>
      <span class="kpi-n" data-num="${n}">${n}</span>
      ${sem ? `<span class="kpi-d sube">${ic('arriba')}${sem} ${sem === 1 ? 'entró' : 'entraron'} esta semana</span>` : `<span class="kpi-d">${total ? pct + ' % del total' : 'Sin proyectos'}</span>`}
    </button>`;
  }).join(''), { animar: ANIM.listo && tableroVisible() });
  morph($('#filtroQuien'), MIEMBROS.map(m => `<button type="button" data-filtro-quien="${m.id}" aria-pressed="${S.filtro.quien === m.id}" title="Solo proyectos de ${esc(m.nombre)}" aria-label="Solo proyectos de ${esc(m.nombre)}" style="--m:${m.color}">${av(m.id)}</button>`).join(''), { animar: false });
  $$('[data-vista]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.vista === S.vista)));
  moverIndicador($('#segVista'), $('#segVista [aria-pressed="true"]'), ANIM.listo);
}
function saludoHora() { const h = new Date().getHours(); return h < 5 ? 'Buenas noches' : h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches'; }
function listaY(p) { return p.length < 2 ? p.join('') : p.slice(0, -1).join(', ') + ' y ' + p[p.length - 1]; }
/* El saludo resume el tablero con datos reales: revisiones, entregas, notas y lo que lleva cada quien. */
function resumenHero() {
  const activos = [...S.proyectos.values()].filter(p => p.estado !== 'terminado');
  const cuantos = (n, uno, varios) => `<b>${n} ${n === 1 ? uno : varios}</b>`;
  const rev = activos.filter(p => p.estado === 'revision').length, aju = activos.filter(p => p.estado === 'ajustes').length;
  const semana = activos.filter(p => p.entrega && diasHasta(p.entrega) >= 0 && diasHasta(p.entrega) <= 7).length;
  const vencidas = activos.filter(p => p.entrega && diasHasta(p.entrega) < 0).length;
  const notas = S.notas.filter(n => !n.resuelta && S.proyectos.has(n.proyectoId)).length;
  const equipo = [];
  if (rev) equipo.push(`${cuantos(rev, 'proyecto', 'proyectos')} en revisión`);
  if (aju) equipo.push(`${cuantos(aju, 'proyecto', 'proyectos')} en ajustes`);
  if (semana) equipo.push(`${cuantos(semana, 'entrega', 'entregas')} en los próximos 7 días`);
  if (vencidas) equipo.push(cuantos(vencidas, 'entrega vencida', 'entregas vencidas'));
  if (notas) equipo.push(cuantos(notas, 'nota pendiente', 'notas pendientes'));
  let txt = equipo.length ? `Hay ${listaY(equipo)}.` : 'Todo al día: no hay revisiones ni entregas pendientes.';
  const mios = S.yo ? activos.filter(p => p.encargado === S.yo).length : 0;
  if (mios) txt += ` Tú llevas ${cuantos(mios, 'proyecto activo', 'proyectos activos')}.`;
  return txt;
}
function pintarHero() {
  const t = $('#heroT'), s = $('#heroS'), b = $('#btnSubir'), extra = $('#heroExtra'), chip = $('#heroChip');
  let titulo, sub, etiqueta = 'Subir proyecto', ejemplo = false;
  if (S.sinDb) {
    titulo = 'Prueba un proyecto';
    sub = 'Elige un .zip con el HTML de un proyecto y la Vitrina lo abre aquí mismo.';
    etiqueta = 'Probar un .zip'; ejemplo = true;
  } else {
    titulo = `${saludoHora()}${S.yo ? ', ' + esc(nombre(S.yo)) : ''} <span aria-hidden="true">👋</span>`;
    if (S.cargando && !S.proyectos.size) sub = 'Cargando los proyectos del equipo…';
    else if (!S.proyectos.size) { sub = 'Aún no hay proyectos. Sube el .zip de un proyecto HTML: la Vitrina lo abre aquí mismo para que el equipo lo revise, deje notas y lleve el estado, el encargado y las horas.'; etiqueta = 'Subir el primer proyecto'; ejemplo = true; }
    else sub = resumenHero();
  }
  if (t._html !== titulo) { t._html = titulo; t.innerHTML = titulo; }
  if (s._html !== sub) { const habia = s._html != null; s._html = sub; s.innerHTML = sub; if (habia && ANIM.listo && tableroVisible()) MOV.cruce(s); }
  b.hidden = !(S.puedeSubir && S.puedeEscribir) && !S.sinDb;
  b.querySelector('.btn-label').textContent = etiqueta;
  const ej = ejemplo ? '<button type="button" class="btn" data-accion="ejemplo">Ver un proyecto de ejemplo</button>' : '';
  if (extra._html !== ej) { extra._html = ej; extra.innerHTML = ej; }
  const ult = S.proyectos.size ? feedReciente(1)[0] : null;
  chip.hidden = !ult;
  if (ult) {
    const nuevo = chip._k && chip._k !== ult.k;
    chip.innerHTML = `${av(ult.quien, 'av-sm')}<span class="tx">${ult.html} · ${esc(fmtRel(ult.f))}</span>`;
    chip._k = ult.k;
    if (nuevo && ANIM.listo && tableroVisible()) MOV.growIn(chip);
  }
}

function filtrados() {
  const q = S.filtro.q.trim().toLowerCase();
  return [...S.proyectos.values()]
    .filter(p => !S.filtro.quien || p.encargado === S.filtro.quien)
    .filter(p => !q || String(p.nombre || '').toLowerCase().includes(q) || String(p.descripcion || '').toLowerCase().includes(q))
    .sort((a, b) => (b.actualizado || 0) - (a.actualizado || 0));
}
function tarjeta(p, ag) {
  const min = ag.minutos.get(p.id) || 0, est = Number(p.horasEstimadas) || 0;
  const pend = ag.pend.get(p.id) || 0;
  const ent = infoEntrega(p);
  const vivos = cronosDe(p.id);
  const pct = est ? Math.min(100, (min / 60) / est * 100) : 0;
  const prio = p.prioridad && p.prioridad !== 'media' ? `<span class="tag prio-${esc(p.prioridad)}">Prioridad ${esc((PR[p.prioridad] || PR.media).nombre.toLowerCase())}</span>` : '';
  return `<article class="card st-${esc(p.estado || 'pendiente')}" data-k="card-${esc(p.id)}" data-abrir="${esc(p.id)}" ${S.puedeEscribir ? 'draggable="true"' : ''} tabindex="0" aria-label="${esc(p.nombre)}">
    <div class="card-top"><h4 class="card-t">${esc(p.nombre || 'Sin nombre')}</h4>${p.version ? `<span class="ver">v${Number(p.version.n) || 1}</span>` : ''}</div>
    ${p.descripcion ? `<p class="card-d">${esc(p.descripcion)}</p>` : ''}
    <div class="meta"><span>${av(p.encargado, 'av-sm')}${esc(p.encargado ? nombre(p.encargado) : 'Sin encargado')}</span>${ent ? `<span class="tag ${ent.cls}">${esc(ent.txt)}</span>` : ''}${prio}</div>
    ${(min || est) ? `<div class="card-time"><div class="meter${est && min / 60 > est ? ' over' : ''}"><i style="width:${est ? pct : 100}%"></i></div><span>${fmtH(min)}${est ? ' / ' + esc(String(est).replace('.', ',')) + ' h' : ''}</span></div>` : ''}
    ${(pend || vivos.length) ? `<div class="meta">${pend ? `<span>${ic('note')}${pend} ${pend === 1 ? 'nota pendiente' : 'notas pendientes'}</span>` : ''}${vivos.map(([q]) => `<span class="live">${esc(nombre(q))}</span>`).join('')}</div>` : ''}
  </article>`;
}
function htmlTablero(lista, ag) {
  const cols = S.filtro.estado ? ESTADOS.filter(e => e.id === S.filtro.estado) : ESTADOS;
  return `<div class="board-scroll"><div class="board" style="--cols:${cols.length}">${cols.map(e => {
    const items = lista.filter(p => (p.estado || 'pendiente') === e.id);
    const min = items.reduce((t, p) => t + (ag.minutos.get(p.id) || 0), 0);
    return `<section class="col st-${e.id}" data-k="col-${e.id}" aria-label="${esc(e.nombre)}"><header class="col-h"><span class="dot"></span><h3>${esc(e.nombre)}</h3>${min ? `<span class="hrs" title="Horas registradas">${fmtH(min)}</span>` : ''}<span class="count" data-pop>${items.length}</span></header><div class="col-b" data-soltar="${e.id}">${items.map(p => tarjeta(p, ag)).join('') || `<p class="col-empty" data-k="vacio-${e.id}">${S.proyectos.size ? 'Nada aquí' : 'Sin proyectos'}</p>`}</div></section>`;
  }).join('')}</div></div>`;
}
function htmlLista(lista, ag) {
  const filas = lista.filter(p => !S.filtro.estado || (p.estado || 'pendiente') === S.filtro.estado);
  return `<div class="table-wrap"><table><thead><tr><th>Proyecto</th><th>Estado</th><th>Encargado</th><th>Entrega</th><th>Horas</th><th>Notas</th><th>Versión</th><th>Actualizado</th></tr></thead><tbody>${filas.map(p => {
    const ent = infoEntrega(p), min = ag.minutos.get(p.id) || 0, est = Number(p.horasEstimadas) || 0, pend = ag.pend.get(p.id) || 0;
    return `<tr data-k="row-${esc(p.id)}" data-abrir="${esc(p.id)}"><td><span class="t">${esc(p.nombre)}</span></td>
      <td>${S.puedeEscribir ? `<select class="select select-sm" data-estado-de="${esc(p.id)}" aria-label="Estado de ${esc(p.nombre)}">${ESTADOS.map(e => `<option value="${e.id}"${(p.estado || 'pendiente') === e.id ? ' selected' : ''}>${esc(e.nombre)}</option>`).join('')}</select>` : `<span class="pill st-${esc(p.estado || 'pendiente')}"><span class="dot"></span>${esc((ES[p.estado] || ES.pendiente).nombre)}</span>`}</td>
      <td><span class="who">${av(p.encargado, 'av-sm')}${esc(p.encargado ? nombre(p.encargado) : '—')}</span></td>
      <td class="${ent ? ent.cls : ''}">${ent ? esc(ent.txt) : '—'}</td>
      <td class="num">${fmtH(min)}${est ? ' / ' + esc(String(est).replace('.', ',')) + ' h' : ''}</td>
      <td class="num">${pend || '—'}</td>
      <td class="num">${p.version ? 'v' + (Number(p.version.n) || 1) : '—'}</td>
      <td class="muted">${esc(fmtRel(p.actualizado))}</td></tr>`;
  }).join('') || '<tr data-k="row-vacio"><td colspan="8" class="muted">Ningún proyecto coincide con el filtro.</td></tr>'}</tbody></table></div>`;
}
function pintarProyectos() {
  const cont = $('#vistaProyectos');
  if (S.cargando && !S.proyectos.size && !S.sinDb) { if (!cont.querySelector('.skel')) cont.innerHTML = '<div class="skel" aria-label="Cargando proyectos"></div>'; return; }
  const ag = agregados(), lista = filtrados();
  const enLista = S.vista === 'lista' && S.proyectos.size;
  const html = enLista ? htmlLista(lista, ag) : htmlTablero(lista, ag);
  const firma = (enLista ? 'lista' : 'tablero') + '|' + (S.filtro.estado || '');
  const anima = ANIM.listo && tableroVisible();
  const cambio = ANIM.firma && ANIM.firma !== firma;
  ANIM.firma = firma;
  const habiaSkel = !!cont.querySelector('.skel');
  if (habiaSkel) cont.innerHTML = '';
  if (anima && cambio && !habiaSkel) { transicionVista(cont, html); return; }
  morph(cont, html, { animar: anima && !habiaSkel, alEntrar: entrarElemento });
}

function textoActividad(a) {
  const p = S.proyectos.get(a.proyectoId);
  const pn = `<b>${esc(p ? p.nombre : 'un proyecto')}</b>`;
  const quien = esc(nombre(a.usuario));
  switch (a.tipo) {
    case 'creado': return `${quien} creó ${pn}`;
    case 'estado': return `${quien} movió ${pn} a ${esc((ES[a.a] || {}).nombre || a.a)}`;
    case 'encargado': return a.a ? `${quien} asignó ${pn} a ${esc(nombre(a.a))}` : `${quien} quitó el encargado de ${pn}`;
    case 'version': return `${quien} subió la versión v${Number(a.n) || '?'} de ${pn}${a.detalle ? ': «' + esc(String(a.detalle).slice(0, 80)) + '»' : ''}`;
    case 'entrega': return a.a ? `${quien} puso la entrega de ${pn} el ${esc(fmtDia(a.a))}` : `${quien} quitó la fecha de entrega de ${pn}`;
    case 'prioridad': return `${quien} cambió la prioridad de ${pn} a ${esc((PR[a.a] || {}).nombre || a.a)}`;
    default: return `${quien} actualizó ${pn}`;
  }
}
function feedReciente(n) {
  const items = [];
  for (const a of S.actividad) items.push({ k: 'a' + (a.id || (a.fecha + a.tipo + a.usuario)), f: a.fecha, pid: a.proyectoId, quien: a.usuario, html: textoActividad(a) });
  for (const x of S.notas) { const p = S.proyectos.get(x.proyectoId); items.push({ k: 'n' + x.id, f: x.creada, pid: x.proyectoId, quien: x.autor, html: `${esc(nombre(x.autor))} comentó en <b>${esc(p ? p.nombre : 'un proyecto')}</b>: «${esc(String(x.texto || '').slice(0, 70))}${String(x.texto || '').length > 70 ? '…' : ''}»` }); }
  for (const t of S.tiempos) { const p = S.proyectos.get(t.proyectoId); items.push({ k: 't' + t.id, f: t.creado || t.fin || 0, pid: t.proyectoId, quien: t.miembro, html: `${esc(nombre(t.miembro))} registró ${esc(fmtDur(t.minutos))} en <b>${esc(p ? p.nombre : 'un proyecto')}</b>` }); }
  return items.filter(i => S.proyectos.has(i.pid)).sort((a, b) => (b.f || 0) - (a.f || 0)).slice(0, n);
}
function rutaSuave(pts, alto) {
  if (!pts.length) return '';
  const f = (v) => v.toFixed(1), y = (v) => Math.min(alto - 1, Math.max(1, v));
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(y(p1[1] + (p2[1] - p0[1]) / 6))} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(y(p2[1] - (p3[1] - p1[1]) / 6))} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}
function semanaHtml() {
  const lunes = inicioSemanaISO(), hoy = hoyISO();
  const dias = Array.from({ length: 7 }, (_, i) => { const d = aFecha(lunes); d.setDate(d.getDate() + i); return hoyISO(d); });
  const porM = new Map(MIEMBROS.map(m => [m.id, 0])), porDia = dias.map(() => 0);
  for (const t of S.tiempos) {
    if (t.fecha < lunes) continue;
    const v = Number(t.minutos) || 0, i = dias.indexOf(t.fecha);
    if (i >= 0) porDia[i] += v;
    if (porM.has(t.miembro)) porM.set(t.miembro, porM.get(t.miembro) + v);
  }
  const hoyI = Math.max(0, dias.indexOf(hoy));
  for (const [quien, c] of S.cronos) { const v = Math.max(0, (Date.now() - c.inicio) / 60000); if (porM.has(quien)) porM.set(quien, porM.get(quien) + v); porDia[hoyI] += v; }
  const total = [...porM.values()].reduce((a, b) => a + b, 0);
  const max = Math.max(60, ...porM.values());
  let spark = '';
  if (total > 0) {
    const W = 280, H = 44, maxD = Math.max(60, ...porDia);
    const pts = porDia.slice(0, hoyI + 1).map((v, i) => [6 + i * ((W - 12) / 6), H - 5 - (v / maxD) * (H - 12)]);
    if (pts.length === 1) pts.unshift([1, pts[0][1]]);
    const linea = rutaSuave(pts, H), u = pts[pts.length - 1];
    const area = `${linea} L${u[0].toFixed(1)} ${H} L${pts[0][0].toFixed(1)} ${H} Z`;
    spark = `<svg class="spark" data-k="spark" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--st-progreso);stop-opacity:.24"></stop><stop offset="1" style="stop-color:var(--st-progreso);stop-opacity:0"></stop></linearGradient></defs><path class="area" d="${area}"></path><path class="linea" d="${linea}" pathLength="1" stroke-dasharray="1 1"></path></svg>
      <div class="spark-dias" aria-hidden="true">${['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((l, i) => `<span${i === hoyI ? ' class="hoy"' : ''}>${l}</span>`).join('')}</div>`;
  }
  return `<section class="sec week" data-k="sec-semana"><h2><span class="sq" style="--c:var(--st-progreso)">${ic('clock')}</span>Horas de esta semana<span class="tot" data-num="${Math.round(total)}" data-fmt="h">${fmtH(total)}</span></h2>${spark}<div class="week-rows">${MIEMBROS.map(m => {
    const v = porM.get(m.id);
    return `<div class="week-row" data-k="sem-${m.id}" title="${esc(m.nombre)}: ${esc(fmtDur(v))}">${av(m.id, 'av-sm')}<div class="bar" style="--m:${m.color}"><i style="width:${(v / max * 100).toFixed(1)}%"></i></div><span class="v">${fmtH(v)}</span></div>`;
  }).join('')}</div></section>`;
}
function pintarLateral() {
  if (S.cargando && !S.sinDb && !S.proyectos.size) { morph($('#lateral'), '<div class="sec-skel" data-k="lat-ph" aria-hidden="true"></div>', { animar: false }); return; }
  const vivos = [...S.cronos].filter(([, c]) => S.proyectos.has(c.proyectoId));
  const proximas = [...S.proyectos.values()].filter(p => p.entrega && p.estado !== 'terminado' && diasHasta(p.entrega) <= 7).sort((a, b) => a.entrega.localeCompare(b.entrega));
  const feed = feedReciente(8);
  morph($('#lateral'), semanaHtml() + `
    <section class="sec" data-k="sec-vivos"><h2><span class="sq" style="--c:var(--ok)">${ic('rayo')}</span>Trabajando ahora<span class="badge" data-pop>${vivos.length}</span></h2><ul class="plist">${vivos.map(([q, c]) => `<li data-k="vivo-${q}" data-abrir="${esc(c.proyectoId)}">${av(q, 'av-sm')}<span class="tx"><b>${esc(nombre(q))}</b><br><span class="sub">${esc(S.proyectos.get(c.proyectoId).nombre)}</span></span><span class="r" data-desde="${Number(c.inicio)}">${fmtReloj(Date.now() - c.inicio)}</span></li>`).join('') || '<li class="vacio" data-k="vivo-0">Nadie tiene el cronómetro encendido.</li>'}</ul></section>
    <section class="sec" data-k="sec-entregas"><h2><span class="sq" style="--c:var(--st-ajustes)">${ic('calendario')}</span>Entregas próximas<span class="badge" data-pop>${proximas.length}</span></h2><ul class="plist">${proximas.map(p => { const e = infoEntrega(p); return `<li data-k="ent-${esc(p.id)}" data-abrir="${esc(p.id)}">${av(p.encargado, 'av-sm')}<span class="tx"><b>${esc(p.nombre)}</b><br><span class="sub ${e.cls}">${esc(e.txt)}</span></span><span class="pill st-${esc(p.estado || 'pendiente')}"><span class="dot"></span>${esc((ES[p.estado] || ES.pendiente).nombre)}</span></li>`; }).join('') || '<li class="vacio" data-k="ent-0">Nada vence en los próximos 7 días.</li>'}</ul></section>
    <section class="sec" data-k="sec-act"><h2><span class="sq" style="--c:var(--st-revision)">${ic('pulso')}</span>Actividad reciente</h2><ul class="plist">${feed.map(i => `<li data-k="act-${esc(i.k)}" data-abrir="${esc(i.pid)}">${av(i.quien, 'av-sm')}<span class="tx">${i.html}<br><span class="sub">${esc(fmtRel(i.f))}</span></span><span></span></li>`).join('') || '<li class="vacio" data-k="act-0">Aquí aparecen las notas, las horas y los cambios del equipo.</li>'}</ul></section>`, { animar: ANIM.listo && tableroVisible(), alEntrar: (el, i) => MOV.blurInSm(el, i * CASCADA.items) });
}

/* =====================================================================
   Detalle de un proyecto
   ===================================================================== */
function rutaActual() { const m = /^#proyecto-([A-Za-z0-9]+)$/.exec(location.hash); return m ? m[1] : null; }
function aplicarRuta() {
  const id = rutaActual();
  if (id) { if (S.proyectos.has(id)) abrirDetalle(id); else if (!S.cargando && S.conectado) { location.hash = ''; } return; }
  if (S.detalle && S.detalle !== '__ejemplo') cerrarDetalle(true);
}
function irAProyecto(id) { if (!S.proyectos.has(id)) return; if (location.hash === '#proyecto-' + id) abrirDetalle(id); else location.hash = 'proyecto-' + id; }
async function cargarDetalle(pid) {
  const token = ++S.detToken;
  try {
    const j = await api('detalle', { query: { id: pid } });
    if (token !== S.detToken || S.detalle !== pid) return;
    S.detVersiones = (j.versiones || []).map(v => Object.assign(v, { fecha: aLocal(v.fecha) }));
    S.detActividad = (j.actividad || []).map(a => Object.assign(a, { fecha: aLocal(a.fecha) }));
    pintarHistorial(); pintarVersionesSelect(); pintarDetalles(); pintarNotas(); pintarDetalleContexto();
  } catch (e) { /* se vuelve a intentar con el próximo cambio */ }
}
function abrirDetalle(id) {
  if (S.detalle === id) return;
  const el = $('#detalle');
  const desdeTablero = tableroVisible();
  S.detalle = id; S.ultimaVersionVista = null;
  cancelarCierreDetalle();
  ['#nLista', '#tLista', '#hVersiones', '#hActividad'].forEach(x => { $(x).innerHTML = ''; });
  el.hidden = false; el.classList.remove('demo');
  document.body.classList.add('con-detalle');
  $('#nTexto').value = '';
  S.detVersiones = []; S.detActividad = [];
  cargarDetalle(id);
  pintarDetalle(true);
  const p = S.proyectos.get(id);
  S.ultimaVersionVista = p.version ? p.version.id : null;
  verVersion(p);
  selTab(S.tab);
  animarAbrirDetalle(desdeTablero);
}
function cerrarDetalle(desdeRuta) {
  S.detToken++;
  S.detalle = null; tokenVisor++;
  document.body.classList.remove('con-detalle');
  if (!desdeRuta && rutaActual()) location.hash = '';
  animarCerrarDetalle(() => { V.limpiar(); const d = $('#detalle'); d.hidden = true; d.classList.remove('expand', 'demo'); });
  volverTablero();
  pintar();
}
function selTab(t) {
  const antes = S.tab, visible = !$('#detalle').hidden;
  S.tab = t;
  $$('.tab').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === t)));
  $$('.tab-panel').forEach(p => { p.hidden = p.id !== 'tp-' + t; });
  const act = $(`.tab[data-tab="${t}"]`);
  moverIndicador($('.tabs'), act, visible);
  if (antes !== t && visible) {
    MOV.cruce(act);
    const viejo = $(`.tab[data-tab="${antes}"]`);
    if (viejo) MOV.cruce(viejo);
    cascada(Array.from($('#tp-' + t).children).filter(x => !x.hidden), MOV.blurInSm, 0, CASCADA.items);
  }
}
function pintarDetalle(inicial) {
  const p = S.proyectos.get(S.detalle);
  if (!p) { if (!S.cargando) { toast('Ese proyecto ya no existe.'); cerrarDetalle(); } return; }
  const n = $('#dNombre'); if (document.activeElement !== n) n.value = p.nombre || '';
  n.readOnly = !S.puedeEscribir;
  const est = $('#dEstado');
  est.innerHTML = ESTADOS.map(e => `<option value="${e.id}">${esc(e.nombre)}</option>`).join(''); est.value = p.estado || 'pendiente'; est.disabled = !S.puedeEscribir;
  $('#dEstadoCtl').className = 'ctl ctl-estado st-' + (p.estado || 'pendiente');
  const enc = $('#dEncargado');
  enc.innerHTML = '<option value="">Sin encargado</option>' + MIEMBROS.map(m => `<option value="${m.id}">${esc(m.nombre)}</option>`).join(''); enc.value = p.encargado || ''; enc.disabled = !S.puedeEscribir;
  $('#dEncAv').outerHTML = av(p.encargado, 'av-sm').replace('class="av', 'id="dEncAv" class="av');
  const ent = infoEntrega(p);
  $('#dEntrega').className = 'd-due ' + (ent ? ent.cls : ''); $('#dEntrega').textContent = ent ? ent.txt : '';
  const vivos = cronosDe(p.id);
  $('#dLive').hidden = !vivos.length; $('#dLive').textContent = vivos.map(([q]) => nombre(q)).join(', ') + (vivos.length ? (vivos.length === 1 ? ' trabajando' : ' trabajando') : '');
  const ag = agregados();
  const pend = ag.pend.get(p.id) || 0;
  ponerTexto($('#nNotas'), String(pend)); ponerTexto($('#nTiempo'), fmtH(ag.minutos.get(p.id) || 0));
  if (!inicial && p.version && p.version.id !== S.ultimaVersionVista) {
    const siguiendo = !V.verId || V.verId === S.ultimaVersionVista;
    S.ultimaVersionVista = p.version.id;
    if (siguiendo) { verVersion(p); if (p.version.por !== S.yo) toast(`${nombre(p.version.por)} subió la versión v${p.version.n}.`); }
  }
  pintarNotas(); pintarTiempo(); pintarDetalles(); pintarHistorial(); pintarVersionesSelect(); pintarDetalleContexto();
  $('#hSubir').hidden = !(S.puedeSubir && S.puedeEscribir);
}
function pintarDetalleContexto() {
  const ver = S.detVersiones.find(v => v.id === V.verId);
  const ok = !!V.files && S.detalle && S.detalle !== '__ejemplo';
  $('#nCtxWrap').hidden = !ok;
  if (ok) $('#nCtxTxt').textContent = `${V.pagina}${ver ? ' · v' + ver.n : ''}`;
}
function pintarVersionesSelect() {
  const sel = $('#vVersion');
  const vs = S.detVersiones;
  sel.hidden = vs.length < 2 || S.detalle === '__ejemplo';
  if (sel.hidden) return;
  const p = S.proyectos.get(S.detalle);
  sel.innerHTML = vs.map(v => `<option value="${esc(v.id)}">v${Number(v.n) || 1}${p && p.version && p.version.id === v.id ? ' (actual)' : ''} · ${esc(fmtFecha(v.fecha))}</option>`).join('');
  if (V.verId) sel.value = V.verId;
}
function pintarNotas() {
  const pid = S.detalle;
  const todas = S.notas.filter(n => n.proyectoId === pid).sort((a, b) => (b.creada || 0) - (a.creada || 0));
  const pend = todas.filter(n => !n.resuelta);
  const lista = S.verResueltas ? todas : pend;
  $('#nTitulo').textContent = S.verResueltas ? `Todas las notas (${todas.length})` : `Pendientes (${pend.length})`;
  $('#nVerResueltas').checked = S.verResueltas;
  $('#nTexto').disabled = !S.puedeEscribir; $('#nGuardar').disabled = !S.puedeEscribir;
  const vers = new Map(S.detVersiones.map(v => [v.id, v]));
  morph($('#nLista'), lista.map(n => {
    const v = n.versionId && vers.get(n.versionId);
    const ctx = n.pagina ? `<button type="button" class="ctx" data-ctx-pagina="${esc(n.pagina)}" data-ctx-version="${esc(n.versionId || '')}" title="Abrir esta página en la vista previa">${esc(n.pagina)}${v ? ' · v' + Number(v.n) : (n.versionN ? ' · v' + Number(n.versionN) : '')}</button>` : '';
    return `<article class="nota${n.autor === S.yo ? ' mia' : ''}${n.resuelta ? ' resuelta' : ''}" data-k="nota-${esc(n.id)}" style="--m:${MI[n.autor] ? MI[n.autor].color : 'var(--muted)'}">
      <div class="nota-h">${av(n.autor, 'av-sm')}<b>${esc(nombre(n.autor))}</b><time title="${esc(fmtFecha(n.creada))}">${esc(fmtRel(n.creada))}</time>${ctx}</div>
      <p class="nota-t">${esc(n.texto)}</p>
      <div class="nota-f"><label class="check"><input type="checkbox" data-resolver="${esc(n.id)}"${n.resuelta ? ' checked' : ''}${S.puedeEscribir ? '' : ' disabled'}> Resuelta${n.resuelta && n.resueltaPor ? ` por ${esc(nombre(n.resueltaPor))}` : ''}</label>${S.puedeEscribir && (n.autor === S.yo || S.esAdmin) ? `<button type="button" class="linklike" data-borrar-nota="${esc(n.id)}">Eliminar</button>` : ''}</div>
    </article>`;
  }).join('') || `<p class="empty-small" data-k="notas-vacio">${todas.length ? 'No hay notas pendientes.' : 'Todavía no hay notas. Revisa la vista previa y deja la primera.'}</p>`, { animar: !$('#detalle').hidden, alEntrar: (el, i) => (el.classList.contains('nota') ? MOV.burbuja(el, i * CASCADA.chat) : MOV.blurInSm(el)) });
}
async function agregarNota() {
  const t = $('#nTexto'); const texto = t.value.trim();
  if (!texto) { t.focus(); return; }
  const pid = S.detalle;
  const ver = S.detVersiones.find(v => v.id === V.verId);
  const datos = { proyectoId: pid, texto: texto.slice(0, 4000) };
  if ($('#nCtx').checked && V.files && !$('#nCtxWrap').hidden) Object.assign(datos, { pagina: V.pagina, versionId: V.verId || null, versionN: ver ? ver.n : null });
  $('#nGuardar').disabled = true;
  const r = await guardar(() => api('crearNota', { datos }));
  $('#nGuardar').disabled = false;
  if (!r) return;
  t.value = '';
  if (r.id && !S.notas.some(n => n.id === r.id)) { S.notas.push(Object.assign({ id: r.id, autor: S.yo, creada: Date.now(), resuelta: false }, datos)); pintar(); }
}
function pintarTiempo() {
  const pid = S.detalle; if (!pid) return;
  const p = S.proyectos.get(pid);
  const mio = S.yo && S.cronos.get(S.yo);
  const otros = cronosDe(pid).filter(([q]) => q !== S.yo);
  let h;
  if (!S.puedeEscribir) h = `<div class="timer"><p>El cronómetro necesita permiso para registrar horas.</p></div>`;
  else if (mio && mio.proyectoId === pid) h = `<div class="timer corriendo"><div class="clock-big" data-desde="${Number(mio.inicio)}">${fmtReloj(Date.now() - mio.inicio)}</div><p>Tu cronómetro corre en este proyecto desde las ${esc(fmtFecha(mio.inicio).split(', ')[1])}.</p><div class="row"><button type="button" class="btn btn-ink" data-accion="detener">${ic('stop')}Detener y guardar</button></div></div>`;
  else if (mio) h = `<div class="timer"><div class="clock-big">00:00:00</div><p>Tu cronómetro corre en «${esc((S.proyectos.get(mio.proyectoId) || {}).nombre || 'otro proyecto')}» (<span data-desde="${Number(mio.inicio)}">${fmtReloj(Date.now() - mio.inicio)}</span>). Si lo pasas aquí, ese tiempo se guarda primero.</p><div class="row"><button type="button" class="btn btn-ink" data-accion="iniciar">${ic('play')}Pasar el cronómetro aquí</button></div></div>`;
  else h = `<div class="timer"><div class="clock-big">00:00:00</div><p>${S.yo ? `Registra el tiempo de <b>${esc(nombre(S.yo))}</b> en este proyecto.` : 'Elige tu usuario para usar el cronómetro.'}</p><div class="row"><button type="button" class="btn btn-ink" data-accion="iniciar">${ic('play')}Iniciar cronómetro</button></div></div>`;
  if (otros.length) h += `<p class="muted" style="margin:0;font-size:12.5px">${otros.map(([q, c]) => `<span class="live">${esc(nombre(q))}</span> trabajando · <span class="mono" data-desde="${Number(c.inicio)}">${fmtReloj(Date.now() - c.inicio)}</span>`).join('<br>')}</p>`;
  $('#tCrono').innerHTML = h;
  const regs = S.tiempos.filter(t => t.proyectoId === pid).sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)) || (b.creado || 0) - (a.creado || 0));
  const total = regs.reduce((s, t) => s + (Number(t.minutos) || 0), 0);
  const est = Number(p.horasEstimadas) || 0;
  const porM = MIEMBROS.map(m => [m, regs.filter(t => t.miembro === m.id).reduce((s, t) => s + (Number(t.minutos) || 0), 0)]).filter(([, v]) => v > 0);
  const maxM = Math.max(1, ...porM.map(([, v]) => v));
  $('#tResumen').innerHTML = `<div class="totals"><div class="stat"><span>Registrado</span><b>${fmtH(total)}</b></div><div class="stat"><span>Estimado</span><b>${est ? esc(String(est).replace('.', ',')) + ' h' : '—'}</b></div></div>
    ${est ? `<div class="meter${total / 60 > est ? ' over' : ''}" style="margin-top:10px" title="${Math.round(total / 60 / est * 100)}% de lo estimado"><i style="width:${Math.min(100, total / 60 / est * 100)}%"></i></div>` : ''}
    ${porM.length ? `<div class="per" style="margin-top:12px">${porM.map(([m, v]) => `<div class="week-row">${av(m.id, 'av-sm')}<div class="bar" style="--m:${m.color}"><i style="width:${(v / maxM * 100).toFixed(1)}%"></i></div><span class="v">${fmtH(v)}</span></div>`).join('')}</div>` : ''}`;
  $('#tCuenta').textContent = regs.length || '';
  morph($('#tLista'), regs.map(t => `<li data-k="t-${esc(t.id)}">${av(t.miembro, 'av-sm')}<span><span>${esc(nombre(t.miembro))} · ${esc(fmtDia(t.fecha))}</span>${t.nota ? `<br><span class="sub">${esc(t.nota)}</span>` : (t.origen === 'cronometro' ? '<br><span class="sub">Cronómetro</span>' : '')}</span><span class="dur">${esc(fmtDur(t.minutos))}</span>${S.puedeEscribir && (t.miembro === S.yo || t.por === S.yo || S.esAdmin) ? `<button type="button" class="x-btn" data-borrar-tiempo="${esc(t.id)}" title="Eliminar registro" aria-label="Eliminar registro">${ic('trash')}</button>` : '<span></span>'}</li>`).join('') || '<li style="display:block;border:0" class="muted" data-k="t-0">Aún no hay horas registradas.</li>', { animar: !$('#detalle').hidden, alEntrar: (el, i) => MOV.fila(el, i * CASCADA.filas) });
  const q = $('#tQuien');
  if (!q.options.length) { q.innerHTML = MIEMBROS.map(m => `<option value="${m.id}">${esc(m.nombre)}</option>`).join(''); }
  if (document.activeElement !== q && S.yo && !q.dataset.tocado) q.value = S.yo;
  const f = $('#tFecha'); if (!f.value) f.value = hoyISO();
  $$('#tForm input, #tForm select, #tForm button').forEach(x => { x.disabled = !S.puedeEscribir; });
}
function pintarDetalles() {
  const p = S.proyectos.get(S.detalle); if (!p) return;
  const setv = (el, v) => { if (document.activeElement !== el) el.value = v; el.disabled = !S.puedeEscribir; };
  const prio = $('#fPrio'); if (!prio.options.length) prio.innerHTML = PRIOS.map(x => `<option value="${x.id}">${esc(x.nombre)}</option>`).join('');
  setv($('#fDesc'), p.descripcion || ''); setv(prio, p.prioridad || 'media'); setv($('#fEntrega'), p.entrega || ''); setv($('#fHoras'), p.horasEstimadas == null ? '' : p.horasEstimadas);
  const ini = $('#fInicio');
  const actual = S.detVersiones.find(v => p.version && v.id === p.version.id);
  const pags = actual ? actual.paginas : (V.paginas || []);
  ini.innerHTML = pags.length ? pags.map(x => `<option value="${esc(x)}">${esc(x)}</option>`).join('') : '<option value="">Sin páginas</option>';
  setv(ini, p.paginaInicio && pags.includes(p.paginaInicio) ? p.paginaInicio : (actual ? actual.entrada : (pags[0] || '')));
  ini.disabled = !S.puedeEscribir || !pags.length;
  $('#fInfo').innerHTML = `<dt>Creado</dt><dd>${esc(nombre(p.creadoPor))} · ${esc(fmtFecha(p.creado))}</dd><dt>Actualizado</dt><dd>${esc(fmtRel(p.actualizado))}</dd>${p.estadoDesde ? `<dt>En este estado</dt><dd>${esc(fmtRel(p.estadoDesde).replace('hace ', 'desde hace '))}</dd>` : ''}${p.version ? `<dt>Versión actual</dt><dd>v${Number(p.version.n)} · ${esc(p.version.nombreZip || '')} · ${Number(p.version.archivos) || 0} archivos · ${esc(fmtBytes(p.version.bytes))}</dd>` : ''}`;
  const bz = $('#fBorrar');
  bz.hidden = !(S.puedeBorrar && S.puedeEscribir);
  if (!bz.hidden && !bz.dataset.confirmando) bz.innerHTML = `<p>Eliminar el proyecto borra sus versiones, archivos, notas y horas.</p><div class="row"><button type="button" class="btn btn-danger btn-sm" data-accion="borrar-pedir">${ic('trash')}Eliminar proyecto</button></div>`;
}
function pintarHistorial() {
  const p = S.proyectos.get(S.detalle); if (!p) return;
  morph($('#hVersiones'), S.detVersiones.map(v => `<li data-k="v-${esc(v.id)}" class="${p.version && p.version.id === v.id ? 'actual' : ''}"><span class="vn">v${Number(v.n) || 1}</span><span><span>${esc(v.nombreZip || 'proyecto.zip')} · ${Number(v.archivos)} archivos · ${esc(fmtBytes(v.bytes))}</span><br><span class="sub">${esc(nombre(v.subidoPor))} · ${esc(fmtFecha(v.fecha))}</span></span><button type="button" class="btn btn-sm${V.verId === v.id ? ' btn-ink' : ''}" data-ver-version="${esc(v.id)}">${V.verId === v.id ? 'Viendo' : 'Ver'}</button></li>`).join('') || '<li style="display:block;border:0" class="muted" data-k="v-0">Este proyecto aún no tiene versiones.</li>', { animar: !$('#detalle').hidden, alEntrar: (el, i) => MOV.blurInSm(el, i * CASCADA.items) });
  morph($('#hActividad'), S.detActividad.map(a => `<li data-k="h-${esc(a.id || (a.fecha + a.tipo + a.usuario))}">${av(a.usuario, 'av-sm')}<span>${textoActividad(a)}<br><span class="sub">${esc(fmtFecha(a.fecha))}</span></span></li>`).join('') || '<li class="muted" style="display:block" data-k="h-0">Sin actividad todavía.</li>', { animar: !$('#detalle').hidden, alEntrar: (el, i) => MOV.blurInSm(el, i * CASCADA.items) });
}
function pintarArchivos() {
  const m = V.manifiesto;
  if (!V.files) { $('#aResumen').textContent = 'No hay archivos cargados.'; $('#aLista').innerHTML = ''; return; }
  const items = [...V.files].map(([p, f]) => ({ p, s: f.s })).sort((a, b) => a.p.localeCompare(b.p));
  const total = items.reduce((s, x) => s + (x.s || 0), 0);
  $('#aResumen').textContent = `${items.length} archivos · ${fmtBytes(total)}${m && m.nombreZip ? ' · ' + m.nombreZip : ''}`;
  let dirAnt = null, h = '';
  for (const it of items) {
    const i = it.p.lastIndexOf('/'), dir = i < 0 ? '' : it.p.slice(0, i + 1), base = i < 0 ? it.p : it.p.slice(i + 1);
    if (dir !== dirAnt) { if (dir) h += `<li class="dir"><span>${esc(dir)}</span><span></span></li>`; dirAnt = dir; }
    h += `<li><span>${esHtml(it.p) ? `<button type="button" class="linklike" data-abrir-pagina="${esc(it.p)}" title="Ver esta página">${esc(base)}</button>` : esc(base)}</span><span class="sz">${esc(fmtBytes(it.s))}</span></li>`;
  }
  if (m && m.omitidos && m.omitidos.length) h += `<li class="dir"><span>No se guardaron</span><span></span></li>` + m.omitidos.map(o => `<li><span>${esc(o.p)}</span><span class="sz">${esc(o.r)}</span></li>`).join('');
  $('#aLista').innerHTML = h;
}

/* =====================================================================
   Proyecto de ejemplo (no se guarda)
   ===================================================================== */
function archivosEjemplo() {
  const svgIcono = (forma, color) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="10" fill="${color}" opacity=".15"/>${forma.replace(/C/g, color)}</svg>`;
  const t = {
    'index.html': `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Estudio Cordillera</title>
<link rel="stylesheet" href="css/estilos.css">
<script src="js/main.js" defer><\/script>
</head>
<body>
<header class="nav"><img src="img/logo.svg" alt="Cordillera" width="132" height="32"><nav><a href="#servicios">Servicios</a><a href="#contacto">Contacto</a><a href="nosotros.html">Nosotros</a></nav><button id="tema" type="button">Cambiar tema</button></header>
<section class="hero"><h1>Sitios que se sienten rápidos</h1><p>Proyecto de ejemplo para la Vitrina: estilos con @import, imágenes, JavaScript diferido, datos JSON, varias páginas y anclas.</p><a class="cta" href="#contacto">Hablemos</a></section>
<section id="servicios"><h2>Servicios</h2><div id="lista" class="grid"></div></section>
<section id="contacto"><h2>Contacto</h2><form id="form"><input name="correo" type="email" placeholder="tu@correo.com" required><button>Enviar</button></form><p id="ok" hidden>¡Gracias! Te escribimos pronto.</p></section>
<footer>© <span id="anio"></span> Estudio Cordillera · <a href="nosotros.html#equipo">Equipo</a></footer>
</body>
</html>`,
    'nosotros.html': `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Nosotros · Estudio Cordillera</title><link rel="stylesheet" href="css/estilos.css"></head>
<body>
<header class="nav"><a href="index.html"><img src="img/logo.svg" alt="Cordillera" width="132" height="32"></a><nav><a href="index.html#servicios">Servicios</a><a href="index.html#contacto">Contacto</a></nav></header>
<section class="hero corto"><h1>Nosotros</h1><p>Un equipo pequeño que diseña y construye sitios web.</p></section>
<section id="equipo"><h2>Equipo</h2><div class="grid"><div class="tarjeta"><h3>Dirección</h3><p>Estrategia y relación con clientes.</p></div><div class="tarjeta"><h3>Desarrollo</h3><p>Maquetación, rendimiento y accesibilidad.</p></div></div></section>
<footer><a href="index.html">Volver al inicio</a></footer>
</body>
</html>`,
    'css/base.css': `*{box-sizing:border-box}body{margin:0}img{max-width:100%;display:block}html{scroll-behavior:smooth}`,
    'css/estilos.css': `@import url("base.css");
:root{--tinta:#1d2733;--acento:#e4572e;--fondo:#fbfaf7}
html[data-tema="oscuro"]{--tinta:#eef1f5;--fondo:#141a22}
body{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:var(--tinta);background:var(--fondo);transition:background .3s}
.nav{display:flex;align-items:center;gap:24px;padding:18px 6vw}
.nav nav{display:flex;gap:18px;margin-left:auto}
.nav a{color:inherit;text-decoration:none;font-weight:600}
.hero{padding:12vh 6vw 16vh;background:url("../img/montanas.svg") bottom center/100% 45% no-repeat,linear-gradient(#ffe8d6,var(--fondo))}
html[data-tema="oscuro"] .hero{background:url("../img/montanas.svg") bottom center/100% 45% no-repeat,linear-gradient(#26303d,var(--fondo))}
.hero.corto{padding:8vh 6vw 12vh}
.hero h1{font-size:clamp(2.2rem,6vw,4.4rem);line-height:1;max-width:12ch;margin:0 0 16px}
.hero p{max-width:46ch;font-size:1.1rem}
.cta{display:inline-block;margin-top:18px;padding:12px 20px;background:var(--acento);color:#fff;border-radius:999px;text-decoration:none;font-weight:700}
section{padding:64px 6vw}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}
.tarjeta{padding:20px;border:1px solid rgba(0,0,0,.08);border-radius:14px;background:rgba(255,255,255,.7)}
html[data-tema="oscuro"] .tarjeta{background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.12)}
form{display:flex;gap:8px;flex-wrap:wrap}
input{padding:12px 14px;border-radius:10px;border:1px solid #c9ced6;min-width:240px}
button{padding:12px 18px;border-radius:10px;border:0;background:var(--tinta);color:var(--fondo);font-weight:700;cursor:pointer}
footer{padding:32px 6vw;opacity:.75}
@media (max-width:640px){.nav nav{display:none}}`,
    'js/main.js': `document.getElementById('anio').textContent = new Date().getFullYear();
var guardado = localStorage.getItem('tema');
if (guardado) document.documentElement.dataset.tema = guardado;
document.getElementById('tema').addEventListener('click', function () {
  var nuevo = document.documentElement.dataset.tema === 'oscuro' ? 'claro' : 'oscuro';
  document.documentElement.dataset.tema = nuevo;
  localStorage.setItem('tema', nuevo);
});
fetch('data/servicios.json').then(function (r) { return r.json(); }).then(function (lista) {
  document.getElementById('lista').innerHTML = lista.map(function (s) {
    return '<article class="tarjeta"><img src="img/' + s.icono + '" alt="" width="40" height="40"><h3>' + s.nombre + '</h3><p>' + s.texto + '</p></article>';
  }).join('');
});
document.getElementById('form').addEventListener('submit', function (e) {
  e.preventDefault();
  document.getElementById('ok').hidden = false;
});`,
    'data/servicios.json': JSON.stringify([
      { nombre: 'Diseño web', texto: 'Sitios claros que guían a cada visitante.', icono: 'icono-1.svg' },
      { nombre: 'Desarrollo', texto: 'HTML, CSS y JavaScript sin peso de más.', icono: 'icono-2.svg' },
      { nombre: 'Mantenimiento', texto: 'Cambios rápidos y medición mes a mes.', icono: 'icono-3.svg' },
    ], null, 2),
    'img/logo.svg': '<svg xmlns="http://www.w3.org/2000/svg" width="132" height="32" viewBox="0 0 132 32"><path d="M2 28 12 10l6 9 6-11 10 20z" fill="#e4572e"/><text x="42" y="22" font-family="system-ui, sans-serif" font-size="15" font-weight="700" fill="#7a8796">Cordillera</text></svg>',
    'img/montanas.svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 300" preserveAspectRatio="none"><path d="M0 300V210l160-90 140 80 170-120 170 130 160-80 180 90 220-110v190z" fill="#f4b393" opacity=".6"/><path d="M0 300v-50l220-80 200 80 180-90 220 100 180-70 200 50v60z" fill="#e4572e" opacity=".35"/></svg>',
    'img/icono-1.svg': svgIcono('<circle cx="20" cy="20" r="9" fill="C"/>', '#e4572e'),
    'img/icono-2.svg': svgIcono('<rect x="11" y="11" width="18" height="18" rx="4" fill="C"/>', '#2f72e4'),
    'img/icono-3.svg': svgIcono('<path d="M20 10l10 18H10z" fill="C"/>', '#1d9460'),
  };
  const files = new Map();
  for (const [p, txt] of Object.entries(t)) { const m = mimeDe(p); const blob = new Blob([txt], { type: m }); files.set(p, { blob, m, s: blob.size }); }
  return files;
}
function abrirVistaSinGuardar(files, paginas, entrada, titulo, clave) {
  if (S.detalle && S.detalle !== '__ejemplo') cerrarDetalle();
  const desdeTablero = tableroVisible();
  S.detalle = '__ejemplo';
  cancelarCierreDetalle();
  const el = $('#detalle'); el.hidden = false; el.classList.add('demo');
  document.body.classList.add('con-detalle');
  $('#dNombre').value = titulo; $('#dNombre').readOnly = true;
  $('#vVersion').hidden = true;
  V.limpiar();
  V.cargar({ files, paginas, pagina: entrada, clave: clave || '__ejemplo', raiz: dirDe(entrada) });
  pintarArchivos();
  animarAbrirDetalle(desdeTablero);
}
function abrirEjemplo() { abrirVistaSinGuardar(archivosEjemplo(), ['index.html', 'nosotros.html'], 'index.html', 'Estudio Cordillera'); }

/* =====================================================================
   Ventana de subida
   ===================================================================== */
const Sub = {
  modo: 'nuevo', pid: null, zip: null, ocupado: false, cancelado: false, foco: null,
  abrir(modo, pid) {
    if (!S.sinDb && !S.yo) { mostrarLogin(); return; }
    this.modo = modo; this.pid = pid || null; this.zip = null; this.ocupado = false; this.cancelado = false;
    this.foco = document.activeElement;
    const nuevo = modo === 'nuevo';
    $('#mSubirT').textContent = S.sinDb ? 'Probar un proyecto' : (nuevo ? 'Subir proyecto' : `Nueva versión · ${(S.proyectos.get(pid) || {}).nombre || ''}`);
    $('#sCampos').hidden = !nuevo || S.sinDb;
    $('#sCambiosWrap').hidden = nuevo;
    $('#sEnviar').textContent = S.sinDb ? 'Ver vista previa' : (nuevo ? 'Crear proyecto' : 'Subir versión');
    $('#sZip').hidden = true; $('#sZip').innerHTML = '';
    $('#sDropT').textContent = 'Arrastra aquí el .zip del proyecto';
    $('#sDropS').textContent = nuevo && !S.sinDb ? 'o haz clic para elegirlo. También puedes crear el proyecto ahora y subir el .zip después.' : 'o haz clic para elegirlo. Debe tener al menos un archivo .html.';
    $('#sArchivo').value = '';
    $('#sNombre').value = ''; $('#sDesc').value = ''; $('#sEntrega').value = ''; $('#sHoras').value = ''; $('#sCambios').value = '';
    $('#sEstado').innerHTML = ESTADOS.map(e => `<option value="${e.id}">${esc(e.nombre)}</option>`).join(''); $('#sEstado').value = 'progreso';
    $('#sPrio').innerHTML = PRIOS.map(x => `<option value="${x.id}">${esc(x.nombre)}</option>`).join(''); $('#sPrio').value = 'media';
    $('#sEncargado').innerHTML = MIEMBROS.map(m => `<label style="--m:${m.color}"><input type="radio" name="sEnc" value="${m.id}"${m.id === S.yo ? ' checked' : ''}>${av(m.id)}${esc(m.nombre)}</label>`).join('');
    this.estado('');
    this.habilitar();
    $('#sEspacio').hidden = S.sinDb;
    $('#sEspacio').textContent = `Los archivos del panel ocupan ${fmtBytes(S.espacio)} en el hosting. Cada archivo del .zip puede pesar hasta ${S.maxArchivoMb} MB.`;
    abrirModal('#mSubir');
    setTimeout(() => (nuevo && !S.sinDb ? $('#sNombre') : $('#sDrop')).focus(), 30);
  },
  cerrar() {
    if (this.ocupado) { this.cancelado = true; this.estado('Cancelando…'); return; }
    cerrarModal('#mSubir'); if (this.foco && this.foco.focus) this.foco.focus();
  },
  estado(html, progreso) {
    $('#sEstadoTxt').innerHTML = (html ? `<span>${html}</span>` : '') + (progreso != null ? `<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(progreso)}"><i style="width:${progreso}%"></i></div>` : '');
  },
  habilitar() {
    const nuevo = this.modo === 'nuevo';
    const puede = !this.ocupado && (S.sinDb ? !!this.zip : (nuevo ? true : !!this.zip));
    $('#sEnviar').disabled = !puede;
    $$('#mSubir input, #mSubir select, #mSubir textarea').forEach(x => { x.disabled = this.ocupado; });
    $('#sCancelar').textContent = this.ocupado ? 'Cancelar subida' : 'Cancelar';
  },
  async elegir(file) {
    if (!file || this.ocupado) return;
    if (!/\.zip$/i.test(file.name) && !/zip/.test(file.type)) { this.estado('<span class="late">Elige un archivo .zip.</span>'); return; }
    this.ocupado = true; this.habilitar(); this.zip = null;
    this.estado('Leyendo el .zip…', 5);
    try {
      const z = await prepararZip(file, (h, t) => this.estado(`Leyendo el .zip… ${h} de ${t} archivos`, Math.min(95, h / t * 100)));
      this.zip = z;
      $('#sDropT').textContent = 'Cambiar el .zip';
      $('#sDropS').textContent = file.name;
      $('#sZip').hidden = false;
      $('#sZip').innerHTML = `<div class="zipcard"><div class="zt">${ic('box')}${esc(z.nombreZip)}</div><div class="zs">${z.archivos.length} archivos · ${esc(fmtBytes(z.total))} · ${z.paginas.length} ${z.paginas.length === 1 ? 'página' : 'páginas'}</div>
        <label class="field"><span>Página de inicio</span><select class="select" id="sInicio">${z.paginas.map(p => `<option value="${esc(p)}"${p === z.entrada ? ' selected' : ''}>${esc(p)}</option>`).join('')}</select></label>
        ${z.omitidos.length ? `<ul class="warns">${z.omitidos.slice(0, 8).map(o => `<li>${esc(o.p)}: ${esc(o.r)}</li>`).join('')}${z.omitidos.length > 8 ? `<li>y ${z.omitidos.length - 8} más</li>` : ''}</ul>` : ''}</div>`;
      $('#sInicio').addEventListener('change', (e) => { this.zip.entrada = e.target.value; });
      if (this.modo === 'nuevo' && !$('#sNombre').value.trim()) $('#sNombre').value = z.titulo || file.name.replace(/\.zip$/i, '').replace(/[-_]+/g, ' ');
      this.estado('');
    } catch (e) {
      this.estado(`<span class="late">${esc(mensajeError(e))}</span>`);
    }
    this.ocupado = false; this.habilitar();
  },
  async enviar() {
    if (this.ocupado) return;
    if (S.sinDb) {
      if (!this.zip) return;
      const z = this.zip; cerrarModal('#mSubir');
      abrirVistaSinGuardar(mapaArchivos(z.archivos), z.paginas, z.entrada, z.titulo || z.nombreZip, 'local:' + z.nombreZip);
      return;
    }
    const nuevo = this.modo === 'nuevo';
    const nombreP = $('#sNombre').value.trim();
    if (nuevo && !nombreP) { $('#sNombre').focus(); this.estado('<span class="late">Escribe un nombre para el proyecto.</span>'); return; }
    if (!nuevo && !this.zip) return;
    this.ocupado = true; this.cancelado = false; this.habilitar();
    let pid = nuevo ? null : this.pid;
    const z = this.zip;
    try {
      let res = null;
      if (z) {
        this.estado('Revisando los archivos…', 1);
        res = await subirVersion(z, (fase, a, b, n) => {
          if (fase === 'revisar') this.estado(`Revisando los archivos… ${a} de ${b}`, Math.max(1, Math.min(8, a / b * 8)));
          else if (!b) this.estado('Los archivos ya estaban en el servidor.', 95);
          else this.estado(`Subiendo ${n} ${n === 1 ? 'archivo' : 'archivos'} · ${fmtBytes(a)} de ${fmtBytes(b)}`, 8 + Math.min(87, a / b * 87));
        }, () => this.cancelado);
        if (!res) { this.ocupado = false; this.habilitar(); this.estado('Se canceló la subida.'); return; }
        if (!res.archivos.some(f => esHtml(f.p))) throw new Error('No se pudo guardar ningún archivo .html del proyecto.');
      }
      this.estado('Guardando…', 97);
      if (nuevo) {
        const enc = ($('input[name="sEnc"]:checked') || {}).value || S.yo;
        const horas = parseFloat(String($('#sHoras').value).replace(',', '.'));
        const r = await api('crearProyecto', { datos: {
          nombre: nombreP.slice(0, 120), descripcion: $('#sDesc').value.trim().slice(0, 2000), estado: $('#sEstado').value,
          encargado: MI[enc] ? enc : null, prioridad: $('#sPrio').value, entrega: $('#sEntrega').value || null,
          horasEstimadas: isFinite(horas) && horas > 0 ? horas : null,
        } });
        pid = r.id;
        /* Si algo falla después de aquí, el siguiente intento sube la versión a este proyecto en vez de crear otro. */
        this.modo = 'version'; this.pid = pid;
      }
      let version = null;
      if (res) {
        const entrada = res.archivos.some(f => f.p === z.entrada) ? z.entrada : res.archivos.find(f => esHtml(f.p)).p;
        const paginas = z.paginas.filter(p => res.archivos.some(f => f.p === p));
        const cambios = nuevo ? '' : $('#sCambios').value.trim().slice(0, 600);
        const r = await api('crearVersion', { datos: { proyectoId: pid, entrada, paginas, archivos: res.archivos, omitidos: res.omitidos.slice(0, 60), cambios, nombreZip: z.nombreZip.slice(0, 160) } });
        version = r.version;
        version.fecha = aLocal(version.fecha);
        if (S.detalle === pid) S.ultimaVersionVista = version.id;
        const rutas = new Set(res.archivos.map(f => f.p));
        guardarEnCache(version.id, Promise.resolve({ files: mapaArchivos(z.archivos.filter(f => rutas.has(f.p))), paginas, entrada, manifiesto: { nombreZip: z.nombreZip, omitidos: res.omitidos }, faltan: [] }));
      }
      this.ocupado = false;
      cerrarModal('#mSubir');
      toast(nuevo ? `Se creó «${nombreP}».` : `Se subió la versión v${version ? version.n : ''}.`);
      if (nuevo) S.abrirPendiente = pid;
      await refrescar();
      if (nuevo && S.abrirPendiente === pid && S.proyectos.has(pid)) { S.abrirPendiente = null; irAProyecto(pid); }
      if (!nuevo && version && S.detalle === pid) { const p = S.proyectos.get(pid); if (p) verVersion(Object.assign({}, p, { version })); }
    } catch (e) {
      console.error(e);
      this.ocupado = false; this.habilitar();
      const creado = nuevo && pid;
      if (creado) { $('#mSubirT').textContent = `Nueva versión · ${nombreP}`; $('#sCampos').hidden = true; refrescar(); }
      this.estado(`<span class="late">${esc(mensajeError(e))}${creado ? ' El proyecto ya quedó creado: vuelve a intentarlo para subir sus archivos.' : ''}</span>`);
    }
  },
};

/* =====================================================================
   Ventanas, usuario y eventos
   ===================================================================== */
function abrirModal(sel) {
  const m = $(sel), sh = m.querySelector('.sheet');
  clearTimeout(m._cierre); m._cerrando = false; m.style.pointerEvents = '';
  detener(m); if (sh) detener(sh);
  m.hidden = false; document.body.classList.add('con-modal');
  MOV.fundir(m, 0, 1, 0.2);
  if (sh) MOV.materializar(sh);
}
function cerrarModal(sel) {
  const m = $(sel);
  if (m.hidden || m._cerrando) return;
  const sh = m.querySelector('.sheet');
  const fin = () => {
    if (!m._cerrando) return;
    m._cerrando = false; m.hidden = true; m.style.pointerEvents = '';
    detener(m); if (sh) detener(sh);
    if ($$('.modal').every(x => x.hidden)) document.body.classList.remove('con-modal');
  };
  m._cerrando = true; m.style.pointerEvents = 'none';
  if (sh) MOV.desmaterializar(sh, null, true);
  MOV.fundir(m, 1, 0, 0.2, 0.02, fin);
  m._cierre = setTimeout(fin, 600);
}
/* Popovers (menú de cuenta, avisos de la vista previa): nacen desde su botón y se van por el mismo camino. */
function abrirPopover(m) {
  clearTimeout(m._cierre); m._cerrando = false; m.style.pointerEvents = '';
  detener(m); m.hidden = false;
  MOV.materializar(m);
}
function cerrarPopover(m) {
  if (!m || m.hidden || m._cerrando) return;
  m._cerrando = true; m.style.pointerEvents = 'none';
  const fin = () => { if (!m._cerrando) return; m._cerrando = false; m.hidden = true; m.style.pointerEvents = ''; detener(m); };
  MOV.desmaterializar(m, fin, true);
  m._cierre = setTimeout(fin, 500);
}
function loginVisible() { const l = $('#login'); return !l.hidden && !l._saliendo; }
function mostrarCapaLogin() {
  const l = $('#login'), era = l.hidden || l._saliendo;
  clearTimeout(l._cierre); l._saliendo = false; l.style.pointerEvents = '';
  detener(l); detener(l.querySelector('.login-card'));
  l.hidden = false; document.body.classList.add('con-login');
  if (era) { const c = l.querySelector('.login-card'); MOV.cardIn(c, 0.05, Array.from(c.children).filter(x => !x.hidden), 0.14, 0.05); }
}
function ocultarCapaLogin() {
  const l = $('#login');
  document.body.classList.remove('con-login');
  if (l.hidden || l._saliendo) return;
  l._saliendo = true; l.style.pointerEvents = 'none';
  const fin = () => { if (!l._saliendo) return; l._saliendo = false; l.hidden = true; l.style.pointerEvents = ''; detener(l); detener(l.querySelector('.login-card')); };
  animar(l.querySelector('.login-card'), { scale: 1, blur: 0 }, { scale: 0.97, blur: 8 }, { dur: 0.35, ease: 'inOut', mantener: true });
  MOV.fundir(l, 1, 0, 0.3, 0.05, fin);
  l._cierre = setTimeout(fin, 800);
  pintar();
}

/* =====================================================================
   Transiciones del tablero (carga inicial, vistas, abrir y cerrar proyecto)
   ===================================================================== */
function tableroVisible() { return !S.detalle && !loginVisible() && !$('#tablero').classList.contains('retirado'); }
const partesTablero = () => [$('#hero'), $('#estados'), $('#principal .toolbar'), $('#vistaProyectos'), $('#lateral')].filter(Boolean);
function entrarElemento(el, i = 0) {
  if (el.classList.contains('card')) { MOV.blurIn(el, i * CASCADA.items); const m = el.querySelector('.meter i'); if (m) MOV.relleno(m, 0.25 + i * CASCADA.items); }
  else if (el.tagName === 'TR') MOV.fila(el, i * CASCADA.filas);
  else if (el.classList.contains('col')) MOV.cardIn(el, i * CASCADA.tarjetas);
  else MOV.blurIn(el, i * CASCADA.items);
}
/* Kanban: columnas cada 65 ms, tarjetas cada 45 ms dentro de su columna; la barra se llena después. Lista: filas cada 40 ms. */
function entradaVista(cont, delay = 0) {
  const cols = $$('.col', cont);
  if (cols.length) {
    cols.forEach((col, i) => {
      const d = delay + i * CASCADA.tarjetas;
      MOV.cardIn(col, d, [col.querySelector('.col-h')], 0.08);
      $$('.col-b > *', col).forEach((card, j) => {
        const dc = d + 0.15 + j * CASCADA.items;
        if (j < 6) MOV.blurIn(card, dc); else MOV.fila(card, dc);
        const m = card.querySelector('.meter i');
        if (m) MOV.relleno(m, dc + 0.25);
      });
    });
    return;
  }
  const tw = $('.table-wrap', cont);
  if (tw) {
    MOV.blurIn(tw, delay);
    $$('tbody tr', tw).slice(0, 12).forEach((tr, i) => MOV.fila(tr, delay + 0.1 + i * CASCADA.filas));
    return;
  }
  Array.from(cont.children).forEach((x, i) => MOV.blurIn(x, delay + i * CASCADA.tarjetas));
}
/* Cambio de vista o de filtro de estado: lo viejo se difumina en su sitio mientras lo nuevo entra en cascada. */
function transicionVista(cont, html) {
  const r = cont.getBoundingClientRect(), capa = $('#capaFantasma');
  if (capa && !reducido() && r.height && r.bottom > 0 && r.top < innerHeight) {
    const g = document.createElement('div');
    g.className = 'fantasma';
    g.setAttribute('aria-hidden', 'true');
    g.innerHTML = cont.innerHTML;
    g.querySelectorAll('[data-k], [id]').forEach(x => { x.removeAttribute('data-k'); x.removeAttribute('id'); });
    Object.assign(g.style, { position: 'fixed', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', margin: '0', pointerEvents: 'none' });
    capa.appendChild(g);
    const sc = cont.querySelector('.board-scroll'), gsc = g.querySelector('.board-scroll');
    if (sc && gsc) gsc.scrollLeft = sc.scrollLeft;
    const partes = Array.from(g.querySelectorAll('.col, .table-wrap'));
    (partes.length ? partes : [g]).forEach((el, i) => MOV.salida(el, i * CASCADA.salida, null, true));
    setTimeout(() => g.remove(), 260 + partes.length * 35 + 120);
  }
  cont.innerHTML = html;
  entradaVista(cont, 0.2);
}
/* Carga inicial (~1,3 s, una vez): panel lateral gelatina → saludo → KPIs que cuentan → barra → tablero en cascada. */
function entradaInicial() {
  if (ANIM.listo || (S.cargando && !S.sinDb) || !tableroVisible()) return;
  ANIM.listo = true;
  ANIM.t0 = performance.now();
  const lat = $('#lateral');
  MOV.gelatina(lat, 0);
  $$('#lateral .sec > h2, #lateral .spark, #lateral .spark-dias, #lateral .week-row, #lateral .plist > li').forEach((el, i) => MOV.blurInSm(el, 0.1 + Math.min(i, 16) * CASCADA.nav));
  const linea = $('#lateral .spark .linea'); if (linea) MOV.dibujo(linea, 0.3);
  $$('#lateral .week-row .bar i').forEach((b, i) => MOV.relleno(b, 0.45 + i * CASCADA.nav));
  const tot = $('#lateral .tot[data-num]'); if (tot) contar(tot, +tot.dataset.num, { desde: 0, delay: 0.3 });
  MOV.cardIn($('#hero'), 0.12, [$('#heroT'), $('#heroS'), $('#hero .hero-acc')], 0.18, CASCADA.interior);
  MOV.riseIn($('#hero .hero-art'), 0.45);
  const brillos = $('#hero .ha-brillos'); if (brillos) MOV.growIn(brillos, 0.97);
  const chip = $('#heroChip'); if (chip && !chip.hidden) MOV.blurInSm(chip, 0.32);
  $$('#estados .kpi').forEach((k, i) => {
    const d = 0.265 + i * CASCADA.tarjetas;
    MOV.cardIn(k, d, ['.kpi-ic', '.kpi-l', '.kpi-n', '.kpi-d'].map(x => k.querySelector(x)).filter(Boolean), 0.13, CASCADA.interior);
    const n = k.querySelector('.kpi-n'); if (n) contar(n, +n.dataset.num, { desde: 0, delay: 0.35 + i * CASCADA.tarjetas });
    const aro = k.querySelector('.kpi-ring .valor'); if (aro && +aro.dataset.pct) MOV.aro(aro, +aro.dataset.pct, d + 0.13 + 4 * CASCADA.interior);
  });
  MOV.blurIn($('#principal .toolbar'), 0.46);
  moverIndicador($('#segVista'), $('#segVista [aria-pressed="true"]'), false);
  entradaVista($('#vistaProyectos'), 0.53);
}
function retirarTablero() {
  clearTimeout(ANIM.retiro);
  const partes = partesTablero();
  partes.forEach((el, i) => MOV.salida(el, i * CASCADA.salida, null, true));
  ANIM.retiro = setTimeout(() => { $('#tablero').classList.add('retirado'); partes.forEach(detener); }, 450);
}
function volverTablero() {
  clearTimeout(ANIM.retiro);
  const tab = $('#tablero');
  const estaba = tab.classList.contains('retirado') || partesTablero().some(el => { const m = vivas.get(el); return m && Object.keys(m).length; });
  tab.classList.remove('retirado');
  if (!ANIM.listo || !estaba) return;
  partesTablero().forEach((el, i) => MOV.vuelta(el, 0.12 + i * CASCADA.tarjetas));
}
/* Abrir proyecto: el tablero se difumina en orden de lectura y el proyecto se materializa encima (se solapan). */
function animarAbrirDetalle(desdeTablero) {
  const det = $('#detalle');
  MOV.fundir(det, 0, 1, 0.25);
  MOV.titulo($('#dNombre'), 0.05);
  cascada($$('#detalle .d-head > :not(#dNombre)').filter(x => !x.hidden && x.offsetParent !== null), MOV.blurInSm, 0.08, 0.04);
  MOV.cardIn($('#detalle .stage'), 0.2, [$('#detalle .v-bar')], 0.1);
  const desk = $('#detalle .desk');
  if (desk && desk.offsetParent !== null) {
    const panel = $('#tp-' + S.tab);
    MOV.cardIn(desk, 0.27, [$('#detalle .tabs')].concat(panel ? Array.from(panel.children).filter(x => !x.hidden) : []), 0.12, CASCADA.items);
  }
  requestAnimationFrame(() => { moverIndicador($('.tabs'), $('.tab[aria-selected="true"]'), false); moverIndicador($('#vDisp'), $('#vDisp [aria-pressed="true"]'), false); });
  if (desdeTablero) retirarTablero();
}
function animarCerrarDetalle(fin) {
  const det = $('#detalle');
  if (det.hidden) { fin(); return; }
  const partes = [$('#detalle .d-head'), $('#detalle .stage'), $('#detalle .desk')].filter(x => x && x.offsetParent !== null);
  const token = ANIM.cierre = {};
  const cerrar = () => {
    if (ANIM.cierre !== token) return;
    ANIM.cierre = null;
    fin();
    det.style.pointerEvents = '';
    partes.forEach(detener); detener(det);
  };
  det.style.pointerEvents = 'none';
  partes.forEach((el, i) => MOV.salida(el, i * CASCADA.salida, null, true));
  MOV.fundir(det, 1, 0, 0.25, 0.1, cerrar);
  setTimeout(cerrar, 900);
}
function cancelarCierreDetalle() {
  if (!ANIM.cierre) return;
  ANIM.cierre = null;
  const det = $('#detalle');
  det.style.pointerEvents = '';
  detener(det);
  [$('#detalle .d-head'), $('#detalle .stage'), $('#detalle .desk')].forEach(detener);
}
/* =====================================================================
   Inicio de sesión. El servidor guarda las contraseñas cifradas
   (password_hash de PHP) y la sesión viaja en una cookie HttpOnly.
   ===================================================================== */
function normUsuario(t) { return String(t || '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
function mostrarLogin(msg) {
  if (S.sinDb) return;
  $$('.modal').forEach(m => { m.hidden = true; }); document.body.classList.remove('con-modal');
  cerrarMenu();
  mostrarCapaLogin();
  $('#lError').textContent = msg || '';
  const u = $('#lUsuario');
  if (!u.value) u.value = lsGet('vitrina.usuario', '');
  setTimeout(() => (normUsuario(u.value) ? $('#lClave') : u).focus(), 30);
}
function ocultarLogin() { ocultarCapaLogin(); }
function olvidarSesion() {
  S.yo = null; S.esAdmin = false; S.puedeSubir = false; S.puedeBorrar = false; S.v = null;
  clearTimeout(sondeo);
  if (S.detalle) cerrarDetalle();
}
function sesionTerminada(msg) {
  if (!S.yo) return;
  olvidarSesion();
  mostrarLogin(msg || 'Tu sesión terminó. Vuelve a entrar.');
  pintar();
}
async function cerrarSesion() {
  try { await api('salir', { datos: {} }); } catch (e) { /* la sesión se cierra aquí de todos modos */ }
  olvidarSesion();
  mostrarLogin('');
  pintar();
}
async function entrar(e) {
  e.preventDefault();
  const err = $('#lError'), btn = $('#lEntrar');
  const u = normUsuario($('#lUsuario').value), clave = $('#lClave').value;
  if (!u || !clave) { err.textContent = 'Escribe tu usuario y tu contraseña.'; return; }
  btn.disabled = true; btn.textContent = 'Verificando…'; err.textContent = '';
  try {
    const r = await api('entrar', { datos: { usuario: u, clave } });
    $('#lClave').value = '';
    entrarComo(r.usuario);
  } catch (x) {
    err.textContent = x.message || 'No se pudo entrar.';
    $('#lClave').select();
  } finally {
    btn.disabled = false; btn.textContent = 'Entrar';
  }
}
function cerrarMenu() { const m = $('#menuYo'); if (m) cerrarPopover(m); const b = $('#btnYo'); if (b) b.setAttribute('aria-expanded', 'false'); }
function alternarMenu() {
  const m = $('#menuYo');
  if (!m.hidden && !m._cerrando) return cerrarMenu();
  if (!S.yo) return mostrarLogin();
  $('#menuWho').innerHTML = `${av(S.yo)}<span><b>${esc(nombre(S.yo))}</b><br><span class="muted" style="font-size:12px">Usuario: ${esc(S.yo)}${S.esAdmin ? ' · administrador' : ''}</span></span>`;
  $('#menuAccesos').hidden = !S.esAdmin;
  const r = $('#btnYo').getBoundingClientRect();
  m.style.top = Math.round(r.bottom + 6) + 'px';
  m.style.right = Math.max(8, Math.round(document.documentElement.clientWidth - r.right)) + 'px';
  abrirPopover(m); $('#btnYo').setAttribute('aria-expanded', 'true');
  m.querySelector('button').focus();
}
function abrirClave() {
  cerrarMenu();
  $('#fClave').reset(); $('#cUsuario').value = S.yo || ''; $('#cError').textContent = '';
  abrirModal('#mClave');
  setTimeout(() => $('#cActual').focus(), 30);
}
async function cambiarClave(e) {
  e.preventDefault();
  const err = $('#cError'), btn = $('#cGuardar');
  const actual = $('#cActual').value, nueva = $('#cNueva').value, repite = $('#cRepite').value;
  err.textContent = '';
  if (!actual) { err.textContent = 'Escribe tu contraseña actual.'; return; }
  if (nueva.length < 8) { err.textContent = 'La contraseña nueva debe tener al menos 8 caracteres.'; return; }
  if (nueva.length > 72) { err.textContent = 'La contraseña nueva puede tener máximo 72 caracteres.'; return; }
  if (nueva !== repite) { err.textContent = 'Las dos contraseñas nuevas no coinciden.'; return; }
  btn.disabled = true; btn.textContent = 'Guardando…';
  try {
    await api('cambiarClave', { datos: { actual, nueva } });
    cerrarModal('#mClave');
    toast('Tu contraseña cambió. Se cerró tu sesión en los otros navegadores.');
    refrescar();
  } catch (x) {
    if (x.estado !== 401) err.textContent = x.message;
  } finally {
    btn.disabled = false; btn.textContent = 'Guardar contraseña';
  }
}
function abrirAccesos() { cerrarMenu(); $('#accNueva').hidden = true; pintarAccesos(); abrirModal('#mAccesos'); }
function pintarAccesos() {
  $('#accLista').innerHTML = MIEMBROS.map(m => {
    const a = S.usuarios.get(m.id);
    const desde = !a ? 'sin acceso' : (a.actualizado ? 'contraseña del ' + fmtFecha(a.actualizado) : 'con contraseña');
    return `<li>${av(m.id)}<span><b>${esc(m.nombre)}</b>${a && a.esAdmin ? ' <span class="muted" style="font-size:12px">· administrador</span>' : ''}<br><span class="sub">Usuario: ${esc(m.id)} · ${esc(desde)}</span></span><button type="button" class="btn btn-sm" data-restablecer="${m.id}"${a ? '' : ' disabled'}>Restablecer</button></li>`;
  }).join('');
}
async function restablecer(u, boton) {
  if (!MI[u]) return;
  if (boton.dataset.seguro !== '1') { boton.dataset.seguro = '1'; boton.textContent = '¿Seguro?'; boton.classList.add('btn-danger'); return; }
  boton.disabled = true; boton.textContent = 'Creando…';
  let r;
  try { r = await api('restablecerClave', { datos: { usuario: u } }); } catch (x) {
    if (x.estado !== 401) toast(x.message);
    pintarAccesos();
    return;
  }
  refrescar();
  pintarAccesos();
  const box = $('#accNueva'); box.hidden = false;
  box.innerHTML = `<p style="margin:0 0 8px;font-size:13px"><b>Nueva contraseña de ${esc(nombre(u))}</b> (usuario <code>${esc(u)}</code>). No se vuelve a mostrar. Su sesión se cerró en todos los navegadores.</p><div class="secret"><span class="v">${esc(r.clave)}</span><button type="button" class="btn btn-sm" data-copiar="${esc(r.clave)}">${ic('copy')}Copiar</button></div>`;
}
function copiar(texto, el) {
  const ok = () => toast('Copiado.');
  const seleccionar = () => { const v = el && el.closest('.secret') && el.closest('.secret').querySelector('.v'); if (v) { const r = document.createRange(); r.selectNodeContents(v); const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r); } toast('Selecciona el texto y cópialo con Ctrl + C.'); };
  try { navigator.clipboard.writeText(texto).then(ok, seleccionar); } catch (e) { seleccionar(); }
}

function enlazar() {
  $$('[data-ic]').forEach(el => { el.outerHTML = ic(el.dataset.ic); });
  if (vigiaIndicadores) ['#segVista', '.tabs'].forEach(x => vigiaIndicadores.observe($(x)));
  $('#marca').addEventListener('click', (e) => { e.preventDefault(); if (S.detalle) cerrarDetalle(); });
  $('#btnYo').addEventListener('click', (e) => { e.stopPropagation(); alternarMenu(); });
  $('#fLogin').addEventListener('submit', entrar);
  $('#fClave').addEventListener('submit', cambiarClave);
  $('#lVer').addEventListener('click', () => { const i = $('#lClave'), ver = i.type === 'password'; i.type = ver ? 'text' : 'password'; const b = $('#lVer'); b.innerHTML = ic(ver ? 'eyeOff' : 'eye'); b.title = ver ? 'Ocultar la contraseña' : 'Mostrar la contraseña'; b.setAttribute('aria-label', b.title); i.focus(); });
  $('#btnSubir').addEventListener('click', () => Sub.abrir('nuevo'));
  $('#buscar').addEventListener('input', (e) => { S.filtro.q = e.target.value; pintar(); });

  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!$('#menuYo').hidden && !t.closest('#menuYo')) cerrarMenu();
    const acc = t.closest('[data-accion]');
    if (acc) {
      const a = acc.dataset.accion;
      if (a === 'clave') return abrirClave();
      if (a === 'accesos') return abrirAccesos();
      if (a === 'salir') return cerrarSesion();
      if (a === 'subir') return Sub.abrir('nuevo');
      if (a === 'ejemplo') return abrirEjemplo();
      if (a === 'detener') return detenerCrono();
      if (a === 'iniciar') return S.detalle && iniciarCrono(S.detalle);
      if (a === 'subir-version') return S.detalle && S.detalle !== '__ejemplo' && Sub.abrir('version', S.detalle);
      if (a === 'borrar-pedir') { const bz = $('#fBorrar'); bz.dataset.confirmando = '1'; bz.innerHTML = `<p><b>¿Eliminar «${esc((S.proyectos.get(S.detalle) || {}).nombre)}»?</b> Se borran sus versiones, archivos, notas y horas. No se puede deshacer.</p><div class="row"><button type="button" class="btn btn-sm" data-accion="borrar-no">Cancelar</button><button type="button" class="btn btn-sm btn-danger btn-ink" data-accion="borrar-si">Sí, eliminar</button></div>`; return; }
      if (a === 'borrar-no') { delete $('#fBorrar').dataset.confirmando; return pintarDetalles(); }
      if (a === 'borrar-si') { delete $('#fBorrar').dataset.confirmando; return borrarProyecto(S.detalle); }
    }
    const rs = t.closest('[data-restablecer]');
    if (rs) return restablecer(rs.dataset.restablecer, rs);
    const cpy = t.closest('[data-copiar]');
    if (cpy) return copiar(cpy.dataset.copiar, cpy);
    const fe = t.closest('[data-filtro-estado]');
    if (fe) { S.filtro.estado = S.filtro.estado === fe.dataset.filtroEstado ? null : fe.dataset.filtroEstado; return pintar(); }
    const fq = t.closest('[data-filtro-quien]');
    if (fq) { S.filtro.quien = S.filtro.quien === fq.dataset.filtroQuien ? null : fq.dataset.filtroQuien; return pintar(); }
    const vb = t.closest('[data-vista]');
    if (vb) {
      const cambia = S.vista !== vb.dataset.vista;
      if (cambia) {
        /* La píldora responde en el mismo clic; el contenido cambia en el siguiente cuadro. */
        const viejo = $('#segVista [aria-pressed="true"]');
        if (viejo) viejo.setAttribute('aria-pressed', 'false');
        vb.setAttribute('aria-pressed', 'true');
        moverIndicador($('#segVista'), vb, ANIM.listo);
        MOV.cruce(vb); if (viejo) MOV.cruce(viejo);
      }
      S.vista = vb.dataset.vista; lsSet('vitrina.vista', S.vista);
      /* La píldora arranca en este cuadro; el cambio de contenido, más pesado, entra en el siguiente. */
      if (cambia && ANIM.listo && !reducido()) { requestAnimationFrame(() => pintar()); return; }
      return pintar();
    }
    if (t.closest('select, input, label.check')) return;
    const ab = t.closest('[data-abrir]');
    if (ab) return irAProyecto(ab.dataset.abrir);
    const vv = t.closest('[data-ver-version]');
    if (vv) { const p = S.proyectos.get(S.detalle); if (p) { verVersion(p, vv.dataset.verVersion); pintarHistorial(); } return; }
    const cp = t.closest('[data-ctx-pagina]');
    if (cp) {
      const p = S.proyectos.get(S.detalle); const pag = cp.dataset.ctxPagina, vid = cp.dataset.ctxVersion;
      if (p && vid && vid !== V.verId && S.detVersiones.some(v => v.id === vid)) verVersion(p, vid, pag);
      else if (V.files && V.files.has(pag)) V.ir(pag);
      return;
    }
    const ap = t.closest('[data-abrir-pagina]');
    if (ap) { V.ir(ap.dataset.abrirPagina); return; }
    const bn = t.closest('[data-borrar-nota]');
    if (bn) { const id = bn.dataset.borrarNota; S.notas = S.notas.filter(n => n.id !== id); pintar(); return guardar(() => api('borrarNota', { datos: { id } })); }
    const bt = t.closest('[data-borrar-tiempo]');
    if (bt) { const id = bt.dataset.borrarTiempo; S.tiempos = S.tiempos.filter(x => x.id !== id); pintar(); return guardar(() => api('borrarTiempo', { datos: { id } })); }
    const tb = t.closest('.tab');
    if (tb) return selTab(tb.dataset.tab);
    if (t.closest('[data-cerrar]')) { const m = t.closest('.modal'); if (m && m.id === 'mSubir') Sub.cerrar(); else if (m) cerrarModal('#' + m.id); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!$('#menuYo').hidden) { cerrarMenu(); return $('#btnYo').focus(); }
      if (!$('#mSubir').hidden) return Sub.cerrar();
      if (!$('#mClave').hidden) return cerrarModal('#mClave');
      if (!$('#mAccesos').hidden) return cerrarModal('#mAccesos');
      if (!$('#vPop').hidden && !$('#vPop')._cerrando) { cerrarPopover($('#vPop')); return; }
      if ($('#detalle').classList.contains('expand')) { $('#detalle').classList.remove('expand'); V.pintarBarra(); return requestAnimationFrame(() => V.ajustar()); }
    }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.card[data-abrir]')) { e.preventDefault(); irAProyecto(e.target.dataset.abrir); }
    if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey && !(e.target.closest && e.target.closest('input, textarea, select, [contenteditable]')) && tableroVisible() && $$('.modal').every(m => m.hidden)) { e.preventDefault(); $('#buscar').focus(); }
  });
  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t.matches('[data-estado-de]')) return cambiarEstado(t.dataset.estadoDe, t.value);
    if (t.matches('[data-resolver]')) {
      const id = t.dataset.resolver, n = S.notas.find(x => x.id === id);
      if (n) { Object.assign(n, t.checked ? { resuelta: true, resueltaPor: S.yo, resueltaEn: Date.now() } : { resuelta: false, resueltaPor: null, resueltaEn: null }); pintar(); }
      return guardar(() => api('resolverNota', { datos: { id, resuelta: t.checked } }));
    }
  });

  /* Arrastrar tarjetas entre columnas */
  const vista = $('#vistaProyectos');
  vista.addEventListener('dragstart', (e) => { const c = e.target.closest('.card'); if (!c) return; e.dataTransfer.setData('text/plain', c.dataset.abrir); e.dataTransfer.effectAllowed = 'move'; c.classList.add('dragging'); });
  vista.addEventListener('dragend', (e) => { const c = e.target.closest('.card'); if (c) c.classList.remove('dragging'); $$('.col-b.over').forEach(x => x.classList.remove('over')); });
  vista.addEventListener('dragover', (e) => { const z = e.target.closest('[data-soltar]'); if (!z) return; e.preventDefault(); e.dataTransfer.dropEffect = 'move'; $$('.col-b.over').forEach(x => { if (x !== z) x.classList.remove('over'); }); z.classList.add('over'); });
  vista.addEventListener('dragleave', (e) => { const z = e.target.closest('[data-soltar]'); if (z && !z.contains(e.relatedTarget)) z.classList.remove('over'); });
  vista.addEventListener('drop', (e) => { const z = e.target.closest('[data-soltar]'); if (!z) return; e.preventDefault(); z.classList.remove('over'); const id = e.dataTransfer.getData('text/plain'); if (id) cambiarEstado(id, z.dataset.soltar); });

  /* Detalle */
  $('#dVolver').addEventListener('click', () => cerrarDetalle());
  $('#dEstado').addEventListener('change', (e) => cambiarEstado(S.detalle, e.target.value));
  $('#dEncargado').addEventListener('change', (e) => cambiarEncargado(S.detalle, e.target.value));
  $('#dNombre').addEventListener('keydown', (e) => { if (e.key === 'Enter') e.target.blur(); });
  $('#dNombre').addEventListener('change', (e) => { const v = e.target.value.trim(); const p = S.proyectos.get(S.detalle); if (p && v && v !== p.nombre) cambiarCampo(S.detalle, { nombre: v.slice(0, 120) }); else if (p) e.target.value = p.nombre; });
  $('#nGuardar').addEventListener('click', agregarNota);
  $('#nTexto').addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); agregarNota(); } });
  $('#nVerResueltas').addEventListener('change', (e) => { S.verResueltas = e.target.checked; pintarNotas(); });
  $('#tQuien').addEventListener('change', (e) => { e.target.dataset.tocado = '1'; });
  $('#tForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const h = parseFloat(String($('#tHoras').value).replace(',', '.'));
    if (!(h > 0 && h <= 24)) { $('#tHoras').focus(); toast('Escribe las horas trabajadas, entre 0,25 y 24.'); return; }
    const quien = $('#tQuien').value, fecha = $('#tFecha').value || hoyISO();
    const datos = { proyectoId: S.detalle, miembro: MI[quien] ? quien : S.yo, minutos: Math.round(h * 60), fecha, nota: $('#tNota').value.trim().slice(0, 140) };
    const r = await guardar(() => api('crearTiempo', { datos }));
    if (!r) return;
    $('#tHoras').value = ''; $('#tNota').value = '';
    if (r.id && !S.tiempos.some(x => x.id === r.id)) { S.tiempos.push(Object.assign({ id: r.id, origen: 'manual', creado: Date.now(), por: S.yo }, datos)); pintar(); }
  });
  const guardarDesc = () => { const p = S.proyectos.get(S.detalle); const v = $('#fDesc').value.trim().slice(0, 2000); if (p && v !== (p.descripcion || '')) cambiarCampo(S.detalle, { descripcion: v }); };
  $('#fDesc').addEventListener('change', guardarDesc);
  $('#fPrio').addEventListener('change', (e) => cambiarCampo(S.detalle, { prioridad: e.target.value }));
  $('#fEntrega').addEventListener('change', (e) => cambiarCampo(S.detalle, { entrega: e.target.value || null }));
  $('#fHoras').addEventListener('change', (e) => { const h = parseFloat(String(e.target.value).replace(',', '.')); cambiarCampo(S.detalle, { horasEstimadas: isFinite(h) && h > 0 ? h : null }); });
  $('#fInicio').addEventListener('change', (e) => { cambiarCampo(S.detalle, { paginaInicio: e.target.value || null }); if (V.files && V.files.has(e.target.value)) V.ir(e.target.value); });
  $('#vVersion').addEventListener('change', (e) => { const p = S.proyectos.get(S.detalle); if (p) verVersion(p, e.target.value); });
  $('#hSubir').addEventListener('click', () => Sub.abrir('version', S.detalle));

  /* Subida */
  const drop = $('#sDrop'), input = $('#sArchivo');
  input.addEventListener('change', () => Sub.elegir(input.files && input.files[0]));
  drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('over'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('over'));
  drop.addEventListener('drop', (e) => { e.preventDefault(); drop.classList.remove('over'); Sub.elegir(e.dataTransfer.files && e.dataTransfer.files[0]); });
  $('#sEnviar').addEventListener('click', () => Sub.enviar());
  $('#mSubir').addEventListener('click', (e) => { if (e.target === $('#mSubir')) Sub.cerrar(); });
  window.addEventListener('dragover', (e) => { if (e.dataTransfer && [...e.dataTransfer.types].includes('Files')) e.preventDefault(); });
  window.addEventListener('drop', (e) => {
    if (!e.dataTransfer || !e.dataTransfer.files || !e.dataTransfer.files.length || e.target.closest('#sDrop')) return;
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (!/\.zip$/i.test(f.name)) return;
    if (S.detalle && S.detalle !== '__ejemplo') Sub.abrir('version', S.detalle); else Sub.abrir('nuevo');
    if (!$('#mSubir').hidden) Sub.elegir(f);
  });

  window.addEventListener('hashchange', aplicarRuta);
  setInterval(() => { const ahora = Date.now(); $$('[data-desde]').forEach(el => { el.textContent = fmtReloj(ahora - Number(el.dataset.desde)); }); }, 1000);
  setInterval(() => { if (!document.hidden) pintar(); }, 60000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden && S.yo) { refrescar(); programarSondeo(); } });
}

V.init();
enlazar();
pintar();
conectar().catch((e) => { console.error(e); modoSinDatos(mensajeError(e)); });
