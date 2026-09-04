import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Configuração vem do ambiente, não do código. Vale lembrar: chave web do
 * Firebase é pública por natureza — ela vai para o bundle do navegador de
 * qualquer forma. Quem protege os dados são as regras de segurança do projeto
 * e a restrição de domínio da chave no Google Cloud.
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
const clientAuth = getAuth(clientApp);
const clientDb = getFirestore(clientApp);

export { clientAuth, clientApp, clientDb };
