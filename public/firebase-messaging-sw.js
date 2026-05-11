// M0.5 — Merged FCM + next-pwa service worker
// This single file handles BOTH FCM background messages AND next-pwa workbox precaching
// CRITICAL: next-pwa must be configured to use this file as the SW (sw: 'firebase-messaging-sw.js')

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js')

// Firebase config — these are public-safe NEXT_PUBLIC_ values
// TODO: Replace with actual values before deploying (injected at build time)
firebase.initializeApp({
  apiKey: self.__WB_FIREBASE_API_KEY__,
  projectId: self.__WB_FIREBASE_PROJECT_ID__,
  messagingSenderId: self.__WB_FIREBASE_MESSAGING_SENDER_ID__,
  appId: self.__WB_FIREBASE_APP_ID__,
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification ?? {}
  self.registration.showNotification(title ?? 'TradeLog', {
    body: body ?? '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: payload.data,
  })
})

// next-pwa workbox precache manifest is injected here at build time
self.__WB_MANIFEST
