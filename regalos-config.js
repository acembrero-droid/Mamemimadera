// ──────────────────────────────────────────────────────────────────────────────
//  REGALOS ÚNICOS · cómo se ordenan los regalos
//  Cada producto de regalos-unicos.html se coloca en uno o varios apartados con las
//  etiquetas de aquí abajo. El título tiene que ser IDÉNTICO al título de la tarjeta (h3).
//
//  · para:      a quién va dirigido (uno o varios): peques, mama, profes, cumple, casa, lectores
//  · tipo:      qué es (para los botones de filtro): llaveros, imanes, discos, marcapaginas,
//               decoracion, joyas, papeleria, mesa, otros
//  · tec:       cómo está hecho (para los enlaces antiguos): madera, 3d, cuero
//  · etiqueta:  el texto pequeño que sale sobre el título de la tarjeta
//  · palabras:  palabras extra para que el buscador (la lupa) lo encuentre
//
//  'primero' (en cada apartado): el producto que sale en primer lugar, el de la foto de la portada.
//  Para añadir un regalo nuevo: pega su tarjeta en regalos-unicos.html (dentro de #todos)
//  y añade aquí una línea con su título. Si no lo pones aquí, solo saldrá en "Todos los regalos".
// ──────────────────────────────────────────────────────────────────────────────
window.REGALOS = {
  categorias: [
    { id: 'peques', primero: 'Letra 3D autoportante', nombre: 'Para peques', sub: 'Letras 3D · Nombre para la puerta · Banderín · Collar', imagen: 'images/letra3d.jpg', palabras: 'peque peques nino nina niños infantil bebe hijo hija habitacion' },
    { id: 'mama', primero: 'Llavero · Mamá', nombre: 'Para mamá y abuela', sub: 'Llaveros · Marcapáginas · Collares', imagen: 'images/llavero.jpg', palabras: 'mama madre mami abuela abuelita abu yaya nana dia de la madre' },
    { id: 'profes', primero: 'Placa de profe', nombre: 'Para profes', sub: 'Placa de profe · Libretas · Marcapáginas', imagen: 'images/placa_profe.jpg', palabras: 'profe profes profesor profesora maestra maestro cole colegio fin de curso' },
    { id: 'cumple', primero: 'Placa de felicitación', nombre: 'Cumpleaños y felicitaciones', sub: 'Placas y discos para felicitar · Llaveros', imagen: 'images/placa_cumple.jpg', palabras: 'cumpleaños cumple aniversario felicitar felicitacion regalo detalle' },
    { id: 'casa', primero: 'Imán · Mandala Elefante', nombre: 'Para casa y recuerdos', sub: 'Imanes · Abrebotellas · Discos', imagen: 'images/iman_elefante.jpg', palabras: 'casa hogar cocina mesa recuerdo recuerdos pueblo baides decoracion' },
    { id: 'lectores', primero: 'Marcapáginas grabado', nombre: 'Para lectores', sub: 'Marcapáginas · Discos Sant Jordi', imagen: 'images/marcapag_cafe.jpg', palabras: 'lector lectora libro libros leer lectura sant jordi' }
  ],
  tipos: { llaveros: 'Llaveros', imanes: 'Imanes', discos: 'Discos y placas', marcapaginas: 'Marcapáginas', decoracion: 'Decoración', joyas: 'Collares', papeleria: 'Libretas', mesa: 'Para la mesa', otros: 'Otros' },
  tecnicas: { '3d': 'Con impresión 3D', madera: 'En madera', cuero: 'De cuero' },
  // ── "También te puede gustar": productos que viven en OTRAS páginas ──
  // Salen debajo de los regalos, en los apartados que indiques en "para".
  // Para añadir uno nuevo, copia un bloque y cambia los datos.
  tambien: [
    { titulo: 'Cantimplora motivacional · 500 ml', sub: 'Con tu diseño grabado y, si quieres, un nombre', imagen: 'images/momento-mimate.jpg', desde: '33 €', href: 'momento-mimate.html', para: ['mama', 'profes', 'cumple'], palabras: 'cantimplora botella agua motivacional momento mimate grabada' },
    { titulo: 'Tablas de cocina', sub: 'Otoño · Navidad · Mar · Montaña, con dedicatoria grabada', imagen: 'images/tablas_cocina.jpg', desde: '32 €', href: 'coleccion-cocina.html#tablas', para: ['mama', 'casa'], palabras: 'tabla cocina cortar madera dedicatoria' },
    { titulo: 'Abrebotellas de pared', sub: 'Madera con cesta metálica recoge chapas', imagen: 'images/abrebotellas_pared.jpg', desde: '20 €', href: 'coleccion-cocina.html#abrepared', para: ['casa'], palabras: 'abrebotellas pared cerveza chapas cocina' },
    { titulo: 'Posavasos para eventos', sub: 'Madera grabada con láser · pedidos desde 10 unidades', imagen: 'images/posavasos-eventos.jpg', desde: '2,90 € / u', href: 'detallitos-eventos.html#posavasos', para: ['cumple'], palabras: 'posavasos evento boda bautizo comunion celebracion invitados' }
  ],
  // ── MARCAPÁGINAS (una sola ficha con dibujo a elegir) ──
  // precio: por unidad · recargoNombre: lo que se suma si añaden nombre/dedicatoria (máx. 3 palabras)
  // Para añadir un dibujo nuevo: copia una línea de "disenos" (id único, nombre e imagen).
  // Si un dibujo no tiene 'foto' (como floreciente, de momento), la foto grande muestra el dibujo en línea.
  // 'foto' = la foto grande del producto con ese dibujo (images/…); 'imagen' = el dibujo en línea para la cuadrícula.
  // Las imágenes de los dibujos van dentro de este archivo (no hay que subirlas a images/).
  // Si prefieres, en 'imagen' puedes poner una ruta como 'images/mi-dibujo.jpg'.
  marcapaginas: {
    precio: 18,
    recargoNombre: 5,
    colores: [
      { id: 'blanco', nombre: 'Blanco', hex: '#f6f3ec' },
      { id: 'rojo', nombre: 'Rojo vivo', hex: '#c0262d' },
      { id: 'verde', nombre: 'Verde botella', hex: '#1f4d3a' },
      { id: 'gris', nombre: 'Gris oscuro', hex: '#4a4a4a' },
      { id: 'marron', nombre: 'Marrón', hex: '#6b4a2f' }
    ],
    disenos: [
      { id: 'cafe', foto: 'images/marcapag_cafe.jpg', nombre: 'Café entre libros', imagen: "images/grabados/marcapaginas/cafe.jpg?v=20261025" },
      { id: 'floreciente', nombre: 'Libro floreciente', imagen: "images/grabados/marcapaginas/floreciente.jpg?v=20261025" },
      { id: 'corazones', foto: 'images/marcapag_corazones.jpg', nombre: 'Libro y corazones', imagen: "images/grabados/marcapaginas/corazones.jpg?v=20261025" },
      { id: 'margarita', foto: 'images/marcapag_margarita.jpg', nombre: 'Margarita', imagen: "images/grabados/marcapaginas/margarita.jpg?v=20261025" },
      { id: 'pata', foto: 'images/marcapag_pata.jpg', nombre: 'Pata lectora', imagen: "images/grabados/marcapaginas/pata.jpg?v=20261025" }
    ]
  },
  productos: {
    "Letra 3D autoportante": {"para": ["peques", "casa"], "tipo": "decoracion", "tec": ["3d"], "etiqueta": "Impresión 3D", "palabras": "inicial nombre habitacion decoracion"},
    "Nombre para puerta": {"para": ["peques"], "tipo": "decoracion", "tec": ["madera", "3d"], "etiqueta": "Madera + impresión 3D", "palabras": "puerta habitacion nombre infantil"},
    "Banderín de madera": {"para": ["peques", "cumple"], "tipo": "decoracion", "tec": ["madera", "3d"], "etiqueta": "Madera + impresión 3D", "palabras": "guirnalda banderines habitacion fiesta cumpleaños"},
    "Placa de nacimiento": {"para": ["peques", "cumple"], "tipo": "discos", "tec": ["madera", "3d"], "etiqueta": "Madera + nombre en 3D", "palabras": "nacimiento bebe recien nacido recuerdo primer cumpleaños primer año"},
    "Chupetero personalizado": {"para": ["peques"], "tipo": "otros", "tec": ["madera"], "etiqueta": "Madera y silicona", "palabras": "chupete bebe sujetachupetes"},
    "Llavero · Mamá": {"para": ["mama"], "tipo": "llaveros", "tec": ["madera"], "etiqueta": "Edición Mamemi · Llaveros", "palabras": "madre mama dia de la madre"},
    "Llavero grabado en madera": {"para": ["mama", "cumple"], "tipo": "llaveros", "tec": ["madera"], "etiqueta": "Grabado láser en madera", "palabras": "llavero personalizado nombre iniciales"},
    "Collar Sol y Luna": {"para": ["mama"], "tipo": "joyas", "tec": [], "etiqueta": "Joyitas Mamemi · Bisutería", "palabras": "collar colgante bisuteria joya madre dorado"},
    "Collar Flor": {"para": ["mama"], "tipo": "joyas", "tec": [], "etiqueta": "Joyitas Mamemi · Bisutería", "palabras": "collar colgante bisuteria joya madre dorado"},
    "Collar Luna Dorada": {"para": ["mama"], "tipo": "joyas", "tec": [], "etiqueta": "Joyitas Mamemi · Bisutería", "palabras": "collar colgante bisuteria joya madre dorado"},
    "Collar Lágrima": {"para": ["mama"], "tipo": "joyas", "tec": [], "etiqueta": "Joyitas Mamemi · Bisutería", "palabras": "collar colgante bisuteria joya madre dorado"},
    "Collar grabado en madera y resina": {"para": ["mama", "peques"], "tipo": "joyas", "tec": ["madera"], "etiqueta": "Madera y resina", "palabras": "colgante collar joya madre"},
    "Marcapáginas grabado": {"para": ["mama", "profes", "lectores"], "tipo": "marcapaginas", "tec": ["cuero"], "etiqueta": "Cuero vegano · grabado láser", "palabras": "marcapaginas marcapagina libro lectura lector lectora cafe entre libros libro floreciente corazones margarita pata lectora"},
    "Placa de profe": {"para": ["profes"], "tipo": "discos", "tec": ["madera", "3d"], "etiqueta": "Madera + impresión 3D", "palabras": "profesora maestra maestro fin de curso colegio huellas alumnos"},
    "Libreta personalizada": {"para": ["profes", "lectores"], "tipo": "papeleria", "tec": ["madera"], "etiqueta": "Grabado láser", "palabras": "cuaderno libreta fin de curso"},
    "Placa de felicitación": {"para": ["cumple"], "tipo": "discos", "tec": ["madera", "3d"], "etiqueta": "Madera + impresión 3D", "palabras": "cumpleaños aniversario felicitar brindis"},
    "Placa especial grabada": {"para": ["cumple", "casa"], "tipo": "discos", "tec": ["madera"], "etiqueta": "Grabado láser en madera", "palabras": "dedicatoria poema diseño personalizado a medida"},
    "Disco · Cultiva tu propia magia": {"para": ["cumple", "casa"], "tipo": "discos", "tec": ["madera"], "etiqueta": "Edición Mamemi · Discos", "palabras": "flores magia disco decoracion"},
    "Llavero · Protección Animal": {"para": ["cumple"], "tipo": "llaveros", "tec": ["madera"], "etiqueta": "Edición Mamemi · Llaveros", "palabras": "animales mascotas perro gato proteccion"},
    "Llavero · Corazón de Mar": {"para": ["cumple"], "tipo": "llaveros", "tec": ["madera"], "etiqueta": "Edición Mamemi · Llaveros", "palabras": "mar playa corazon verano"},
    "Llavero · Montaña": {"para": ["cumple"], "tipo": "llaveros", "tec": ["madera"], "etiqueta": "Edición Mamemi · Llaveros", "palabras": "montaña senderismo monte naturaleza"},
    "Llavero · Mandala": {"para": ["cumple"], "tipo": "llaveros", "tec": ["madera"], "etiqueta": "Edición Mamemi · Llaveros", "palabras": "mandala zen"},
    "Llavero · Deportes": {"para": ["cumple"], "tipo": "llaveros", "tec": ["madera"], "etiqueta": "Edición Mamemi · Llaveros", "palabras": "deporte deportista futbol correr"},
    "Imán · Mandala Elefante": {"para": ["casa"], "tipo": "imanes", "tec": ["madera"], "etiqueta": "Edición Mamemi · Imanes", "palabras": "iman nevera elefante mandala"},
    "Imán · Baides está en mi corazón": {"para": ["casa"], "tipo": "imanes", "tec": ["madera"], "etiqueta": "Edición Mamemi · Imanes", "palabras": "iman nevera baides girasol pueblo recuerdo"},
    "Disco · Baides está en mi corazón": {"para": ["casa"], "tipo": "discos", "tec": ["madera"], "etiqueta": "Edición Mamemi · Discos", "palabras": "baides girasol pueblo recuerdo"},
    "Caja de vino personalizada": {"para": ["cumple", "casa"], "tipo": "mesa", "tec": ["madera"], "etiqueta": "Grabado láser en madera", "palabras": "vino botella regalo anfitriones"},
    "Discos grabados en madera": {"para": ["casa", "cumple"], "tipo": "mesa", "tec": ["madera"], "etiqueta": "Grabado láser en madera", "palabras": "posavasos discos mesa"},
    "Abrebotellas de bambú magnético": {"para": ["casa"], "tipo": "mesa", "tec": ["madera"], "etiqueta": "Bambú · grabado láser", "palabras": "abrebotellas cocina nevera"},
    "Disco · Sant Jordi 2026": {"para": ["lectores", "cumple"], "tipo": "discos", "tec": ["madera"], "etiqueta": "Edición Mamemi · Discos", "palabras": "sant jordi libro rosa dragon"}
  }
};
