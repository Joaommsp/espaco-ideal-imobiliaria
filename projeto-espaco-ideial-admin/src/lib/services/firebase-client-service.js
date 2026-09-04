import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

/**
 * Projeto Firebase dos clientes, acessado pelo painel para ler os dados de
 * quem se cadastrou no site. Configuração vem do ambiente.
 */
const firebaseClientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const clientApp = initializeApp(firebaseClientConfig);
const clientDb = getFirestore(clientApp);
const clientAuth = getAuth(clientApp);
const clientStorage = getStorage(clientApp);

export { clientApp, clientDb, clientAuth, clientStorage };
