# Animaciones de la pelota — MT1000 Santiago

El sitio usa una única pelota **`assets/img/ball.svg`** (los paths de la guía
`tennisball.svg` de la raíz del proyecto) y la anima con CSS puro. Así la pelota
se ve idéntica en todos los tamaños y no depende de librerías externas.

## Dónde se usa

| Lugar | Clase CSS | Animación |
| --- | --- | --- |
| Preloader (al cargar) | `.ball-anim--bounce` | Rebote con squash & stretch |
| Barra de progreso de scroll | `.ball-anim--spin` | Giro continuo |
| Separador sección Filosofía | `.ball-anim--cross` | Cruza de izquierda a derecha |
| Sección Inscripción | `.ball-anim--bounce` | Rebote con squash & stretch |
| Footer | `.ball-anim--spin` | Giro continuo |
| Navbar, favicon, botones, tickers, grados | `ball.svg` | Estática (con giro al hover donde aplica) |

Las animaciones están definidas en `css/styles.css` (`@keyframes ballBounceCss`,
`ballSpinCss`, `ballCrossCss` y `scrollBallSpin`). Se pueden ajustar ahí:
duración, altura del rebote, etc.

## Cómo usar otra pelota

Reemplaza `assets/img/ball.svg` manteniendo el nombre. Todos los usos del sitio
se actualizan automáticamente (navbar, favicon, botones y animaciones).

## Archivos Lottie (opcionales, sin uso actual)

En esta carpeta quedan las animaciones Lottie creadas al inicio del proyecto
(`tennis-ball-bounce.json`, `tennis-ball-crossing.json`, `ball-spin.json`) junto
con `js/lottie-data.js` y `js/vendor/lottie.min.js`. El sitio ya **no las carga**
(se reemplazaron por la pelota SVG animada con CSS para garantizar consistencia
visual). Puedes eliminarlas si no las necesitas.
