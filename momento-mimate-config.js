// ──────────────────────────────────────────────────────────────────────────────
//  CONFIGURACIÓN DE MOMENTO MÍMATE (cantimploras)
//  Las imágenes van DENTRO de este archivo (no hace falta subir nada a images/).
//  · precio:  precio por unidad (IVA incluido).
//  · recargoGrabado: lo que se suma por unidad si eligen un diseño (0 = incluido en el precio).
//  · colores / disenos: lo que se puede elegir. Los diseños con frase van primero.
// ──────────────────────────────────────────────────────────────────────────────
window.MOMENTO_MIMATE = {
  precio: 33,
  recargoGrabado: 0,
  recargoNombre: 5,      // suma por unidad si añaden nombre o dedicatoria debajo del dibujo (máx. 3 palabras)
  colores: [
    { id: 'azul', nombre: 'Azul petróleo', hex: '#1f7a8c', foto: "images/mm-color-azul.jpg?v=20261025" },
    { id: 'rosa', nombre: 'Rosa fucsia', hex: '#e0457b', foto: "images/mm-color-rosa.jpg?v=20261025" }
  ],
  disenos: [
    { id: 'respira', nombre: 'Respira', imagen: "images/mm-respira.jpg?v=20261025" },
    { id: 'pura-magia', nombre: 'Pura magia', imagen: "images/mm-pura-magia.jpg?v=20261025" },
    { id: 'ciclicas', nombre: 'Simplemente somos cíclicas', imagen: "images/mm-ciclicas.jpg?v=20261025" },
    { id: 'caracola', nombre: 'Caracola · Bella y fuerte', imagen: "images/mm-caracola.jpg?v=20261025" },
    { id: 'cristales', nombre: 'Cristales · Brilla siempre', imagen: "images/mm-cristales.jpg?v=20261025" },
    { id: 'ramo', nombre: 'Ramo · Cultiva tu propia magia', imagen: "images/mm-ramo.jpg?v=20261025" },
    { id: 'flor', nombre: 'Flor · En la flor de la vida', imagen: "images/mm-flor.jpg?v=20261025" },
    { id: 'pajaro', nombre: 'Pájaro · Solamente abre tus alas', imagen: "images/mm-pajaro.jpg?v=20261025" },
    { id: 'elefante', nombre: 'Elefante mandala', imagen: "images/mm-elefante.jpg?v=20261025" },
    { id: 'loto', nombre: 'Flor de loto', imagen: "images/mm-loto.jpg?v=20261025" },
    { id: 'yoga', nombre: 'Yoga', imagen: "images/mm-yoga.jpg?v=20261025" },
    { id: 'corredora', nombre: 'Corredora', imagen: "images/mm-corredora.jpg?v=20261025" },
    { id: 'ojo-mano', nombre: 'Mano y ojo', imagen: "images/mm-ojo-mano.jpg?v=20261025" },
    { id: 'amanecer', nombre: 'Amanecer', imagen: "images/mm-amanecer.jpg?v=20261025" },
    { id: 'sol-nubes', nombre: 'Sol y nubes', imagen: "images/mm-sol-nubes.jpg?v=20261025" }
  ]
};
