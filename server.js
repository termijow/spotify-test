// server.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Cargar las variables de entorno del archivo .env
dotenv.config();

const app = express();

// Servir los archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Definir la ruta principal que servirá el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta de callback que Spotify usa para redirigir después de la autenticación
app.get('/callback', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Verificando la autenticacion</h1>
        <p>Conectado correctamente</p>
        <script>
          // Extraer el access_token desde el fragmento de la URL
          // Extrae el url del 
          const hashParams = new URLSearchParams(window.location.hash.substr(1));
          const accessToken = hashParams.get('access_token');
          
          if (accessToken) {
            // Almacenar el access_token en localStorage
            localStorage.setItem('access_token', accessToken);
            window.location.href = '/';
          } else {
            document.body.innerHTML = '<h1>Error: No se pudo obtener el token de acceso.</h1>';
          }
        </script>
      </body>
    </html>
  `);
});

// Puerto donde se ejecutará el servidor
const port = process.env.PORT || 8000;

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
