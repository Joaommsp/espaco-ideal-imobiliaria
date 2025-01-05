"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { clientAuth, clientDb } from "@/lib/services/firebase-service"; // Ensure this path is correct
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<{
  userName: string | null;
  userData: object | null;
}>({
  userName: null,
  userData: null,
});

export function AuthProvider(props: AuthProviderProps) {
  const [userName, setUserName] = useState<string | null>(null);
  const [userData, setUserData] = useState<object | null>(null);

  useEffect(() => {
    verifyUser();
  }, []);

  function verifyUser() {
    onAuthStateChanged(clientAuth, async (user) => {
      if (user) {
        console.log("user aqui: ", user);
        await getUserData(user.uid);
      } else {
        console.log("usuário nao logado");
        setUserName(null);
        setUserData(null);
        return null;
      }
    });
  }

  async function getUserData(userId: string) {
    const q = query(collection(clientDb, "users"), where("userId", "==", userId));

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      const userFistName = getUserFirstName(doc.data().name);
      setUserName(userFistName);
      setUserData(doc.data());
    });
  }

  function getUserFirstName(fullname: string) {
    const names = fullname.split(" ");
    const firstName = names[0];

    return firstName;
  }

  return (
    <AuthContext.Provider value={{ userName, userData }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
