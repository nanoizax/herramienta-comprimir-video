# Comprimir Video

Reduce el peso de un video sin subirlo a ningún servidor. Gratis y directo desde tu navegador.

Herramienta gratuita y de código abierto de [SonhoLab](https://sonholab.com). Corre **100 % en el navegador**: los archivos no se suben a ningún servidor.

> Licencia: **GPL-2.0-or-later** · Autor: Leandro Manuel Perez Montañana · Idiomas de la interfaz: español, inglés, francés, portugués (BR), alemán, hindi, indonesio y ruso.

## Qué hace

No siempre hace falta enviar el video en su calidad original: cuando el archivo es demasiado pesado para WhatsApp o el correo, basta con reducirlo un poco. Aquí eliges el nivel de calidad y en unos minutos tienes un archivo MP4 más liviano, sin que el video salga de tu equipo ni necesites instalar nada.

**Cuándo te sirve:**

- Enviar por WhatsApp un video grabado con el celular que quedó demasiado pesado para mandarlo directo.
- Achicar los videos de producto o de la empresa antes de subirlos a la web, para que las páginas carguen más rápido.
- Liberar espacio en el teléfono comprimiendo videos antes de guardarlos como respaldo.

## Cómo se usa

1. **Elige el video.** Arrastra el archivo al recuadro o haz clic para buscarlo en tu equipo. Funciona con los formatos más comunes: MP4, WebM y MOV.
2. **Selecciona la calidad.** Escoge entre Alta, Media o Baja según cuánto necesitas reducir el peso. Mientras más baja la calidad, más chico queda el archivo, pero se nota más la pérdida de nitidez.
3. **Comprime y descarga.** Presiona comprimir y espera a que termine: el tiempo depende de la duración del video y de la potencia de tu equipo. Al finalizar ves el tamaño original junto al nuevo y descargas el resultado.

## Qué necesita para funcionar

### Para instalarla y compilarla

- [Node.js](https://nodejs.org) 18 o superior (probado con Node 22) y npm.
- Conexión a internet **solo** durante `npm install`. Una vez compilada, la herramienta no pide nada a internet.

### Complementos específicos de esta herramienta

- **ffmpeg.wasm (≈30 MB)**: viene como dependencia de npm (`@ffmpeg/core`) y se carga solo cuando el usuario procesa un video. No tienes que instalar ffmpeg en tu equipo ni en tu servidor.
- **PDF.js** (lector de PDF de Mozilla): viene como dependencia de npm; su *worker* se empaqueta solo con Vite.

### En el navegador de quien la usa

- WebAssembly. Un video grande consume memoria RAM del navegador: en equipos modestos conviene limitar el tamaño del archivo.
- El servidor que publique la herramienta debe entregar los archivos `.wasm` con el tipo `application/wasm`.
- Web Workers y Canvas (cualquier navegador actual).

## Instalación

```bash
git clone https://github.com/nanoizax/herramienta-comprimir-video.git
cd herramienta-comprimir-video
npm install
npm run dev         # servidor de desarrollo en http://localhost:5173
```

Para publicarla:

```bash
npm run build       # genera la carpeta dist/
npm run preview     # probar la versión compilada
```

Esta herramienta **no tiene servidor propio**: todo ocurre en el navegador de quien la usa. Basta con publicar la carpeta `dist/` en cualquier hosting estático (GitHub Pages, Netlify, Cloudflare Pages, Nginx, Apache...).

## Cómo está organizado

```
src/pages/tools/   La página de la herramienta (interfaz y lógica de pantalla)
src/lib/tools/     La lógica de la herramienta, separada de la interfaz
src/components/    Piezas compartidas (zona de arrastre de archivos, botón)
src/locales/       Textos en 8 idiomas (esta herramienta solamente)
src/i18n.ts        Configuración de idiomas
```

## Cómo meterla en tu propia plataforma

1. **Como página aparte:** publica `dist/` en una ruta de tu sitio, por ejemplo `/herramientas/comprimir-video/`. Si la sirves en una subcarpeta, define `base` en `vite.config.ts`.
2. **Dentro de tu aplicación React:** copia `src/pages/tools/*Page.tsx`, `src/lib/tools/` y `src/components/` a tu proyecto, instala las mismas dependencias de `package.json` y renderiza la página donde quieras.
3. **Con tu diseño:** el marco de la página (título, ayuda, preguntas frecuentes) está en `src/components/tools/ToolPageLayout.tsx` y es intencionalmente simple. Cámbialo por tu cabecera, tu pie y tus estilos; solo necesita pintar `children`.
4. **Con tu analítica:** `src/lib/hitCounter.ts` no hace nada. Si quieres medir el uso, conéctalo ahí a tu propia herramienta.

## Privacidad

Todo el procesamiento ocurre en el navegador. Esta copia no incluye analítica, cookies, contadores ni llamadas a ningún servidor propio. Los archivos del usuario no salen de su equipo.

## Preguntas frecuentes

**¿El video se sube a algún servidor para comprimirlo?**  
No. Todo el proceso ocurre dentro de tu navegador, usando la memoria y el procesador de tu propio equipo. El archivo nunca viaja a nuestros servidores ni a los de terceros, así que no queda ninguna copia guardada en otro lugar.

**¿Cuánto tarda en comprimir un video?**  
Depende de la duración del video y de la potencia de tu dispositivo, porque todo el trabajo lo hace tu equipo y no un servidor externo. Un celular o una computadora antigua tardan bastante más que una computadora reciente, y los archivos largos pueden llevar varios minutos.

**¿Por qué la primera vez que uso la herramienta demora más?**  
Porque necesita descargar un motor de video de unos 30 MB que le permite procesar el archivo dentro del navegador. Se descarga una sola vez; en las próximas conversiones ese paso ya no hace falta y todo arranca más rápido.

**¿Qué diferencia hay entre la calidad Alta, Media y Baja?**  
Alta conserva más nitidez pero reduce menos el peso; Baja logra el archivo más liviano, pero se nota una pérdida real de detalle, sobre todo en escenas con movimiento rápido. Media es un punto intermedio razonable para la mayoría de los casos.

**¿Es gratis? ¿Necesito crear una cuenta?**  
Es gratis, sin límite de videos y sin necesidad de registrarte. No hace falta instalar ningún programa: funciona con el navegador que ya tienes, tanto en computadora como en celular.

## Licencia

Este proyecto se publica bajo la licencia **GPL-2.0-or-later**. El texto completo está en [LICENSE](LICENSE).

**Por qué GPL:** esta herramienta incluye `@ffmpeg/core` (ffmpeg compilado a WebAssembly), que se distribuye bajo GPL-2.0 o posterior. Si la publicas en tu sitio, estás distribuyendo ese binario y debes ofrecer también el código fuente correspondiente y mantener esta misma licencia. Es una obligación de la GPL, no una opción.

Las dependencias tienen sus propias licencias, listadas en [THIRD-PARTY.md](THIRD-PARTY.md).

## Más herramientas gratuitas

Esta es una de las herramientas gratuitas de SonhoLab. Encuentra el resto, cada una con su repositorio, en https://sonholab.com/es/herramientas.

---

Hecho por Leandro Manuel Perez Montañana.
