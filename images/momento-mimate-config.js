// ──────────────────────────────────────────────────────────────────────────────
//  CONFIGURACIÓN DE MOMENTO MÍMATE (cantimploras)
//  · precio:  precio por unidad (IVA incluido).
//  · colores: los colores disponibles. 'foto' es la imagen que se muestra al elegirlo.
//  · disenos: los grabados entre los que puede elegir el cliente. Mientras esté vacía,
//             la página ofrece solo la cantimplora lisa y avisa de que llegarán diseños.
//             Para añadir un diseño: { id: 'flor', nombre: 'Flor', imagen: 'images/mm-flor.jpg' }
//  · recargoGrabado: lo que se suma por unidad si eligen un diseño (0 = incluido en el precio).
// ──────────────────────────────────────────────────────────────────────────────
window.MOMENTO_MIMATE = {
  precio: 33,
  recargoGrabado: 0,
  colores: [
    { id: 'rosa', nombre: 'Rosa fucsia', hex: '#e0457b', foto: 'images/cantimplora-rosa.jpg' },
    { id: 'azul', nombre: 'Azul petróleo', hex: '#1f7a8c', foto: 'images/cantimplora-azul.jpg' }
  ],
  disenos: [
    // { id: 'flor', nombre: 'Flor', imagen: 'images/mm-flor.jpg' },
  ]
};
