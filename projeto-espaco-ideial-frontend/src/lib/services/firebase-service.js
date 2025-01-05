import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseClientConfig = {
  apiKey: "AIzaSyD9W-7t6GHStl66RLOK3xIsqBFB9oGibRw",
  authDomain: "espaco-ideal-auth-storage.firebaseapp.com",
  projectId: "espaco-ideal-auth-storage",
  storageBucket: "espaco-ideal-auth-storage.appspot.com",
  messagingSenderId: "509857918913",
  appId: "1:509857918913:web:be02935317eb65feb40940",
};

const clientApp = initializeApp(firebaseClientConfig);
const clientAuth = getAuth(clientApp);
const clientDb = getFirestore(clientApp);

export { clientAuth, clientApp, clientDb };