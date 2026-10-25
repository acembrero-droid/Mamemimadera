// ──────────────────────────────────────────────────────────────────────────────
//  CONFIGURACIÓN DE "COSITAS DE TEMPORADA"
//  Para cambiar de temporada solo hay que tocar la línea  activa: '...'  (abajo).
//  Cambia automáticamente: la página temporada.html, la tarjeta de la portada,
//  los colores y los productos. El nombre del apartado y el menú no cambian.
//
//  imagenPortada = foto de la tarjeta en la portada · imagenHero = foto grande de la página (opcional).
//  Para añadir una temporada nueva: copia un bloque de "temporadas", cámbiale la
//  clave (p. ej. verano, otono, sanvalentin…) y rellénalo.
//  Para probar una temporada sin publicarla: temporada.html?t=primavera
//
//  Cada producto puede ser:
//    · una tarjeta que lleva a otra página:  enlace: 'coleccion-cocina.html#tabla-navidad'
//    · o un producto sencillo con carrito:   carrito: true  (usa id, nombre, precio y peso)
//    · o un aviso "Próximamente":            proximamente: true
// ──────────────────────────────────────────────────────────────────────────────
window.TEMPORADA_CONFIG = {

  activa: 'navidad',

  temporadas: {

    navidad: {
      emoji: '🎄',
      etiqueta: '🎄 Navidad',
      titulo: 'Cositas de Navidad',
      intro: 'Pequeños detalles navideños hechos a mano, para regalar o para vestir tu casa. Ediciones especiales que solo aparecen en estas fechas.',
      subPortada: 'Detalles navideños hechos a mano · Edición especial',
      imagenPortada: 'images/temporada-navidad.jpg',
      imagenHero: 'images/temporada-navidad.jpg',
      colores: { acento: '#9c3b3b', suave: '#f6e3df', fondo: '#fdf4f1' },
      aviso: '🎁 Si quieres tu pedido personalizado para Navidad, hazlo con tiempo: en fechas de alta demanda los plazos se amplían.',
      productos: [
        {
          nombre: 'Tabla de cocina · Navidad',
          descripcion: 'Tabla de presentación decorada a mano con decoupage navideño: acebo, bayas y mucho cariño. Con dedicatoria grabada opcional.',
          precio: '32 €',
          imagen: 'images/tabla_invierno.jpg',
          etiqueta: 'Edición especial',
          enlace: 'coleccion-cocina.html#tabla-navidad',
          textoEnlace: 'Ver la tabla'
        },
        {
          nombre: 'Adorno · Mi primera Navidad',
          descripcion: 'Adorno de madera grabado al láser con el nombre del bebé (sin suplemento). 15 € · 13 €/u desde 3 unidades · 10 €/u desde 10 unidades.',
          precio: '15 €',
          imagen: 'images/adorno-primera-navidad.jpg',
          etiqueta: 'Edición Navidad',
          enlace: 'mis-primeros-mimos.html#adorno-navidad',
          textoEnlace: 'Ver el adorno'
        },
        {
          nombre: 'Más cositas navideñas',
          descripcion: 'Estoy preparando nuevas piezas para esta Navidad. Pronto las verás aquí.',
          proximamente: true
        }
      ]
    },

    primavera: {
      emoji: '🌸',
      etiqueta: '🌸 Bodas y comuniones',
      titulo: 'Cositas para Bodas y Comuniones',
      intro: 'Detalles para los días más especiales de la primavera: bodas, comuniones y celebraciones. Personalizados para que cada invitado se lleve un recuerdo.',
      subPortada: 'Bodas · Comuniones · Detalles para invitados',
      imagenPortada: 'images/marcasitio2.jpg',
      colores: { acento: '#6a9e8a', suave: '#e0ede8', fondo: '#f6faf8' },
      aviso: '💌 Para bodas y comuniones, escríbeme con tiempo: los pedidos de más de 10 unidades tienen plazos propios.',
      productos: [
        {
          nombre: 'Detallitos para Eventos',
          descripcion: 'Marcasitios, imanes abrebotellas, libretas y posavasos personalizados, con precios por volumen desde 10 unidades.',
          imagen: 'images/marcasitio2.jpg',
          etiqueta: 'Bodas y comuniones',
          enlace: 'detallitos-eventos.html',
          textoEnlace: 'Ver detallitos'
        }
      ]
    }

  }
};
