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
//    · o la ficha completa de un producto (con sus opciones y carrito):  ficha: 'adorno-navidad'  (plantilla <template id="ficha-…"> en temporada.html)
//    · o un producto NUEVO que solo existe en esta temporada (se compra aquí mismo):
//        {
//          carrito: true, id: 'adorno-estrella', nombre: 'Adorno estrella', descripcion: '...',
//          precio: '8 €', peso: 40, imagen: 'images/adorno-estrella.jpg', etiqueta: 'Novedad',
//          nota: 'Hecho a mano',                       // (opcional) texto pequeño bajo el precio
//          opciones: [                                 // (opcional) lo que puede elegir o escribir el cliente
//            { nombre: 'Color', valores: ['Rojo', 'Verde', { texto: 'Dorado', extra: 2 }] },   // extra = suplemento en €
//            { nombre: 'Nombre a grabar', tipo: 'texto', placeholder: 'ej. Carla', maximo: 30, obligatorio: false }
//          ]
//        }
//      Para quitarlo cuando acabe la temporada, borra su bloque (o cambia la temporada activa).
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
        { ficha: 'tabla-navidad' },
        { ficha: 'adorno-navidad' },
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
