<script setup>
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAMQNPg7xZ9WFD5PTG6gXdTq4Y-VJ-jMN8",
  authDomain: "bidbay-project.firebaseapp.com",
  projectId: "bidbay-project",
  storageBucket: "bidbay-project.appspot.com",
  messagingSenderId: "271624192364",
  appId: "1:271624192364:web:cf5200c57ea00786d7b349",
  measurementId: "G-4WMZ0T1YNE"
};

const app = initializeApp(firebaseConfig);


// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
const messaging = getMessaging();

onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
  // ...
});


getToken(messaging, { vapidKey: 'BEpzmmc04Wym0ABXEUfiJ3Gqks03sXEjIUx6Wc2MO-wjJgJnXzSDYfrsSqPLZd4zQOdOYmNo5ik4bVmyI3I4VVY' }).then((currentToken) => {
  if (currentToken) {
    // Send the token to your server and update the UI if necessary
    // ...
    console.log("Token is " + currentToken)
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    // ...
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // ...
});



</script>

<template>
  <div id="app" class="bg-gray-200">
    <router-view />
  </div>
</template>