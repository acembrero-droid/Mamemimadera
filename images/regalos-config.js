// ──────────────────────────────────────────────────────────────────────────────
//  REGALOS BONITOS · cómo se ordenan los regalos
//  Cada producto de regalos-bonitos.html se coloca en uno o varios apartados con las
//  etiquetas de aquí abajo. El título tiene que ser IDÉNTICO al título de la tarjeta (h3).
//
//  · para:      a quién va dirigido (uno o varios): peques, mama, profes, cumple, casa, lectores
//  · tipo:      qué es (para los botones de filtro): llaveros, imanes, discos, marcapaginas,
//               decoracion, joyas, papeleria, mesa, otros
//  · tec:       cómo está hecho (para los enlaces antiguos): madera, 3d, cuero
//  · etiqueta:  el texto pequeño que sale sobre el título de la tarjeta
//  · palabras:  palabras extra para que el buscador (la lupa) lo encuentre
//
//  Para añadir un regalo nuevo: pega su tarjeta en regalos-bonitos.html (dentro de #todos)
//  y añade aquí una línea con su título. Si no lo pones aquí, solo saldrá en "Todos los regalos".
// ──────────────────────────────────────────────────────────────────────────────
window.REGALOS = {
  categorias: [
    { id: 'peques', nombre: 'Para peques', sub: 'Letras 3D · Nombre para la puerta · Banderín', imagen: 'images/letra3d.jpg', palabras: 'peque peques nino nina niños infantil bebe hijo hija habitacion' },
    { id: 'mama', nombre: 'Para mamá', sub: 'Llaveros · Marcapáginas · Collares', imagen: 'images/llavero.jpg', palabras: 'mama madre mami abuela dia de la madre' },
    { id: 'profes', nombre: 'Para profes', sub: 'Placa de profe · Libretas · Marcapáginas', imagen: 'images/placa_profe.jpg', palabras: 'profe profes profesor profesora maestra maestro cole colegio fin de curso' },
    { id: 'cumple', nombre: 'Cumpleaños y felicitaciones', sub: 'Placas y discos para felicitar · Llaveros', imagen: 'images/placa_cumple.jpg', palabras: 'cumpleaños cumple aniversario felicitar felicitacion regalo detalle' },
    { id: 'casa', nombre: 'Para casa y recuerdos', sub: 'Imanes · Abrebotellas · Discos', imagen: 'images/iman_elefante.jpg', palabras: 'casa hogar cocina mesa recuerdo recuerdos pueblo baides decoracion' },
    { id: 'lectores', nombre: 'Para lectores', sub: 'Marcapáginas · Discos Sant Jordi', imagen: 'images/marcapag_cafe.jpg', palabras: 'lector lectora libro libros leer lectura sant jordi' }
  ],
  tipos: { llaveros: 'Llaveros', imanes: 'Imanes', discos: 'Discos y placas', marcapaginas: 'Marcapáginas', decoracion: 'Decoración', joyas: 'Collares', papeleria: 'Libretas', mesa: 'Para la mesa', otros: 'Otros' },
  tecnicas: { '3d': 'Con impresión 3D', madera: 'En madera', cuero: 'De cuero' },
  productos: {
    "Letra 3D autoportante": {"para": ["peques", "casa"], "tipo": "decoracion", "tec": ["3d"], "etiqueta": "Impresión 3D", "palabras": "inicial nombre habitacion decoracion"},
    "Nombre para puerta": {"para": ["peques"], "tipo": "decoracion", "tec": ["madera", "3d"], "etiqueta": "Madera + impresión 3D", "palabras": "puerta habitacion nombre infantil"},
    "Banderín de madera": {"para": ["peques", "cumple"], "tipo": "decoracion", "tec": ["madera", "3d"], "etiqueta": "Madera + impresión 3D", "palabras": "guirnalda banderines habitacion fiesta cumpleaños"},
    "Chupetero personalizado": {"para": ["peques"], "tipo": "otros", "tec": ["madera"], "etiqueta": "Madera y silicona", "palabras": "chupete bebe sujetachupetes"},
    "Llavero · Mamá": {"para": ["mama"], "tipo": "llaveros", "tec": ["madera"], "etiqueta": "Edición Mamemi · Llaveros", "palabras": "madre mama dia de la madre"},
    "Llavero grabado en madera": {"para": ["mama", "cumple"], "tipo": "llaveros", "tec": ["madera"], "etiqueta": "Grabado láser en madera", "palabras": "llavero personalizado nombre iniciales"},
    "Collar grabado en madera y resina": {"para": ["mama"], "tipo": "joyas", "tec": ["madera"], "etiqueta": "Madera y resina", "palabras": "colgante collar joya madre"},
    "Marcapáginas personalizado": {"para": ["mama", "profes", "lectores"], "tipo": "marcapaginas", "tec": ["cuero"], "etiqueta": "Cuero vegano · grabado láser", "palabras": "libro lectura lector"},
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
    "Marcapáginas · Café entre libros": {"para": ["lectores", "mama", "profes"], "tipo": "marcapaginas", "tec": ["cuero"], "etiqueta": "Edición Mamemi · Marcapáginas", "palabras": "cafe libros"},
    "Marcapáginas · Libro floreciente": {"para": ["lectores", "mama", "profes"], "tipo": "marcapaginas", "tec": ["cuero"], "etiqueta": "Edición Mamemi · Marcapáginas", "palabras": "flores libro"},
    "Marcapáginas · Libro y corazones": {"para": ["lectores", "mama", "profes"], "tipo": "marcapaginas", "tec": ["cuero"], "etiqueta": "Edición Mamemi · Marcapáginas", "palabras": "corazones libro"},
    "Marcapáginas · Margarita": {"para": ["lectores", "mama", "profes"], "tipo": "marcapaginas", "tec": ["cuero"], "etiqueta": "Edición Mamemi · Marcapáginas", "palabras": "margarita flor"},
    "Marcapáginas · Ramo de regalo": {"para": ["lectores", "mama", "profes"], "tipo": "marcapaginas", "tec": ["cuero"], "etiqueta": "Edición Mamemi · Marcapáginas", "palabras": "ramo flores"},
    "Marcapáginas · Pata lectora": {"para": ["lectores", "mama", "profes"], "tipo": "marcapaginas", "tec": ["cuero"], "etiqueta": "Edición Mamemi · Marcapáginas", "palabras": "pata perro gato mascota"},
    "Disco · Sant Jordi 2026": {"para": ["lectores", "cumple"], "tipo": "discos", "tec": ["madera"], "etiqueta": "Edición Mamemi · Discos", "palabras": "sant jordi libro rosa dragon"}
  }
};
