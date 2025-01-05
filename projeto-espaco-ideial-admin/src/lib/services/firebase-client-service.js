import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseClientConfig = {
  apiKey: "AIzaSyD9W-7t6GHStl66RLOK3xIsqBFB9oGibRw",
  authDomain: "espaco-ideal-auth-storage.firebaseapp.com",
  projectId: "espaco-ideal-auth-storage",
  storageBucket: "espaco-ideal-auth-storage.appspot.com",
  messagingSenderId: "509857918913",
  appId: "1:509857918913:web:be02935317eb65feb40940",
};

const clientApp = initializeApp(firebaseClientConfig);
const clientDb = getFirestore(clientApp);
const clientAuth = getAuth(clientApp);
const clientStorage = getStorage(clientApp);

export { clientApp, clientDb, clientAuth, clientStorage };
