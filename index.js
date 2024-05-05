require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});


/**
 * Microservicio de acortador de URL
 * Creación de URL cortas:
 *    Desde un formulario, se introduce la URL original y se crea una URL corta.
 *    La página de resultado debe mostrar la URL original y la URL corta en formato json
 * 
 *    Ejemplo de salida:
 *    {
 *      original_url: 'https://www.freecodecamp.org/',
 *      short_url: '[URL de mi proyecto]/api/shorturl/1'
 *    }
 * 
 *    La url de short_url debe quedar almacenada en una variable para poder acceder a ella desde el navegador:
 *      [URL de mi proyecto]/api/shorturl/1
 *      Debe redirigir a la original_url almacenada
 */


// Middleware para parsear JSON en las solicitudes POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Almacenamiento de las URL cortas y sus correspondientes URL originales
const urlShortener = {};
let counter = 1; // Contador para generar los números de URL corta

// Ruta para crear una URL corta
app.post('/api/shorturl', function (req, res) {
  const originalUrl = req.body.url;

  // Expresión regular para verificar si la URL tiene el formato correcto
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

  if (!urlRegex.test(originalUrl)) {
    // Si la URL no tiene el formato correcto, devuelve un error
    return res.json({ error: 'invalid url' });
  }

  // Si la URL es válida, procede a crear la URL corta
  const shortUrl = counter++; // Generar el número de URL corta
  urlShortener[shortUrl] = originalUrl;
  res.json({
    original_url: originalUrl,
    short_url: shortUrl
  });
});

// Ruta para redirigir a la URL original
app.get('/api/shorturl/:short', function (req, res) {
  const shortUrl = req.params.short;
  const originalUrl = urlShortener[shortUrl];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'invalid url' });
  }
});


app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
