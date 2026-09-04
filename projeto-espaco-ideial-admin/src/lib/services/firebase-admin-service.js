import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/**
 * O painel usa um projeto Firebase próprio, separado do site. Configuração vem
 * do ambiente — a chave web é pública por natureza e chega ao navegador de
 * qualquer forma; quem protege são as regras do projeto e a restrição de
 * domínio da chave.
 */
const firebaseAdminConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_ADMIN_APP_ID,
};

const adminApp = initializeApp(firebaseAdminConfig, "adminApp");
const adminAuth = getAuth(adminApp);

export { adminAuth, adminApp };
