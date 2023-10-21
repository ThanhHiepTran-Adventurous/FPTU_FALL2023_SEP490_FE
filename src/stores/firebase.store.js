import { defineStore } from "pinia";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, deleteToken } from "firebase/messaging";

export const useFirebaseStore = defineStore("firebase", {
  state: () => ({
    fcmToken: ""
  }),
  actions: {
    async getFcmToken(){
        if(!this.fcmToken){
            await this.initializeFirebase();
        }
        return this.fcmToken;
    },
    async initializeFirebase(){
        const firebaseConfig = {
            apiKey: "AIzaSyAMQNPg7xZ9WFD5PTG6gXdTq4Y-VJ-jMN8",
            authDomain: "bidbay-project.firebaseapp.com",
            projectId: "bidbay-project",
            storageBucket: "bidbay-project.appspot.com",
            messagingSenderId: "271624192364",
            appId: "1:271624192364:web:cf5200c57ea00786d7b349",
            measurementId: "G-4WMZ0T1YNE"
        };
        
        initializeApp(firebaseConfig);
        
        const messaging = getMessaging();

        await getToken(messaging, { vapidKey: 'BEpzmmc04Wym0ABXEUfiJ3Gqks03sXEjIUx6Wc2MO-wjJgJnXzSDYfrsSqPLZd4zQOdOYmNo5ik4bVmyI3I4VVY' }).then((currentToken) => {
        if (currentToken) {
            this.fcmToken  = currentToken;
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
    },
    onFirebaseMessage(handler) {
        const messaging = getMessaging();
        
        onMessage(messaging, (payload) => {
        console.log('Message received. ', payload);
        handler(payload)
        });
    }
  },
});
