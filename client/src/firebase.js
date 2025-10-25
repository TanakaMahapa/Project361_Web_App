// firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDihrz1C5m5pXfiWqKFCesRpdy45UitHWk",
  authDomain: "smart-door-emergency-web-app.firebaseapp.com",
  projectId: "smart-door-emergency-web-app",
  storageBucket: "smart-door-emergency-web-app.firebasestorage.app",
  messagingSenderId: "193460418477",
  appId: "1:193460418477:web:352af6d041ac34ed659324",
  measurementId: "G-SM8TG7PXBR"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Optional analytics (can be removed if not used)
getAnalytics(app);

// Initialize Firebase Messaging
const messaging = getMessaging(app);

// Request permission + return token
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BD4aa6pDKIdmKtUwtwJvmUSmgt42B5s_MsdjtJKHxG9ALymDi5-A8ikSo40eoNFBuLER6t5IaSU0uc6Km6Rpfbg", 
      });
      console.log("FCM Token:", token);
      return token;
    } else {
      console.log("Notification permission not granted");
    }
  } catch (err) {
    console.error("Error getting FCM token", err);
  }
};

// Export everything you’ll need
export { messaging, onMessage };


