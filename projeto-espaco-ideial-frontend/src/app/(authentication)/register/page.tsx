"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  IconUser,
  IconMail,
  IconEye,
  IconEyeOff,
  IconExclamationCircleFilled,
} from "@tabler/icons-react";

import Logo from "../../../../public/images/logo-dark.svg";
import nextj_logo from "../../../../public/icons/nextjs-fill-svgrepo-com.svg";
import nestj_logo from "../../../../public/icons/nestjs-svgrepo-com.svg";
import tailwind_logo from "../../../../public/icons/tailwind-svgrepo-com.svg";
import postgres_logo from "../../../../public/icons/postgresql-svgrepo-com.svg";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          userEmail,
          userPassword,
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
        router.push("/login");
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
  function changePasswordVisibility(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();

    setPasswordVisibility((prev) => !prev);
  }

  return (
    <div className="w-full overflow-hidden h-full min-h-screen bg-register-pattern bg-cover bg-no-repeat bg-center flex items-center justify-center text-sm ">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="flex flex-col w-full items-center gap-8 pt-28 px-2"
      >
        <Image
          src={Logo}
          width={224}
          alt="..."
          className="w-[84px] md:w-[124px]"
        />
        {/* Falta o "onSubmit" */}
        <div className="w-full flex flex-col items-center gap-4">
          <span className="text-lg md:text-xl font-medium text-custom-black text-center">
            Faça seu cadastro
          </span>
          <p className="text-custom-black text-center text-xs md:text-base">
            Cadastre-se agora para ter acesso exclusivo aos melhores imóveis{" "}
            <br />
            disponíveis no mercado.
          </p>
        </div>
        <div
          className=" text-center
        min-h-full h-10 md:h-5 mb-4 md:mb-0
        "
        >
          {statusMessage != "" ? (
            <span className="flex flex-col md:flex-row items-center gap-2 text-red-500 text-xs font-medium">
              <IconExclamationCircleFilled size={24} color="#ef4444" />
              {statusMessage}
            </span>
          ) : null}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
          className="w-full sm:w-fit flex flex-col items-center gap-2 sm:min-w-[400px]"
        >
          <div className="relative flex w-full">
            <input
              className="py-2 w-full text-sm md:text-base px-4 pr-8 md:min-w-[400px] bg-white-secondary text-custom-black rounded-md outline-none border-2 border-transparent focus:border-2 focus:border-orange-primary placeholder:font-light placeholder:text-custom-gray-light"
              type="text"
              placeholder="Nome completo"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <IconUser
              className="absolute top-1/2 right-2 transform -translate-y-1/2"
              size={24}
              color="#4B4B4B"
            />
          </div>
          <div className="relative flex w-full">
            <input
              className="py-2 w-full text-sm md:text-base px-4 md:min-w-[400px] bg-white-secondary text-custom-black rounded-md outline-none border-2 border-transparent focus:border-2 focus:border-orange-primary placeholder:font-light placeholder:text-custom-gray-light"
              type="email"
              placeholder="Email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
            <IconMail
              className="absolute top-1/2 right-2 transform -translate-y-1/2"
              size={24}
              color="#4B4B4B"
            />
          </div>
          <div className="relative flex w-full">
            <input
              className="py-2 w-full text-sm md:text-base px-4 md:min-w-[400px] bg-white-secondary text-custom-black rounded-md outline-none border-2 border-transparent focus:border-2 focus:border-orange-primary placeholder:font-light placeholder:text-custom-gray-light"
              type={passwordVisibility ? "text" : "password"}
              placeholder="Senha"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={(e) => changePasswordVisibility(e)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2"
            >
              {passwordVisibility ? (
                <IconEyeOff size={24} color="#4B4B4B" />
              ) : (
                <IconEye size={24} color="#4B4B4B" />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="uppercase text-sm px-4 py-2 w-full bg-orange-primary rounded-md text-white-secondary my-2 font-medium"
          >
            cadastrar
          </button>
          <span className="block my-2 text-xs text-custom-black">
            Já possui uma conta?
            <Link className="font-medium" href={"/login"}>
              {" "}
              Faça Login
            </Link>
          </span>
        </form>

        <div className="bg-custom-white p-3 md:p-4 rounded-full flex items-center justify-center gap-8 mb-16 shadow-md">
          <Image
            className="rotate-in-center w-6 md:w-7  "
            src={nextj_logo}
            width={24}
            alt="..."
          />
          <Image
            className="rotate-in-center w-6 md:w-7 "
            src={nestj_logo}
            width={24}
            alt="..."
          />
          <Image
            className="rotate-in-center w-6 md:w-7 "
            src={postgres_logo}
            width={24}
            alt="..."
          />
          <Image
            className="rotate-in-center w-6 md:w-7 "
            src={tailwind_logo}
            width={24}
            alt="..."
          />
        </div>
      </motion.div>
    </div>
  );
}
