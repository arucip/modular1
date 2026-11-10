# arucip2

Arucip (Ayuda Rápida para UCIP) reorganizada como PWA modular. Reemplaza al HTML único de 7,9 MB de `pruebas`.
dice Claude:
¿Por qué no poner todo en index.html?
Se podría, y para una prueba muy pequeña sería perfectamente válido. 
Pero a medida que agregues módulos, separar los archivos facilita:
- Modificar una ecuación sin alterar el generador del informe.
- Revisar y probar cada módulo por separado.
- Actualizar tablas de referencia sin mezclar datos con la interfaz.
- Detectar errores con mayor facilidad.
- Reutilizar un módulo en otra aplicación futura.

## Estructura
- `index.html`, `styles.css`, `app.js` (interfaz y carga de módulos), `motor.js` (evalúa las fórmulas de los packs), `sw.js`, `manifest.json`
- `modules/index.json`: catálogo de módulos y menú de herramientas. `tags.json`, `tips.json`
- `modules/packs/*.json`: 35 escalas/calculadoras (fórmulas como texto, copia literal del original), 29 fichas informativas, enlaces y checklists. Se cargan al abrir la herramienta.
- `modules/custom/*.js`: lo que necesita código propio: `cronometro`, `paro` (RCP, audio, registro), `dosis` (asistentes por peso), `calculadoras`, `cards`, `pocus`, `quemados` (mapa corporal), `otros`
- `data/`: tablas, cards, fórmulas, sinónimos de búsqueda, hubs (emergencias, motivos de ingreso)
- `images/`, `fonts/`, `icons/`

## Notas
- Funciona sin conexión (service worker, red primero). El listado de archivos de `sw.js` se genera al compilar.
- Traducciones (inglés/portugués): pendientes.
- Verificación: 82 de 84 herramientas dan resultados idénticos a la app original con los mismos datos de entrada (las 2 restantes difieren solo en la ruta de una imagen y en el texto de instalación).

## Cómo abrirla en una PC
- Recomendado: ejecutar `iniciar-windows.bat` (o `./iniciar.sh` en Mac/Linux; requiere Python). Abre http://localhost:8080 y habilita el service worker (modo sin conexión) y la instalación como PWA.
- También funciona con doble clic en `index.html`: como los navegadores bloquean `fetch()` en `file://`, `app.js` usa entonces `offline-data.js` (copia de todos los JSON). Si se edita algún JSON, hay que regenerar ese archivo.
