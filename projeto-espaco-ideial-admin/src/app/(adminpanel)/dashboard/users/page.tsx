"use client";

import Image from "next/image";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { adminAuth } from "@/lib/services/firebase-admin-service";
import { clientDb } from "@/lib/services/firebase-client-service";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

import logo from "../../../../../public/images/logo-system.png";

import {
  IconBell,
  IconLayoutList,
  IconMenu,
  IconPlus,
  IconProgressX,
  IconXboxX,
  IconLogout,
  IconUserPlus,
  IconDeviceFloppy,
  IconTrash,
  IconEdit,
  IconHome,
} from "@tabler/icons-react";

import Footer from "@/components/Footer";
import { MenuItem } from "@/components/MenuItem";

export interface UsersInterface {
  email: string;
  id: string;
  name: string;
  password: string;
  userId: string;
  userPfp: string;
}

export default function Home() {
  const [users, setUsers] = useState<Array<UsersInterface>>([]);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [createUserName, setCreateUserName] = useState("");
  const [createUserEmail, setCreateUserEmail] = useState("");
  const [createUserPassword, setCreateUserPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    verifyUser();
    getUsersDoc();
    endLoading();
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

  function controllMenu() {
    setOpenMenu((prevState) => !prevState);
  }

  async function getUsersDoc() {
    const querySnapshot = await getDocs(collection(clientDb, "users"));
    const users = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email || "",
        name: data.name || "",
        password: data.password || "",
        userId: data.userId || "",
        userPfp: data.userPfp || "",
      };
    });
    setUsers(users as UsersInterface[]);
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

  function controlEditForm(id: string, name: string, email: string) {
    console.log(name);
    setUserId(id);
    setNewUserName(name);
    setNewUserEmail(email);
    setOpenEditForm((prev) => !prev);
  }

  const updateUserName = async (userId: string, newName: string) => {
    try {
      const userRef = doc(clientDb, "users", userId);

      await updateDoc(userRef, {
        name: newName,
      });

      await updateUserRegister(userId);

      console.log("Nome do usuário atualizado com sucesso!");
      window.location.reload();
    } catch (error) {
      console.error("Erro ao atualizar o nome do usuário:", error);
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          createUserName,
          createUserEmail,
          createUserPassword,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatusMessage("Registrando ...");
        await createUserRegister(
          result.id,
          result.firebaseId,
          result.name,
          result.email,
          result.password
        );
        window.location.reload();
      } else {
        setStatusMessage(result.error || "Erro ao criar usuário.");
      }
    } catch (error: unknown) {
      let errorMessage = "Ocorreu um erro ao criar usuário.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setStatusMessage(errorMessage);
    }
  }

  async function createUserRegister(
    id: string,
    firebaseId: string,
    userName: string,
    userEmail: string,
    userPassword: string
  ) {
    await fetch("http://localhost:3002/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        firebaseId: firebaseId,
        nome: userName,
        email: userEmail,
        senha: userPassword,
      }),
    });
  }

  async function updateUserRegister(id: string | null) {
    await fetch(`http://localhost:3002/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: newUserName,
      }),
    });
  }

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
                  <MenuItem icon={IconHome} href="/dashboard/home" text="Início"/>
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
            Gerenciar Usuários
          </h1>
          <div className="flex items-center gap-4">
            <button className="text-sm px-4 py-2 bg-blue-300 rounded-md text-white flex items-center gap-2">
              <IconLayoutList size={22} />
              <span>Visualizar</span>
            </button>
            <button
              onClick={() => {
                setOpenCreateForm((prev) => !prev);
                setOpenEditForm(false);
              }}
              className="text-sm px-4 py-2 bg-green-500 rounded-md text-white  flex items-center gap-2 "
            >
              <IconPlus size={22} />
              <span>Criar novo</span>
            </button>
            <span className="text-sm px-4 py-2 text-custom-gray-light">
              Total cadastrado: {users.length}
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
                    ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium">
                    Nome
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium">
                    Email
                  </th>
                  <th className="px-4 py-2 text-center text-xs font-medium">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-200 w-full">
                    <td className="px-4 py-1 text-xs">{user.id}</td>
                    <td className="px-4 py-1 text-xs">{user.name}</td>
                    <td className="px-4 py-1 text-xs">{user.email}</td>
                    <td className="px-4 py-1">
                      <div className="flex items-center justify-center gap-4">
                        <button className="p-2 flex items-center gap-2 rounded-md">
                          <IconTrash size={20} color="#A6AEBF" />
                        </button>
                        <button
                          onClick={() => {
                            controlEditForm(user.id, user.name, user.email);
                            setOpenCreateForm(false);
                          }}
                          className="p-2 flex items-center gap-2 rounded-md"
                        >
                          <IconEdit size={20} color="#37AFE1" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {openEditForm && (
            <div className="fixed w-[800px] h-fit top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
              <div className="relative w-full mx-auto">
                <div className="w-full">
                  <div className="w-full rounded-lg bg-white p-8 -shadowlg lg:p-12">
                    <div className="mb-4">
                      <span className="text-sm">
                        Editando usuário{" "}
                        <strong className="font-medium text-custom-gray-light">
                          ID: {userId}
                        </strong>
                      </span>
                    </div>
                    <form action="#" className="space-y-4">
                      <div>
                        <label className="sr-only" htmlFor="name">
                          Nome
                        </label>
                        <input
                          className="w-full rounded-lg border-gray-200 p-3 text-sm"
                          placeholder="Nome"
                          type="text"
                          id="name"
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="sr-only" htmlFor="email">
                            Email
                          </label>
                          <input
                            className="w-full rounded-lg border-gray-200 p-3 text-sm placeholder-custom-gray-strong"
                            placeholder={newUserEmail}
                            type="email"
                            id="email"
                            disabled
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-4">
                        <button
                          type="submit"
                          className="flex items-center gap-2 w-full rounded-lg bg-blue-400 px-4 py-2 font-medium text-white sm:w-auto"
                          onClick={(e) => {
                            e.preventDefault();
                            updateUserName(userId, newUserName);
                          }}
                        >
                          <IconDeviceFloppy size={20} />
                          <span className="text-sm">Salvar</span>
                        </button>
                        <button
                          className="flex items-center gap-2 w-full rounded-lg bg-red-400 px-4 py-2 font-medium text-white sm:w-auto"
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenEditForm(false);
                          }}
                        >
                          <IconXboxX size={20} />
                          <span className="text-sm">Cancelar</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {openCreateForm && (
            <div className="fixed w-[800px] rounded-lg bg-white p-8 shadow-lg lg:p-12  h-fit top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 ">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm">Cadastrando novo usuário</span>
                <span className="text-center text-xs text-red-500">
                  {statusMessage}
                </span>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
                className="w-full flex flex-col items-start justify-center gap-2"
              >
                <div className="relative flex w-full">
                  <input
                    className="w-full rounded-lg border-gray-200 p-3 text-sm"
                    type="text"
                    placeholder="Nome completo"
                    value={createUserName}
                    onChange={(e) => setCreateUserName(e.target.value)}
                  />
                </div>
                <div className="relative flex w-full">
                  <input
                    className="w-full rounded-lg border-gray-200 p-3 text-sm"
                    type="email"
                    placeholder="Email"
                    value={createUserEmail}
                    onChange={(e) => setCreateUserEmail(e.target.value)}
                  />
                </div>
                <div className="relative flex w-full">
                  <input
                    className="w-full rounded-lg border-gray-200 p-3 text-sm"
                    type="text"
                    placeholder="Senha"
                    value={createUserPassword}
                    onChange={(e) => setCreateUserPassword(e.target.value)}
                  />
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 w-full rounded-lg bg-blue-400 px-4 py-2 font-medium text-white sm:w-auto"
                  >
                    <IconUserPlus size={20} />
                    <span className="text-sm">cadastrar</span>
                  </button>
                  <button
                    className="flex items-center gap-2 w-full rounded-lg bg-red-400 px-4 py-2 font-medium text-white sm:w-auto"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenCreateForm(false);
                    }}
                  >
                    <IconXboxX size={20} />
                    <span className="text-sm">Cancelar</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
