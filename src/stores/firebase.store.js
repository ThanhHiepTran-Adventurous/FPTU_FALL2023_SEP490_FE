import { defineStore } from "pinia";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getStorage, ref, uploadBytesResumable, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebaseConfig } from "@/common/urlConstant";

export const useFirebaseStore = defineStore("firebase", {
  state: () => ({
    fcmToken: "",
  }),
  actions: {
    async getFcmToken(){
        if(!this.fcmToken){
            await this.initializeFirebase();
        }
        return this.fcmToken;
    },
    async initializeFirebase(){
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
    },
    async uploadImage(imageFile) {
        const uniqueName = `${new Date().getTime()}-${imageFile.name}`
        const storage = getStorage();
        const metadata = {
            contentType: undefined
        };

        const storageRef = ref(storage, uniqueName);
        const uploadTask = await uploadBytes(storageRef, imageFile, metadata);
        return `https://firebasestorage.googleapis.com/v0/b/${uploadTask.metadata.bucket}/o/${uploadTask.metadata.fullPath}?alt=media`
    }
  },
});
