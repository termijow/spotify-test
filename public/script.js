// const clientId = process.env.SPOTIFY_CLIENT_ID;
// const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
// const scopes = process.env.SPOTIFY_SCOPES;

const clientId = "00936e1644064525b11e53be8ccb8c74";
const redirectUri = "http://localhost:8000/callback";
const scopes = "user-library-read user-read-private";

// URL de autenticación de Spotify
// const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;

// Conectar con Spotify
document.getElementById('connectButton').addEventListener('click', () => {
    window.location = authUrl;
  });
  
  // Revisar si ya tenemos un token guardado en el localStorage
  window.addEventListener('load', () => {
    const accessToken = localStorage.getItem('access_token');
    
    if (accessToken) {
      document.getElementById('status').innerText = 'Conectado a Spotify';
      initializeSpotifyPlayer(accessToken);
    } else {
      document.getElementById('status').innerText = 'Estado: Desconectado';
    }
  });
  
  // Definir la función global `onSpotifyWebPlaybackSDKReady` antes de cargar el SDK
  window.onSpotifyWebPlaybackSDKReady = function() {
    console.log("Spotify Web Playback SDK cargado");
  };
  

// Inicializar el reproductor de Spotify con el token de acceso
function initializeSpotifyPlayer(accessToken) {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new Spotify.Player({
        name: 'Spotify Web SDK Example',
        getOAuthToken: cb => cb(accessToken),
        volume: 0.5
      });
  
    player.addListener('ready', ({ device_id }) => {
      console.log('Reproductor listo con ID:', device_id);
      document.getElementById('status').innerText = 'Reproductor listo';
    });
  
    player.addListener('initialization_error', ({ message }) => {
      console.error('Error de inicialización:', message);
      document.getElementById('status').innerText = 'Error al inicializar reproductor';
    });
  
    player.addListener('playback_error', ({ message }) => {
      console.error('Error de reproducción:', message);
      document.getElementById('status').innerText = 'Error de reproducción';
    });
  
    player.connect().then(success => {
      if (success) {
        console.log('Conectado al reproductor de Spotify');
      } else {
        console.error('No se pudo conectar al reproductor de Spotify');
        document.getElementById('status').innerText = 'No se pudo conectar al reproductor';
      }
    });
  
    // Función para reproducir una pista
    document.getElementById('playButton').addEventListener('click', () => {
      const trackURI = 'spotify:track:12VjaTNEaCfDlvW1XPZTQ9';  // URI de la canción
      player.play({ uris: [trackURI] }).then(() => {
        console.log('Pista en reproducción');
      }).catch(err => {
        console.error('Error al intentar reproducir:', err);
      });
    });
  };  }