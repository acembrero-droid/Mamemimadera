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
    { id: 'respira', nombre: 'Respira', imagen: 'images/mm-respira.jpg' },
    { id: 'pura-magia', nombre: 'Pura magia', imagen: 'images/mm-pura-magia.jpg' },
    { id: 'ciclicas', nombre: 'Simplemente somos cíclicas', imagen: 'images/mm-ciclicas.jpg' },
    { id: 'caracola', nombre: 'Caracola · Bella y fuerte', imagen: 'images/mm-caracola.jpg' },
    { id: 'cristales', nombre: 'Cristales · Brilla siempre', imagen: 'images/mm-cristales.jpg' },
    { id: 'ramo', nombre: 'Ramo · Cultiva tu propia magia', imagen: 'images/mm-ramo.jpg' },
    { id: 'flor', nombre: 'Flor · En la flor de la vida', imagen: 'images/mm-flor.jpg' },
    { id: 'pajaro', nombre: 'Pájaro · Solamente abre tus alas', imagen: 'images/mm-pajaro.jpg' },
    { id: 'elefante', nombre: 'Elefante mandala', imagen: 'images/mm-elefante.jpg' },
    { id: 'loto', nombre: 'Flor de loto', imagen: 'images/mm-loto.jpg' },
    { id: 'yoga', nombre: 'Yoga', imagen: 'images/mm-yoga.jpg' },
    { id: 'corredora', nombre: 'Corredora', imagen: 'images/mm-corredora.jpg' },
    { id: 'ojo-mano', nombre: 'Mano y ojo', imagen: 'images/mm-ojo-mano.jpg' },
    { id: 'amanecer', nombre: 'Amanecer', imagen: 'images/mm-amanecer.jpg' },
    { id: 'sol-nubes', nombre: 'Sol y nubes', imagen: 'images/mm-sol-nubes.jpg' }
  ]
};
