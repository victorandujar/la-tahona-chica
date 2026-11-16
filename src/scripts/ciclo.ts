/**
 * Ciclo semanal del obrador (hora de Madrid):
 * la carta abre el miércoles y cierra el viernes a las 19:00; se entrega el lunes por la mañana.
 */
const ABRE = 2 * 1440; // miércoles 00:00, en minutos desde el lunes 00:00
const CIERRA = 4 * 1440 + 19 * 60; // viernes 19:00
const SEMANA = 7 * 1440;
const DIAS: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
const CLAVE = 'ltc-demo-carta';

export type Forzado = 'abierta' | 'cerrada' | 'auto';
export interface Estado { abierta: boolean; forzado: Forzado; minutos: number; entrega: Date; abreEl: Date }

function minutoSemana(now: Date): number {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now);
  const v = (t: string) => p.find((x) => x.type === t)?.value ?? '0';
  return (DIAS[v('weekday')] ?? 0) * 1440 + Number(v('hour')) * 60 + Number(v('minute'));
}

export function leerForzado(): Forzado {
  try {
    const v = localStorage.getItem(CLAVE);
    return v === 'abierta' || v === 'cerrada' ? v : 'auto';
  } catch { return 'auto'; }
}
export function guardarForzado(v: Forzado) {
  try { v === 'auto' ? localStorage.removeItem(CLAVE) : localStorage.setItem(CLAVE, v); } catch { /* sin almacenamiento */ }
  window.dispatchEvent(new CustomEvent('ltc:carta'));
}

export function estado(now = new Date(), permitirForzado = true): Estado {
  const m = minutoSemana(now);
  const real = m >= ABRE && m < CIERRA;
  const forzado = permitirForzado ? leerForzado() : 'auto';
  const abierta = forzado === 'auto' ? real : forzado === 'abierta';
  // minutos hasta el cierre (si está abierta) o hasta la apertura (si está cerrada)
  const minutos = real ? CIERRA - m : (ABRE - m + SEMANA) % SEMANA;
  // lunes de entrega: el siguiente a este cierre (o al próximo, si ya ha cerrado)
  const diasLunes = m < CIERRA ? 7 - Math.floor(m / 1440) : 14 - Math.floor(m / 1440);
  const entrega = new Date(now.getTime() + diasLunes * 86400000);
  const abreEl = new Date(now.getTime() + (real ? 0 : minutos * 60000));
  return { abierta, forzado, minutos, entrega, abreEl };
}

export const fechaLarga = (d: Date) => new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', weekday: 'long', day: 'numeric', month: 'long' }).format(d);
export function duracion(min: number): string {
  const d = Math.floor(min / 1440), h = Math.floor((min % 1440) / 60), m = min % 60;
  if (d > 0) return `${d} d ${h} h`;
  if (h > 0) return `${h} h ${m} min`;
  return `${m} min`;
}
