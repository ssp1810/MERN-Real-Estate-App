// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-app-b4996.firebaseapp.com",
  projectId: "mern-estate-app-b4996",
  storageBucket: "mern-estate-app-b4996.appspot.com",
  messagingSenderId: "568047600585",
  appId: "1:568047600585:web:ff937508ec0eeaaa475e18"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);