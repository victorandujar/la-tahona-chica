import { waUrl } from '../data/empresa';
import { eur, porId, productos } from '../data/productos';
import { estado, fechaLarga, guardarForzado } from './ciclo';
import { guardar, leer, nuevoCodigo, piezasDe, reiniciar, textoLinea, totalDe, type Canal, type Linea, type Pedido } from './store';

const $ = <T extends HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];
const CANAL: Record<Canal, string> = { web: 'Web', whatsapp: 'WhatsApp', instagram: 'Instagram', persona: 'En persona' };

let pedidos = leer();
let ver = 'todos';

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', text = ''): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

function pintaCarta() {
  const e = estado();
  $('[data-entrega]')!.textContent = fechaLarga(e.entrega);
  $('[data-carta-txt]')!.textContent = e.abierta ? 'Carta abierta' : 'Carta cerrada';
  $('[data-punto]')!.style.background = e.abierta ? '#2c6a3e' : '#9a4a1c';
  const b = $<HTMLButtonElement>('[data-conmutar]')!;
  b.textContent = e.abierta ? 'Cerrar la carta' : 'Abrir la carta';
  b.onclick = () => guardarForzado(e.abierta ? 'cerrada' : 'abierta');
  $<HTMLAnchorElement>('[data-avisar]')!.href = waUrl(`¡Hola! Ya está abierta la carta de esta semana. Puedes pedir hasta el viernes a las 19:00 y recoger el ${fechaLarga(e.entrega)} por la mañana.`);
}

function pinta() {
  const vivos = pedidos.filter((p) => p.estado !== 'cancelado');
  const pend = vivos.filter((p) => p.estado === 'confirmado');
  const kpi = (k: string, v: string) => { $(`[data-kpi="${k}"]`)!.textContent = v; };
  kpi('pedidos', String(vivos.length));
  kpi('piezas', String(vivos.reduce((s, p) => s + piezasDe(p.lineas), 0)));
  kpi('cobrar', eur(pend.reduce((s, p) => s + p.total, 0)));
  kpi('pendientes', String(pend.length));

  // Lista de horneado: suma por producto y variante
  const suma = new Map<string, { nombre: string; total: number; detalle: Map<string, number> }>();
  for (const p of vivos) for (const l of p.lineas) {
    const s = suma.get(l.id) ?? { nombre: porId.get(l.id)?.nombre ?? l.id, total: 0, detalle: new Map<string, number>() };
    s.total += l.qty;
    const v = [l.formato === 'molde' ? 'en molde' : '', l.rebanado ? 'rebanado' : ''].filter(Boolean).join(', ');
    if (v) s.detalle.set(v, (s.detalle.get(v) ?? 0) + l.qty);
    suma.set(l.id, s);
  }
  const orden = productos.map((p) => p.id).filter((id) => suma.has(id));
  $('[data-horneado]')!.replaceChildren(...(orden.length ? orden.map((id) => {
    const s = suma.get(id)!;
    const li = el('li', 'flex items-start gap-4 py-3');
    li.append(el('span', 'titol w-10 shrink-0 text-3xl tabular-nums text-trigo', String(s.total)));
    const d = el('div', 'min-w-0');
    d.append(el('p', 'font-semibold leading-snug', s.nombre));
    if (s.detalle.size) d.append(el('p', 'text-sm text-harina/65', [...s.detalle].map(([k, n]) => `${n} ${k}`).join(' · ')));
    li.append(d);
    return li;
  }) : [el('li', 'py-3 text-harina/65', 'Aún no hay pedidos esta semana.')]));

  // Pedidos
  const lista = pedidos.filter((p) => ver === 'todos' ? true : p.estado === ver);
  $('[data-pedidos]')!.replaceChildren(...(lista.length ? lista.map((p) => {
    const li = el('li', `rounded-2xl bg-white p-5 ring-1 ring-crema-2 ${p.estado === 'cancelado' ? 'opacity-55' : ''}`);
    const top = el('div', 'flex flex-wrap items-center gap-x-3 gap-y-1');
    top.append(el('span', 'rounded-md bg-carbon px-2 py-1 font-mono text-sm font-bold tracking-widest text-harina', p.code));
    top.append(el('span', 'text-lg font-semibold', p.nombre));
    top.append(el('span', 'rounded-full bg-crema px-2.5 py-0.5 text-xs font-semibold', CANAL[p.canal]));
    const tag = el('span', `rounded-full px-2.5 py-0.5 text-xs font-bold ${p.estado === 'entregado' ? 'bg-[#dcefe1] text-verde' : p.estado === 'cancelado' ? 'bg-[#fbe9e4] text-[#8a2a12]' : 'bg-[#fdf3d9] text-[#6b4a05]'}`,
      p.estado === 'entregado' ? 'Entregado' : p.estado === 'cancelado' ? 'Cancelado' : 'Por entregar');
    top.append(tag);
    top.append(el('span', 'ml-auto font-mono font-semibold tabular-nums', eur(p.total)));
    li.append(top);
    const ul = el('ul', 'mt-3 space-y-0.5 text-[0.97rem]');
    for (const l of p.lineas) ul.append(el('li', '', textoLinea(l)));
    li.append(ul);
    li.append(el('p', 'mt-2 text-sm text-gris', [p.punto, p.nota ? `Nota: ${p.nota}` : ''].filter(Boolean).join(' · ')));
    const acc = el('div', 'mt-4 flex flex-wrap items-center gap-2');
    const tel = p.telefono.replace(/\D/g, '');
    if (tel && !p.ejemplo) {
      const a = el('a', 'btn btn-line min-h-10 px-4 text-sm', 'WhatsApp');
      a.href = `https://wa.me/${tel.length === 9 ? `34${tel}` : tel}?text=${encodeURIComponent(`Hola, ${p.nombre}. Tu pedido ${p.code} estará listo el lunes por la mañana.`)}`;
      a.target = '_blank'; a.rel = 'noopener';
      acc.append(a);
    } else if (tel) acc.append(el('span', 'text-sm text-gris', p.telefono));
    const boton = (t: string, cls: string, fn: () => void) => { const b = el('button', `btn min-h-10 px-4 text-sm ${cls}`, t); b.type = 'button'; b.addEventListener('click', fn); acc.append(b); };
    if (p.estado === 'confirmado') {
      boton('Marcar entregado', 'btn-carbon', () => cambia(p, 'entregado'));
      boton('Cancelar…', 'btn-line', () => { if (window.confirm(`¿Cancelar el pedido ${p.code} de ${p.nombre}? Sus piezas salen de la lista de horneado.`)) cambia(p, 'cancelado'); });
    } else if (p.estado === 'entregado') boton('Deshacer', 'btn-line', () => cambia(p, 'confirmado'));
    li.append(acc);
    return li;
  }) : [el('li', 'rounded-2xl bg-crema px-5 py-8 text-center text-gris', 'No hay pedidos en esta vista.')]));
}

function cambia(p: Pedido, e: Pedido['estado']) { p.estado = e; guardar(pedidos); pinta(); }

for (const b of $$('[data-ver]')) b.addEventListener('click', () => {
  ver = b.dataset.ver ?? 'todos';
  for (const o of $$('[data-ver]')) o.setAttribute('aria-pressed', String(o === b));
  pinta();
});
$('[data-reiniciar]')?.addEventListener('click', () => { pedidos = reiniciar(); pinta(); });
$('[data-imprimir]')?.addEventListener('click', () => window.print());

/* Pedido manual */
const filas = $('[data-filas]')!;
const tpl = $<HTMLTemplateElement>('[data-fila]')!;
const otraFila = () => filas.append(tpl.content.cloneNode(true));
otraFila();
$('[data-otra]')?.addEventListener('click', otraFila);
const manual = $<HTMLFormElement>('[data-manual]')!;
manual.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const d = new FormData(manual);
  const nombre = String(d.get('nombre') ?? '').trim();
  if (!nombre) { manual.querySelector<HTMLInputElement>('[name=nombre]')?.focus(); return; }
  const lineas: Linea[] = $$('[data-filas] > div').map((f) => ({
    id: $<HTMLSelectElement>('[data-m-prod]', f)?.value ?? '',
    qty: Math.max(1, Math.min(20, Number($<HTMLInputElement>('[data-m-qty]', f)?.value) || 1)),
    rebanado: $<HTMLInputElement>('[data-m-reb]', f)?.checked ?? false,
    formato: '' as const,
  }));
  pedidos.unshift({ code: nuevoCodigo(), nombre, telefono: String(d.get('telefono') ?? '').trim(), punto: String(d.get('punto') ?? ''), nota: '',
    lineas, total: totalDe(lineas), estado: 'confirmado', canal: String(d.get('canal') ?? 'whatsapp') as Canal, creado: new Date().toISOString(), ejemplo: false });
  guardar(pedidos);
  manual.reset();
  filas.replaceChildren();
  otraFila();
  manual.closest('details')?.removeAttribute('open');
  pinta();
});

window.addEventListener('ltc:carta', pintaCarta);
pintaCarta();
pinta();
