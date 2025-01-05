import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseAdminConfig = {
  apiKey: "AIzaSyBYLCEa5MfJ4BOkCHkSpmejVhVSEEeChiA",
  authDomain: "espaco-ideal-auth-admin.firebaseapp.com",
  projectId: "espaco-ideal-auth-admin",
  storageBucket: "espaco-ideal-auth-admin.firebasestorage.app",
  messagingSenderId: "280103354141",
  appId: "1:280103354141:web:d933f84ab873adf7ed2bf4",
};

const adminApp = initializeApp(firebaseAdminConfig, "adminApp");
const adminAuth = getAuth(adminApp);

export { adminAuth, adminApp };