"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { AuthProvider } from "../contexts/AuthContext";
import { Cabecalho } from "@/components/landing/Cabecalho";
import { Rodape } from "@/components/landing/Rodape";

import { clientAuth, clientDb } from "@/lib/services/firebase-service";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

import { useRouter } from "next/navigation";

import Logo from "../../../public/images/logo-full-horizontal-dark.png";
import {
  IconMenuDeep,
  IconProgressX,
  IconUserCircle,
  IconLogout,
  IconUserShare,
  IconUserPlus,
  IconHomeDollar,
  IconCalendarMonth,
  IconPlaylistAdd,
} from "@tabler/icons-react";
import Link from "next/link";
import { MenuItem } from "@/components/MenuItem";

export interface AuthenticationLayoutProps {
  children: ReactNode;
}

export default function AuthenticationLayout(props: AuthenticationLayoutProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    verifyUser();
  }, []);

  function verifyUser() {
    onAuthStateChanged(clientAuth, async (user) => {
      if (user) {
        console.log("Usuário autenticado: ", user);
        await getUserData(user.uid);
        setIsLoggedIn(true);
      } else {
        console.log("Usuário não autenticado ou sessão expirada.");
        setIsLoggedIn(false);
        setUserName("");
      }
    });
  }

  async function getUserData(userId: string) {
    const q = query(
      collection(clientDb, "users"),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      const userFistName = getUserFirstName(doc.data().name);
      setUserName(userFistName);
    });
  }

  function getUserFirstName(fullname: string) {
    const names = fullname.split(" ");
    const firstName = names[0];

    return firstName;
  }

  function controllMenu() {
    setOpenMenu((prevState) => !prevState);
  }

  function signOutUser() {
    setStatusMessage("Saindo ...");
    signOut(clientAuth)
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.error("Erro ao sair:", error);
        setStatusMessage("Erro ao sair.");
      });
  }

  return (
    <div className="relative overflow-hidden">
      <Cabecalho
        tom="claro"
        usuario={isLoggedIn ? String(userName ?? "") : null}
        acaoDeUsuario={
          <button
            onClick={controllMenu}
            aria-label="Abrir o menu"
            className="grid size-10 place-items-center rounded-full text-tinta transition-colors hover:bg-areia-escura"
          >
            <IconMenuDeep size={22} />
          </button>
        }
      />

      <AnimatePresence>
        {openMenu && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 z-50 w-72 h-full min-h-screen bg-white-secondary p-4 shadow-2xl flex flex-col items-end"
          >
            <div className="w-full flex items-center justify-between mb-8">
              <span>Menu</span>
              <button
                onClick={controllMenu}
                className="hover:scale-110 transition ease-in-out"
              >
                <IconProgressX size={24} color="#141414" />
              </button>
            </div>
            {isLoggedIn && (
              <span className="text-sm text-custom-black font-medium uppercase block mb-8">
                Bem vindo, <span className="text-custom-black">{userName}</span>
              </span>
            )}
            <div className="w-full h-full  flex flex-col justify-between">
              <div className="flex flex-col gap-2">
                {isLoggedIn && (
                  <ul className="w-full flex flex-col text-base text-custom-black gap-2">
                    <MenuItem
                      text="Meu perfil"
                      href="/profile"
                      icon={IconUserCircle}
                    />
                  </ul>
                )}
                <ul className="w-full flex flex-col text-base text-custom-black gap-2">
                  {!isLoggedIn && (
                    <>
                      <MenuItem
                        text="Fazer login"
                        href="/login"
                        icon={IconUserShare}
                      />
                      <MenuItem
                        text="Crie sua conta"
                        href="/register"
                        icon={IconUserPlus}
                      />
                    </>
                  )}
                  <MenuItem text="Vendas" href="" icon={IconHomeDollar} />
                  <MenuItem text="Aluguéis" href="" icon={IconCalendarMonth} />
                  <MenuItem text="Contato" href="" icon={IconPlaylistAdd} />
                  {isLoggedIn && (
                    <li className="flex items-center justify-between w-full">
                      <button
                        onClick={signOutUser}
                        className="text-red-500 flex items-center justify-between  w-full p-2 hover:bg-gray-200 p-2 rounded-md"
                      >
                        <IconLogout size={24} />
                        <span>Sair</span>
                      </button>
                    </li>
                  )}
                </ul>
              </div>
              <div className="h-7 flex items-center justify-center">
                <span className="text-red-500 capitalize text-sm">
                  {statusMessage}
                </span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      <AuthProvider>
        <main>{props.children}</main>
      </AuthProvider>
    </div>
  );
}
