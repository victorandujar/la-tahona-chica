/**
 * Datos publicados por La Tahona Chica en latahonachica.com y en su Instagram.
 * No se muestra la calle (parece un domicilio particular) ni el NIF.
 */
export const empresa = {
  name: 'La Tahona Chica',
  owner: 'Paul Puente Blanco',
  city: 'Valencia de Alcántara',
  region: 'Cáceres',
  postalCode: '10500',
  phone: { display: '927 61 76 13', e164: '+34927617613', wa: '34927617613' },
  email: 'info@latahonachica.com',
  instagram: { handle: '@latahonachica', url: 'https://www.instagram.com/latahonachica/' },
} as const;

export const telUrl = `tel:${empresa.phone.e164}`;
export const waUrl = (text = '') => `https://wa.me/${empresa.phone.wa}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
export const mailUrl = `mailto:${empresa.email}`;

/** Puntos de recogida. El real se elige al hacer el pedido; pendiente de confirmar la lista con el obrador. */
export const puntos = ['Valencia de Alcántara', 'Otro punto de entrega (lo hablamos)'] as const;
