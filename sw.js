// Service Worker para Trigal CRM MVP
// Versión PWA para funcionamiento offline

const CACHE_NAME = 'trigal-crm-v1.0.0-mvp';
const urlsToCache = [
  '/',
  '/mvp-index.html',
  '/mvp-styles.css',
  '/mvp-script.js',
  '/mvp-script-extended.js',
  // CDN recursos externos - cacheamos para offline
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('🌽 Trigal CRM - Service Worker instalándose...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Error cacheando recursos:', error);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('🌽 Trigal CRM - Service Worker activándose...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache anterior:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar solicitudes de red
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Estrategias de cache diferentes según el tipo de recurso
  if (event.request.url.includes('/api/')) {
    // Para API: Network First (siempre intentar red primero)
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Si es exitoso, guardar en cache
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Si falla la red, intentar cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Respuesta offline para API
            return new Response(
              JSON.stringify({
                success: false,
                message: 'Sin conexión a internet',
                offline: true
              }),
              {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'application/json' }
              }
            );
          });
        })
    );
  } else {
    // Para recursos estáticos: Cache First
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Si está en cache, devolverlo
          if (response) {
            return response;
          }
          
          // Si no está en cache, ir a la red
          return fetch(event.request)
            .then((response) => {
              // Verificar si es una respuesta válida
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              // Clonar la respuesta para guardarla en cache
              const responseToCache = response.clone();
              
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
              
              return response;
            })
            .catch(() => {
              // Si falla todo, mostrar página offline básica
              if (event.request.destination === 'document') {
                return new Response(`
                  <!DOCTYPE html>
                  <html lang="es">
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Trigal CRM - Sin Conexión</title>
                    <style>
                      body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        margin: 0;
                        background: linear-gradient(135deg, #2563eb 0%, #10b981 100%);
                        color: white;
                        text-align: center;
                        padding: 20px;
                      }
                      .offline-container {
                        background: rgba(255, 255, 255, 0.1);
                        padding: 40px;
                        border-radius: 20px;
                        backdrop-filter: blur(10px);
                      }
                      .logo { font-size: 4rem; margin-bottom: 20px; }
                      h1 { font-size: 2rem; margin-bottom: 10px; }
                      p { font-size: 1.125rem; margin-bottom: 30px; opacity: 0.9; }
                      button {
                        background: white;
                        color: #2563eb;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 10px;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: transform 0.2s;
                      }
                      button:hover { transform: translateY(-2px); }
                    </style>
                  </head>
                  <body>
                    <div class="offline-container">
                      <div class="logo">🌽</div>
                      <h1>Trigal CRM</h1>
                      <p>Sin conexión a internet</p>
                      <p>Verifica tu conexión e intenta nuevamente</p>
                      <button onclick="window.location.reload()">Reintentar</button>
                    </div>
                  </body>
                  </html>
                `, {
                  headers: { 'Content-Type': 'text/html' }
                });
              }
            });
        })
    );
  }
});

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notificaciones push (para futuras implementaciones)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación de Trigal CRM',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver detalles',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('🌽 Trigal CRM', options)
  );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/mvp-index.html')
    );
  }
});

// Sincronización en background (para envío de datos offline)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  try {
    // Aquí implementarías la lógica para sincronizar datos
    // cuando se recupere la conexión
    console.log('Sincronizando datos offline...');
    
    // Ejemplo: obtener datos pendientes del IndexedDB
    // y enviarlos al servidor
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error en sincronización:', error);
    return Promise.reject(error);
  }
}
