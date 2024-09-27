
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";


const firebaseConfig = {
  apiKey: "AIzaSyASFUTRAMwIpDitAguBzsDrTpDQP0r8KsI",
  authDomain: "gradedlab5-d32e0.firebaseapp.com",
  projectId: "gradedlab5-d32e0",
  storageBucket: "gradedlab5-d32e0.appspot.com",
  messagingSenderId: "235375196816",
  appId: "1:235375196816:web:05cbbf57bce5bbe3a03615",
};


const app = initializeApp(firebaseConfig);


const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});


const db = getFirestore(app);

export { auth, db };
