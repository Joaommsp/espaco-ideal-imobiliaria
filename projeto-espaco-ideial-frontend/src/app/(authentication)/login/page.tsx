"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  IconMail,
  IconEye,
  IconEyeOff,
  IconExclamationCircleFilled,
} from "@tabler/icons-react";

import { clientAuth } from "@/lib/services/firebase-service";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

import Logo from "../../../../public/images/logo-dark.svg";
import nextj_logo from "../../../../public/icons/nextjs-fill-svgrepo-com.svg";
import nestj_logo from "../../../../public/icons/nestjs-svgrepo-com.svg";
import tailwind_logo from "../../../../public/icons/tailwind-svgrepo-com.svg";
import postgres_logo from "../../../../public/icons/postgresql-svgrepo-com.svg";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const router = useRouter();

  useEffect(() => {
    verifyUser();
  }, []);

  function verifyUser() {
    onAuthStateChanged(clientAuth, (user) => {
      if (user) {
        router.push("/home");
      } else {
        return null;
      }
    });
  }

  function login() {
    signInWithEmailAndPassword(clientAuth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setStatusMessage(`Entrando como ${user.email}`);
        router.push("/home");
      })
      .catch((error) => {
        if (error instanceof Error) {
          console.error(error);
          const formattedErrorMessage = error.message.replace(
            /Firebase:\s*/i,
            ""
          );
          setStatusMessage(formattedErrorMessage.trim());
        } else {
          console.error("Unexpected error", error);
          setStatusMessage("Ocorreu um erro inesperado. Tente novamente.");
        }
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
            Acesse sua conta
          </span>
          <p className="text-custom-black text-center text-xs md:text-base">
            Entre agora para acompanhar suas buscas favoritas, receber <br />
            atualizações sobre novos imóveis e gerenciar suas preferências.
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
            login();
          }}
          className="w-full sm:w-fit flex flex-col items-center gap-2 sm:min-w-[400px]"
        >
          <div className="relative flex w-full">
            <input
              className="py-2 w-full text-sm md:text-base px-4 md:min-w-[400px] bg-white-secondary text-custom-black rounded-md outline-none border-2 border-transparent focus:border-2 focus:border-orange-primary placeholder:font-light placeholder:text-custom-gray-light"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <IconMail
              className="absolute top-1/2 right-2 transform -translate-y-1/2"
              size={24}
              color="#4B4B4B"
            />
          </div>
          <div className="relative flex w-full">
            <input
              id="passwordInput"
              className="py-2 w-full text-sm md:text-base px-4 md:min-w-[400px] bg-white-secondary text-custom-black rounded-md outline-none border-2 border-transparent focus:border-2 focus:border-orange-primary placeholder:font-light placeholder:text-custom-gray-light"
              type={passwordVisibility ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={(event) => changePasswordVisibility(event)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2"
            >
              {passwordVisibility ? (
                <IconEyeOff size={24} color="#4B4B4B" />
              ) : (
                <IconEye size={24} color="#4B4B4B" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between w-full my-2">
            <div className="flex items-center gap-2 text-xs ">
              <input
                type="checkbox"
                name="rememberMeCheckbox"
                id="rememberMeCheckbox"
                className="accent-orange-primary"
              />
              <label
                htmlFor="rememberMeCheckbox"
                className=" text-xs text-custom-black"
              >
                Lembrar de mim
              </label>
            </div>
            <Link className="text-xs text-custom-black" href={""}>
              Esqueci minha senha
            </Link>
          </div>
          <button
            type="submit"
            className="uppercase text-sm px-4 py-2 w-full bg-orange-primary rounded-md text-white-secondary my-2 font-medium"
          >
            Acessar
          </button>
          <span className="block my-2 text-xs text-custom-black">
            Não possui uma conta?
            <Link className="font-medium" href={"/register"}>
              {" "}
              Cadastra-se
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
