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
    { id: 'azul', nombre: 'Azul petróleo', hex: '#1f7a8c', foto: "grabados/cantimplora/color-azul.jpg?v=20261025" },
    { id: 'rosa', nombre: 'Rosa fucsia', hex: '#e0457b', foto: "grabados/cantimplora/color-rosa.jpg?v=20261025" }
  ],
  disenos: [
    { id: 'respira', nombre: 'Respira', imagen: "grabados/cantimplora/respira.jpg?v=20261025" },
    { id: 'pura-magia', nombre: 'Pura magia', imagen: "grabados/cantimplora/pura-magia.jpg?v=20261025" },
    { id: 'ciclicas', nombre: 'Simplemente somos cíclicas', imagen: "grabados/cantimplora/ciclicas.jpg?v=20261025" },
    { id: 'caracola', nombre: 'Caracola · Bella y fuerte', imagen: "grabados/cantimplora/caracola.jpg?v=20261025" },
    { id: 'cristales', nombre: 'Cristales · Brilla siempre', imagen: "grabados/cantimplora/cristales.jpg?v=20261025" },
    { id: 'ramo', nombre: 'Ramo · Cultiva tu propia magia', imagen: "grabados/cantimplora/ramo.jpg?v=20261025" },
    { id: 'flor', nombre: 'Flor · En la flor de la vida', imagen: "grabados/cantimplora/flor.jpg?v=20261025" },
    { id: 'pajaro', nombre: 'Pájaro · Solamente abre tus alas', imagen: "grabados/cantimplora/pajaro.jpg?v=20261025" },
    { id: 'elefante', nombre: 'Elefante mandala', imagen: "grabados/cantimplora/elefante.jpg?v=20261025" },
    { id: 'loto', nombre: 'Flor de loto', imagen: "grabados/cantimplora/loto.jpg?v=20261025" },
    { id: 'yoga', nombre: 'Yoga', imagen: "grabados/cantimplora/yoga.jpg?v=20261025" },
    { id: 'corredora', nombre: 'Corredora', imagen: "grabados/cantimplora/corredora.jpg?v=20261025" },
    { id: 'ojo-mano', nombre: 'Mano y ojo', imagen: "grabados/cantimplora/ojo-mano.jpg?v=20261025" },
    { id: 'amanecer', nombre: 'Amanecer', imagen: "grabados/cantimplora/amanecer.jpg?v=20261025" },
    { id: 'sol-nubes', nombre: 'Sol y nubes', imagen: "grabados/cantimplora/sol-nubes.jpg?v=20261025" }
  ]
};
