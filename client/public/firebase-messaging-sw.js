/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDihrz1C5m5pXfiWqKFCesRpdy45UitHWk",
  authDomain: "smart-door-emergency-web-app.firebaseapp.com",
  projectId: "smart-door-emergency-web-app",
  storageBucket: "smart-door-emergency-web-app.firebasestorage.app",
  messagingSenderId: "193460418477",
  appId: "1:193460418477:web:352af6d041ac34ed659324",
  measurementId: "G-SM8TG7PXBR",
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
