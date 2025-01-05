"use client";

import Image from "next/image";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { adminAuth } from "@/lib/services/firebase-admin-service";

import logo from "../../../../../public/images/logo-system.png";

import {
  IconBell,
  IconLayoutList,
  IconMenu,
  IconProgressX,
  IconLogout,
  IconHome,
} from "@tabler/icons-react";

import Footer from "@/components/Footer";
import { MenuItem } from "@/components/MenuItem";

export interface ScheduleInterface {
  id: number;
  userName: string;
  propertyId: number;
  propertyAdress: string;
  date: Date | string;
}

export default function Schedules() {
  const [openMenu, setOpenMenu] = useState(false);
  const router = useRouter();
  const [, setStatusMessage] = useState("");
  const [isLoading, setLoading] = useState(false);

  const [schedules, setSchedules] = useState<ScheduleInterface[]>([]);

  useEffect(() => {
    verifyUser();
    endLoading();
    fetchSchedules();
  }, []);

  function endLoading() {
    setTimeout(() => {
      setLoading(true);
    }, 2000);
  }

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

  function signOutUser() {
    signOut(adminAuth)
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.error("Erro ao sair:", error);
      });
  }

  function controllMenu() {
    setOpenMenu((prevState) => !prevState);
  }

  const fetchSchedules = async () => {
    try {
      const response = await axios.get("http://localhost:3002/schedules/all");
      setSchedules(response.data);
      setLoading(false);
    } catch (err) {
      setStatusMessage("Erro ao carregar dados");
      setLoading(false);
      console.error(err);
    }
  };

  const formatDate = (date: string | Date): string => {
    const formattedDate = new Date(date);
    return formattedDate
      .toLocaleString("pt-BR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(",", "");
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col justify-start items-center">
      <header className="w-full flex items-center justify-center py-3">
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
                  <MenuItem
                    icon={IconHome}
                    href="/dashboard/home"
                    text="Início"
                  />
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
      <main className="w-full max-w-[1200px] py-10 mb-32">
        <div className="flex flex-col gap-8">
          <h1 className="text-2xl font-medium text-custom-black">
            Agendamentos
          </h1>
          <div className="flex items-center gap-4">
            <button className="text-sm px-4 py-2 bg-blue-300 rounded-md text-white flex items-center gap-2">
              <IconLayoutList size={22} />
              <span>Visualizar</span>
            </button>
            <span className="text-sm px-4 py-2 text-custom-gray-light">
              Total de agendamentos: {schedules.length}
            </span>
          </div>

          {!isLoading ? (
            <SkeletonTheme baseColor="#DDDDDD" highlightColor="#c0bebe">
              <div className="w-full grid grid-cols-1  gap-4 p-8">
                <div className="w-full flex flex-col gap-2">
                  <Skeleton height={25} className="w-full" />
                  <Skeleton height={25} className="w-full" />
                  <Skeleton height={25} className="w-full" />
                  <Skeleton height={25} className="w-full" />
                </div>
              </div>
            </SkeletonTheme>
          ) : (
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#A6AEBF] text-white">
                  <th className="px-4 py-2 text-left text-xs font-medium">
                    Nome do Usuário
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium">
                    Endereço da Propriedade
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule, index) => (
                  <tr key={index} className="border-b border-gray-200 w-full">
                    <td className="px-4 py-1 text-xs">{schedule.userName}</td>
                    <td className="px-4 py-1 text-xs">
                      {schedule.propertyAdress}
                    </td>
                    <td className="px-4 py-1 text-xs">
                      {formatDate(schedule.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
