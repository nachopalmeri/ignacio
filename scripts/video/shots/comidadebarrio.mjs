// Comida de Barrio: from the neighbourhood map to a filled cart.
const addToCart = (n) => (f) => f.locator('button', { hasText: 'Ver Detalles' }).nth(n).locator('xpath=following-sibling::button[1]');

export default {
  id: 'comidadebarrio',
  out: 'comidadebarrio-demo.mp4',
  url: 'https://comidadebarrio.vercel.app/',
  accent: '#f97316',
  accentInk: '#1c0a00',
  chapters: 5,
  title: {
    kicker: 'Marketplace gastronómico · Web',
    title: 'Comida de Barrio',
    text: 'Restaurantes del barrio en un mapa, con menús, favoritos y carrito de compras.',
    chips: ['HTML', 'CSS', 'JavaScript', 'Leaflet', 'localStorage']
  },
  async run(d) {
    await d.chapter('Buscar por antojo', 'Buscador y categorías de comida típica');
    await d.reveal('input[placeholder*="restaurantes"]', { ms: 1600, align: 0.35 });
    await d.zoom({ x: 60, y: 200, w: 1300, h: 300 }, { max: 1.4 });
    await d.type('input[placeholder*="restaurantes"]', 'empanadas', { delay: 80 });
    await d.click((f) => f.locator('button', { hasText: 'Parrilla' }).first(), { reveal: false, after: 900 });
    await d.unzoom();

    await d.chapter('Restaurantes cerca tuyo', 'Mapa interactivo del barrio');
    await d.reveal('#featured-heading', { ms: 1800, align: 0.9 });
    await d.wait(1600);

    await d.chapter('Destacados y favoritos', 'Puntaje, reseñas y precio de un vistazo');
    await d.reveal('#featured-heading', { ms: 1400, align: 0.1 });
    await d.zoom('#featured-heading', { max: 1, hold: 300 });
    await d.click('button[data-restaurant="Parrilla El Asador"]', { reveal: false, after: 900 });
    await d.click('button[data-restaurant="Pizzería La Nonna"]', { reveal: false, after: 1000 });

    await d.chapter('El menú de cada lugar', 'Platos con foto, descripción y precio');
    await d.click('a[href*="parrilla-asador"]', { reveal: false, after: 400 });
    await d.waitForUrl(/menu\.html/);
    await d.wait(1800);
    await d.click(addToCart(0), { after: 900 });
    await d.click(addToCart(2), { after: 900 });
    await d.click(addToCart(3), { after: 900 });

    await d.chapter('Carrito listo para pedir', 'Todo guardado en el navegador');
    await d.reveal('a[href="/secciones/carrito.html"]', { ms: 1600, align: 0 });
    await d.click('a[href="/secciones/carrito.html"]', { reveal: false, after: 400 });
    await d.waitForUrl(/carrito/);
    await d.wait(2600);
  }
};
