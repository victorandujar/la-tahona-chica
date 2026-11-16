# La Tahona Chica — propuesta de web

Demo de Ammavaroo para La Tahona Chica, micropanadería de masa madre de Paul Puente en Valencia de Alcántara (Cáceres). **No es la web oficial.**

## Por qué

Ya tienen tienda online (latahonachica.com, hecha con Mabisy, una plataforma de tiendas genérica). Funciona, pero no está pensada para cómo vende un microobrador:

- Obliga a registrarse para comprar.
- No muestra si la carta está abierta o cerrada, ni cuánto falta, ni qué lunes se entrega.
- El panadero avisa a mano, por mensaje, de que la carta abre.
- No le da la lista de horneado de la semana.

La propuesta toma como referencia Molla (www.mollapa.com), el microobrador del propio Víctor.

## Dos niveles

| | Web y pedidos por WhatsApp (590 €) | Pack con gestión (990 €) |
|---|---|---|
| Carta con fotos, precios, ingredientes y alérgenos | ✓ | ✓ |
| Estado de la carta en vivo (abierta, cuenta atrás, lunes de entrega) | ✓ | ✓ |
| Pedido sin registro, con código de recogida | por WhatsApp | guardado en el sistema |
| Panel del obrador: lista de horneado, pedidos, entregados, cancelar | — | ✓ |
| Apuntar pedidos de WhatsApp, Instagram o en persona | — | ✓ |
| Abrir y cerrar la carta, y avisar a los clientes | — | ✓ |

En la demo se ven los dos: la web pública en `/` y el panel en `/gestion`.

## Cómo funciona la demo

- **Ciclo semanal** (`src/scripts/ciclo.ts`): carta abierta de miércoles a viernes a las 19:00, entrega el lunes por la mañana, en hora de Madrid. El aviso superior permite ver la carta «abierta» o «cerrada» aunque hoy no toque.
- **Pedido** (`src/scripts/tienda.ts`): se añaden productos (formato hogaza o molde, rebanado), se confirma con nombre y teléfono y sale un código de recogida y un WhatsApp ya escrito.
- **Panel** (`src/pages/gestion.astro`, `src/scripts/gestion.ts`): los pedidos de la demo aparecen junto a seis de ejemplo.
- **Sin servidor:** todo se guarda en el navegador (`localStorage`). No se envía ni se recoge ningún dato real. La versión de 990 € necesita base de datos, contraseña para el panel y emails de confirmación, como en Molla.

## Identidad

- **Logo:** el suyo (rodillo, «Pan artesano», «Masa madre»), vectorizado con potrace desde su PNG.
- **Paleta:** harina, papel de estraza, el gris carbón del logo y un marrón corteza.
- **Tipografía:** Fraunces (titulares) e Inter Tight, autoalojadas.
- **Fotos:** las de producto y galería de su web, hechas por él delante de su horno. No se usan las de portada, que parecen de banco de imágenes. Dos productos no tienen foto y salen con «Foto pendiente».

## Contenido y fuentes

Todo sale de latahonachica.com (noviembre de 2026): los 15 productos con precio, ingredientes y alérgenos, el horario de pedidos, la información importante y el texto de «Nosotros», en primera persona como lo escribe él.

No se muestra la calle (parece su domicilio) ni el NIF.

## Pendiente

- [ ] Confirmar en su Instagram que sigue activo.
- [ ] Puntos de recogida reales (ahora: Valencia de Alcántara y «otro punto»).
- [ ] Fotos de la hogaza de trigo blanco y de la granola de chocolate.
- [ ] Confirmar si el 927 61 76 13 es también su WhatsApp de pedidos.
- [ ] Qué productos admiten formato molde y rebanado.

## Stack

Astro (SSG) · TypeScript estricto · Tailwind 4 · JS mínimo. Modo demo con `PUBLIC_IS_DEMO` (por defecto activo: `noindex`, `robots.txt` cerrado y aviso visible). Lighthouse: rendimiento 92 en la portada y 100 en el panel, accesibilidad 100, buenas prácticas 100.

```bash
npm install
npm run dev
npm run build
```
