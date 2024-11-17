const clientId = "00936e1644064525b11e53be8ccb8c74";
const redirectUri = "http://localhost:8000/callback";
const scopes = "streaming user-library-read user-read-private user-read-playback-state user-modify-playback-state";

// URL de autenticación de Spotify
const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;

// Botón de conexión
document.getElementById('connectButton').addEventListener('click', () => {
  window.location = authUrl;
});

// Revisar token en el localStorage
window.addEventListener('load', () => {
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    document.getElementById('status').innerText = 'Conectado a Spotify';
    initializeSpotifyPlayer(accessToken);
  } else {
    document.getElementById('status').innerText = 'Desconectado';
  }
});

// Inicializar reproductor
function initializeSpotifyPlayer(accessToken) {
  const player = new Spotify.Player({
    name: 'Spotify Web SDK Example',
    getOAuthToken: cb => cb(accessToken),
    volume: 0.5
  });

  player.addListener('ready', ({ device_id }) => {
    console.log('Reproductor listo con ID:', device_id);
    document.getElementById('status').innerText = 'Reproductor listo';
    window.deviceId = device_id;
  });

  player.addListener('initialization_error', ({ message }) => {
    console.error('Error de inicialización:', message);
  });

  player.addListener('playback_error', ({ message }) => {
    console.error('Error de reproducción:', message);
  });

  player.connect().then(success => {
    if (success) {
      console.log('Conectado al reproductor de Spotify');
    }
  });

  // Botón para reproducir
  document.getElementById('playButton').addEventListener('click', () => {
    const trackURI = 'spotify:track:12VjaTNEaCfDlvW1XPZTQ9';
    const deviceId = window.deviceId;
    if (deviceId) {
      playTrack(deviceId, trackURI, accessToken);
    } else {
      console.error('Device ID no está disponible');
    }
  });
}

// Función para reproducir una pista
function playTrack(deviceId, trackUri, accessToken) {
  fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ uris: [trackUri] })
  }).then(response => {
    if (response.ok) {
      console.log('Pista en reproducción:', trackUri);
    } else {
      console.error('Error al reproducir la pista:', response.status, response.statusText);
    }
  }).catch(err => console.error('Error en la solicitud de reproducción:', err));
}
