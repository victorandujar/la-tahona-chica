/** Carta de latahonachica.com (noviembre de 2026): nombres, precios, ingredientes y alérgenos tal como los publican. */
export type Categoria = 'hogazas' | 'especiales' | 'primos' | 'dulce';
export const categorias: { id: Categoria; nombre: string }[] = [
  { id: 'hogazas', nombre: 'Hogazas' },
  { id: 'especiales', nombre: 'Especiales de la semana' },
  { id: 'primos', nombre: 'Primos del pan' },
  { id: 'dulce', nombre: 'Nuestra dulce selección' },
];

export interface Producto {
  id: string;
  nombre: string;
  cat: Categoria;
  /** Precio en céntimos. */
  precio: number;
  ingredientes: string;
  alergenos: string;
  /** Se puede pedir rebanado. */
  rebanado?: true;
  /** Se puede elegir entre hogaza y molde. */
  formatos?: true;
  foto?: string;
}

export const productos: Producto[] = [
  { id: 'trigo-blanco', nombre: 'Hogaza de trigo blanco', cat: 'hogazas', precio: 450, rebanado: true, formatos: true,
    ingredientes: 'Harina de trigo ecológica, agua, harina de trigo integral ecológica, masa madre y sal.', alergenos: 'Gluten.' },
  { id: 'semi-integral', nombre: 'Hogaza semi integral', cat: 'hogazas', precio: 450, rebanado: true, formatos: true, foto: 'semi-integral',
    ingredientes: 'Harina de trigo ecológica, harina de trigo integral ecológica, masa madre de cultivo y sal.', alergenos: 'Gluten.' },
  { id: 'integral', nombre: 'Hogaza 100 % integral', cat: 'hogazas', precio: 450, rebanado: true, formatos: true, foto: 'integral',
    ingredientes: 'Harina de trigo integral eco, agua, masa madre y sal.', alergenos: 'Gluten.' },
  { id: 'centeno', nombre: 'Hogaza de centeno 100 % integral', cat: 'hogazas', precio: 490, rebanado: true, foto: 'centeno',
    ingredientes: 'Harina de centeno integral, agua, masa madre y sal.', alergenos: 'Gluten.' },
  { id: 'semillas', nombre: 'Hogaza de trigo con semillas', cat: 'hogazas', precio: 550, rebanado: true, foto: 'semillas',
    ingredientes: 'Harina de trigo blanco eco, trigo integral eco, agua, mezcla de semillas ecológicas (amapola, sésamo negro, lino, calabaza, girasol), masa madre y sal.', alergenos: 'Gluten y sésamo.' },
  { id: 'pasas-nueces', nombre: 'Hogaza semi integral de pasas y nueces', cat: 'hogazas', precio: 550, rebanado: true, foto: 'pasas-nueces',
    ingredientes: 'Harina de trigo eco 50 % integral, agua, masa madre, pasas sultanas, nueces y sal.', alergenos: 'Gluten y frutos de cáscara.' },
  { id: 'chocolate-avellanas', nombre: 'Hogaza de trigo con chocolate y avellanas (molde)', cat: 'especiales', precio: 550, rebanado: true, foto: 'chocolate-avellanas',
    ingredientes: 'Harina de trigo, harina de trigo integral, agua, masa madre, chocolate 70 %, avellanas, cacao y sal.', alergenos: 'Gluten y frutos de cáscara. Trazas de leche.' },
  { id: 'pizza-blanco', nombre: 'Bases de pizza de trigo blanco (3 uds.)', cat: 'primos', precio: 490, foto: 'pizza-blanco',
    ingredientes: 'Harina de trigo, agua, harina de trigo integral, masa madre de cultivo y sal.', alergenos: 'Gluten.' },
  { id: 'pizza-integral', nombre: 'Bases de pizza de trigo integral (3 uds.)', cat: 'primos', precio: 490, foto: 'pizza-integral',
    ingredientes: 'Trigo integral eco, agua, masa madre y sal.', alergenos: 'Gluten.' },
  { id: 'reganas', nombre: 'Regañas de sésamo', cat: 'primos', precio: 390, foto: 'reganas',
    ingredientes: 'Harina de trigo, agua, huevos, sésamo tostado, aceite de oliva virgen extra y sal.', alergenos: 'Huevo, gluten y sésamo.' },
  { id: 'galletas', nombre: 'Galletas sabor caramelo', cat: 'dulce', precio: 590, foto: 'galletas',
    ingredientes: 'Harina de trigo eco, mantequilla, azúcar, miel, bicarbonato y sal.', alergenos: 'Gluten y lácteos.' },
  { id: 'tortas-anis', nombre: 'Tortas de anís', cat: 'dulce', precio: 390, foto: 'tortas-anis',
    ingredientes: 'Harina de trigo eco, aceite de oliva virgen extra, agua, azúcar, anís, sésamo, sal y levadura.', alergenos: 'Huevo, gluten y sésamo.' },
  { id: 'granola-semillas', nombre: 'Granola de semillas', cat: 'dulce', precio: 450, foto: 'granola-semillas',
    ingredientes: 'Copos de avena, copos de centeno, miel, mezcla de semillas (amapola, girasol, sésamo, lino, calabaza), avellana, aceite de oliva, huevos, coco y sal.', alergenos: 'Huevo, gluten, sésamo y frutos de cáscara. Puede contener trazas de lácteos.' },
  { id: 'granola-chocolate', nombre: 'Granola de chocolate y almendra', cat: 'dulce', precio: 450,
    ingredientes: 'Copos de avena, miel, chocolate 70 %, almendra, aceite de oliva, huevos, cacao, coco y sal.', alergenos: 'Huevo, gluten y frutos de cáscara. Puede contener trazas de lácteos.' },
  { id: 'brownie', nombre: 'Bizcocho brownie de centeno y naranja confitada', cat: 'dulce', precio: 550, foto: 'brownie',
    ingredientes: 'Aceite de oliva virgen extra, azúcar, harina de centeno integral eco, huevos, leche, gotas de chocolate 70 %, cacao puro, impulsor y sal.', alergenos: 'Huevo, gluten y lácteos.' },
];

export const porId = new Map(productos.map((p) => [p.id, p]));
export const eur = (cent: number) => `${(cent / 100).toFixed(2).replace('.', ',')} €`;
