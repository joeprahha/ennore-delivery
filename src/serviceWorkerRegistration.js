// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://cra.link/PWA

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator && 'PushManager' in window) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    
    // Service worker won't work if PUBLIC_URL is on a different origin
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // For localhost, check if service worker is valid
        checkValidServiceWorker(swUrl, config);

        // Add logging for development environment
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit https://cra.link/PWA'
          );
        });
      } else {
        // For production environments, register valid service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

// Function to register the valid service worker
function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);

      // Detect when new content is available
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Notify user that a new version is available
              if (config && config.onUpdate) {
                config.onUpdate(registration); // Call the provided onUpdate callback
              }
            }
          };
        }
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

// Function to check if the service worker is valid on localhost
function checkValidServiceWorker(swUrl, config) {
  // Check if service worker exists and is valid
  fetch(swUrl)
    .then((response) => {
      // If the service worker is found, it is valid
      if (response.status === 404 || response.type === 'opaquer') {
        // Service worker not found or file is not accessible
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister();
        });
      } else {
        // Service worker found, register it
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
}


export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
