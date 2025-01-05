"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { adminAuth } from "@/lib/services/firebase-admin-service";
import { AnimatePresence, motion } from "framer-motion";
import { IconBell, IconMenu, IconProgressX } from "@tabler/icons-react";

import logo from "../../../../../public/images/logo-system.png";
import userPanel from "../../../../../public/images/user_panel.png";
import propertiesPanel from "../../../../../public/images/properties_panel.png";
import schedulesPanel from "../../../../../public/images/schedule_panel.png";
import Footer from "@/components/Footer";

import { IconLogout } from "@tabler/icons-react";

export default function Home() {
  const [openMenu, setOpenMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    verifyUser();
  }, []);

  function verifyUser() {
    onAuthStateChanged(adminAuth, async (user) => {
      if (user) {
        console.log("Usuário autenticado: ", user);
      } else {
        console.log("Usuário não autenticado ou sessão expirada.");
        router.push("/");
      }
    });
  }

  function controllMenu() {
    setOpenMenu((prevState) => !prevState);
  }

  function signOutUser() {
    signOut(adminAuth)
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.error("Erro ao sair:", error);
      });
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col justify-start items-center">
      <header className="w-full flex items-center justify-center py-2">
        <div className="w-full max-w-[1200px] flex justify-between items-center border-b-2">
          <Image src={logo} alt="..." width={1000} className="w-[200px]" />
          <div className="flex items-center gap-4">
            <button>
              <IconBell size={24} color="#1b1b1b" />
            </button>
            <Image
              src="https://images.unsplash.com/photo-1540066019607-e5f69323a8dc?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              width={500}
              height={500}
              className="w-[35px] h-[35px] object-cover rounded-full"
              alt="..."
            />
            <button
              onClick={controllMenu}
              className="hover:scale-110 transition ease-in-out"
            >
              <IconMenu size={24} color="#141414" />
            </button>
          </div>
        </div>
      </header>
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
            <div className="w-full h-full  flex flex-col justify-between">
              <div className="flex flex-col gap-2">
                <ul className="w-full flex flex-col text-base text-custom-black gap-2">
                  <li className="flex items-center justify-between w-full">
                    <button
                      onClick={signOutUser}
                      className="text-red-500 flex items-center justify-between  w-full  hover:bg-gray-200 p-2 rounded-md"
                    >
                      <IconLogout size={24} />
                      <span>Sair</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      <main className="w-full min-h-screen  max-w-[1200px] py-10">
        <div className="flex flex-col gap-8">
          <h1 className="text-2xl font-medium text-custom-black">
            Garenciamento
          </h1>
          <div className="flex items-center gap-4">
            <Link href={"/dashboard/users"}>
              <div className="relative  w-[250px] h-[150px] rounded-md">
                <Image
                  src={userPanel}
                  width={1000}
                  alt="..."
                  className="w-full h-full object-cover rounded-md"
                />
                <div className="flex flex-col justify-end p-4 absolute top-0 w-full h-full bg-[#00000050] rounded-md">
                  <span className="text-sm text-gray-50 font-medium">
                    Usuários
                  </span>
                  <span className="text-sm text-gray-50 font-light">
                    Garenciar usuários
                  </span>
                </div>
              </div>
            </Link>
            <Link href={"/dashboard/properties"}>
              <div className="relative w-[250px] h-[150px] rounded-md">
                <Image
                  src={propertiesPanel}
                  width={1000}
                  alt="..."
                  className="w-full h-full object-cover rounded-md"
                />
                <div className="flex flex-col justify-end p-4 absolute top-0 w-full h-full bg-[#00000050] rounded-md">
                  <span className="text-sm text-gray-50 font-medium">
                    Propriedades
                  </span>
                  <span className="text-sm text-gray-50 font-light">
                    Garenciar Propriedades
                  </span>
                </div>
              </div>
            </Link>
            <Link href={"/dashboard/schedules"}>
              <div className="relative w-[250px] h-[150px] rounded-md">
                <Image
                  src={schedulesPanel}
                  width={1000}
                  alt="..."
                  className="w-full h-full object-cover rounded-md"
                />
                <div className="flex flex-col justify-end p-4 absolute top-0 w-full h-full bg-[#00000050] rounded-md">
                  <span className="text-sm text-gray-50 font-medium">
                    Agendamentos
                  </span>
                  <span className="text-sm text-gray-50 font-light">
                    Garenciar Agendamentos
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
