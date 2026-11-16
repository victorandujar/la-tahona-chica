import { empresa, waUrl } from '../data/empresa';
import { eur, porId } from '../data/productos';
import { duracion, estado, fechaLarga } from './ciclo';
import { anadir, claveLinea, nuevoCodigo, piezasDe, textoLinea, totalDe, type Linea, type Pedido } from './store';

const $ = <T extends HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll<T>(s)];
const CESTA = 'ltc-demo-cesta';

let cesta: Linea[] = [];
try { cesta = JSON.parse(sessionStorage.getItem(CESTA) ?? '[]') as Linea[]; } catch { cesta = []; }
const guarda = () => { try { sessionStorage.setItem(CESTA, JSON.stringify(cesta)); } catch { /* nada */ } };

const dlg = $<HTMLDialogElement>('[data-pedido]');
const lineasEl = $('[data-lineas]');
const form = $<HTMLFormElement>('[data-form]');

/* ---------- Estado de la carta ---------- */
function pintaEstado() {
  const e = estado();
  for (const box of $$('[data-estado]')) {
    box.dataset.abierta = String(e.abierta);
    $('[data-titular]', box)!.textContent = e.abierta ? 'La carta está abierta' : 'La carta está cerrada';
    $('[data-frase]', box)!.innerHTML = e.abierta ? 'Pide hasta el <em>viernes a las 19:00.</em>' : 'Abre el <em>miércoles.</em>';
    $('[data-l1]', box)!.textContent = e.forzado === 'auto' ? (e.abierta ? 'Cierra en' : 'Abre en') : e.abierta ? 'Cierra' : 'Abre';
    $('[data-v1]', box)!.textContent = e.forzado === 'auto' ? duracion(e.minutos) : e.abierta ? 'viernes, 19:00' : 'miércoles';
    $('[data-v2]', box)!.textContent = `${fechaLarga(e.entrega)}, por la mañana`;
    $('[data-cta-abierta]', box)!.hidden = !e.abierta;
    $('[data-cta-cerrada]', box)!.hidden = e.abierta;
  }
  const aviso = $('[data-aviso-carta]');
  if (aviso) aviso.textContent = e.abierta
    ? `Carta abierta hasta el viernes a las 19:00. Entrega el ${fechaLarga(e.entrega)} por la mañana.`
    : 'La carta está cerrada. Abre el miércoles y aviso por mensaje a los clientes. Puedes ir mirando.';
  for (const b of $$<HTMLButtonElement>('[data-anadir]')) {
    b.disabled = !e.abierta;
    b.textContent = e.abierta ? 'Añadir al pedido' : 'Carta cerrada';
  }
  const linea = $('[data-entrega-linea]');
  if (linea) linea.textContent = `Entrega: ${fechaLarga(e.entrega)} por la mañana.`;
  return e;
}

/* ---------- Cesta ---------- */
function pinta() {
  const piezas = piezasDe(cesta), total = totalDe(cesta);
  for (const c of $$('[data-cuenta]')) c.textContent = String(piezas);
  const barra = $('[data-barra]');
  if (barra) {
    barra.hidden = piezas === 0;
    $('[data-barra-piezas]', barra)!.textContent = piezas === 1 ? '1 pieza' : `${piezas} piezas`;
    $('[data-barra-total]', barra)!.textContent = eur(total);
  }
  if (!lineasEl || !form) return;
  lineasEl.replaceChildren(...cesta.map((l) => {
    const p = porId.get(l.id);
    const li = document.createElement('li');
    li.className = 'flex items-center gap-3 py-3.5';
    const extras = [l.formato === 'molde' ? 'En molde' : l.formato === 'hogaza' ? 'Hogaza' : '', l.rebanado ? 'Rebanado' : ''].filter(Boolean).join(' · ');
    li.innerHTML = `<div class="min-w-0 flex-1"><p class="font-semibold leading-snug"></p><p class="text-sm text-gris"></p></div>
      <div class="flex shrink-0 items-center rounded-full border border-crema-2">
        <button type="button" data-menos class="grid size-10 place-items-center text-xl" aria-label="Quitar una">−</button>
        <span class="w-6 text-center font-semibold tabular-nums">${l.qty}</span>
        <button type="button" data-mas class="grid size-10 place-items-center text-xl" aria-label="Añadir una">+</button>
      </div>
      <p class="w-[4.6rem] shrink-0 text-right font-mono text-sm font-semibold tabular-nums">${eur((p?.precio ?? 0) * l.qty)}</p>`;
    li.querySelector('p')!.textContent = p?.nombre ?? l.id;
    li.querySelectorAll('p')[1]!.textContent = extras;
    li.querySelector('[data-menos]')!.addEventListener('click', () => cambia(l, -1));
    li.querySelector('[data-mas]')!.addEventListener('click', () => cambia(l, 1));
    return li;
  }));
  const hay = piezas > 0;
  $('[data-vacio]')!.hidden = hay;
  $('[data-total-fila]')!.hidden = !hay;
  $('[data-entrega-linea]')!.hidden = !hay;
  form.hidden = !hay;
  $('[data-total]')!.textContent = eur(total);
}

function cambia(l: Linea, d: number) {
  const k = claveLinea(l);
  const actual = cesta.find((x) => claveLinea(x) === k);
  if (actual) actual.qty = Math.min(12, actual.qty + d);
  else if (d > 0) cesta.push({ ...l, qty: 1 });
  cesta = cesta.filter((x) => x.qty > 0);
  guarda();
  pinta();
}

for (const card of $$('[data-prod]')) {
  $('[data-anadir]', card)?.addEventListener('click', (ev) => {
    const formato = ($<HTMLSelectElement>('[data-formato]', card)?.value ?? '') as Linea['formato'];
    const rebanado = $<HTMLInputElement>('[data-rebanado]', card)?.checked ?? false;
    cambia({ id: card.dataset.prod ?? '', qty: 1, rebanado, formato }, 1);
    const b = ev.currentTarget as HTMLButtonElement;
    b.textContent = 'Añadido ✓';
    window.setTimeout(() => { if (!b.disabled) b.textContent = 'Añadir al pedido'; }, 1200);
  });
}

/* ---------- Filtros ---------- */
for (const f of $$('[data-filtro]')) {
  f.addEventListener('click', () => {
    for (const o of $$('[data-filtro]')) o.setAttribute('aria-pressed', String(o === f));
    for (const card of $$('[data-prod]')) card.hidden = f.dataset.filtro !== 'todo' && card.dataset.cat !== f.dataset.filtro;
  });
}

/* ---------- Diálogo ---------- */
const paso = (n: 'form' | 'ok') => { for (const p of $$('[data-paso]')) p.hidden = p.dataset.paso !== n; };
for (const b of $$('[data-abrir-pedido]')) b.addEventListener('click', () => { paso('form'); pinta(); dlg?.showModal(); });
for (const b of $$('[data-cerrar]')) b.addEventListener('click', () => dlg?.close());
dlg?.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

form?.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const e = pintaEstado();
  const d = new FormData(form);
  const nombre = String(d.get('nombre') ?? '').trim();
  const telefono = String(d.get('telefono') ?? '').trim();
  const err = $('[data-error]')!;
  const falla = !e.abierta ? 'La carta está cerrada ahora mismo. Abre el miércoles.'
    : !nombre ? 'Dime tu nombre para apuntar el pedido.'
    : telefono.replace(/\D/g, '').length < 9 ? 'Necesito un teléfono válido para avisarte.' : '';
  err.hidden = !falla;
  err.textContent = falla;
  if (falla) return;

  const pedido: Pedido = {
    code: nuevoCodigo(), nombre, telefono, punto: String(d.get('punto') ?? ''), nota: String(d.get('nota') ?? '').trim(),
    lineas: cesta.map((l) => ({ ...l })), total: totalDe(cesta), estado: 'confirmado', canal: 'web', creado: new Date().toISOString(), ejemplo: false,
  };
  anadir(pedido);
  const entrega = `${fechaLarga(e.entrega)} por la mañana`;
  $('[data-ok-nombre]')!.textContent = nombre;
  $('[data-ok-codigo]')!.textContent = pedido.code;
  $('[data-ok-total]')!.textContent = eur(pedido.total);
  $('[data-ok-entrega]')!.textContent = `${entrega} · ${pedido.punto}`;
  $('[data-ok-lineas]')!.replaceChildren(...pedido.lineas.map((l) => { const li = document.createElement('li'); li.textContent = textoLinea(l); return li; }));
  const msg = [`Hola, soy ${nombre}. Quiero hacer este pedido en ${empresa.name}:`, ...pedido.lineas.map((l) => `- ${textoLinea(l)}`),
    `Total: ${eur(pedido.total)}`, `Recogida: ${entrega}, en ${pedido.punto}`, pedido.nota ? `Nota: ${pedido.nota}` : '', `Código: ${pedido.code}`].filter(Boolean).join('\n');
  $<HTMLAnchorElement>('[data-ok-wa]')!.href = waUrl(msg);
  cesta = [];
  guarda();
  form.reset();
  pinta();
  paso('ok');
});

window.addEventListener('ltc:carta', pintaEstado);
pintaEstado();
pinta();
window.setInterval(pintaEstado, 60000);
