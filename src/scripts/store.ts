/**
 * Pedidos de la DEMO: se guardan solo en este navegador (localStorage).
 * En la versión real vivirían en una base de datos, como en el panel de gestión.
 */
import { porId } from '../data/productos';

export interface Linea { id: string; qty: number; rebanado: boolean; formato: 'hogaza' | 'molde' | '' }
export type EstadoPedido = 'confirmado' | 'entregado' | 'cancelado';
export type Canal = 'web' | 'whatsapp' | 'instagram' | 'persona';
export interface Pedido {
  code: string; nombre: string; telefono: string; punto: string; nota: string;
  lineas: Linea[]; total: number; estado: EstadoPedido; canal: Canal; creado: string; ejemplo: boolean;
}

const CLAVE = 'ltc-demo-pedidos';
const ALFABETO = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export const totalDe = (lineas: Linea[]) => lineas.reduce((s, l) => s + (porId.get(l.id)?.precio ?? 0) * l.qty, 0);
export const piezasDe = (lineas: Linea[]) => lineas.reduce((s, l) => s + l.qty, 0);
export const claveLinea = (l: Pick<Linea, 'id' | 'rebanado' | 'formato'>) => `${l.id}|${l.formato}|${l.rebanado ? 1 : 0}`;
export function textoLinea(l: Linea): string {
  const extras = [l.formato === 'molde' ? 'en molde' : '', l.rebanado ? 'rebanado' : ''].filter(Boolean).join(', ');
  return `${l.qty} × ${porId.get(l.id)?.nombre ?? l.id}${extras ? ` (${extras})` : ''}`;
}
export function nuevoCodigo(): string {
  let c = '';
  for (let i = 0; i < 4; i++) c += ALFABETO[Math.floor(Math.random() * ALFABETO.length)] ?? 'X';
  return c;
}

const linea = (id: string, qty: number, rebanado = false, formato: Linea['formato'] = ''): Linea => ({ id, qty, rebanado, formato });
function ejemplos(): Pedido[] {
  const base = (code: string, nombre: string, telefono: string, canal: Canal, lineas: Linea[], estado: EstadoPedido = 'confirmado', nota = ''): Pedido =>
    ({ code, nombre, telefono, punto: 'Valencia de Alcántara', nota, lineas, total: totalDe(lineas), estado, canal, creado: new Date().toISOString(), ejemplo: true });
  return [
    base('K7QM', 'Marta (ejemplo)', '600 000 001', 'web', [linea('semi-integral', 2, true, 'hogaza'), linea('reganas', 1)]),
    base('P3RT', 'Julián (ejemplo)', '600 000 002', 'web', [linea('centeno', 1, true), linea('pizza-blanco', 2)]),
    base('W8HN', 'Carmen (ejemplo)', '600 000 003', 'whatsapp', [linea('trigo-blanco', 1, false, 'molde'), linea('galletas', 1)], 'confirmado', 'Pasa a recoger su hija'),
    base('B5VX', 'Andrés (ejemplo)', '600 000 004', 'web', [linea('pasas-nueces', 1, true), linea('semillas', 1, true), linea('granola-semillas', 1)]),
    base('T2JD', 'Lucía (ejemplo)', '600 000 005', 'instagram', [linea('integral', 2, true, 'hogaza')], 'entregado'),
    base('M9CE', 'Pedro (ejemplo)', '600 000 006', 'persona', [linea('chocolate-avellanas', 1), linea('tortas-anis', 2)]),
  ];
}

export function leer(): Pedido[] {
  try {
    const raw = localStorage.getItem(CLAVE);
    if (raw) return JSON.parse(raw) as Pedido[];
  } catch { /* sin almacenamiento */ }
  const e = ejemplos();
  guardar(e);
  return e;
}
export function guardar(p: Pedido[]) {
  try { localStorage.setItem(CLAVE, JSON.stringify(p)); } catch { /* sin almacenamiento */ }
}
export function anadir(p: Pedido) { const t = leer(); t.unshift(p); guardar(t); }
export function reiniciar(): Pedido[] { const e = ejemplos(); guardar(e); return e; }
