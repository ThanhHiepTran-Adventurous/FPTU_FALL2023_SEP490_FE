importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyAMQNPg7xZ9WFD5PTG6gXdTq4Y-VJ-jMN8",
    authDomain: "bidbay-project.firebaseapp.com",
    projectId: "bidbay-project",
    storageBucket: "bidbay-project.appspot.com",
    messagingSenderId: "271624192364",
    appId: "1:271624192364:web:cf5200c57ea00786d7b349",
    measurementId: "G-4WMZ0T1YNE"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
      '[firebase-messaging-sw.js] Received background message ',
      payload
    );
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: '/favicon.ico'
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
  });