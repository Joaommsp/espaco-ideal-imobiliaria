"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import Logo from "../../public/images/logo-system.png";
import nextj_logo from "../../public/icons/nextjs-fill-svgrepo-com.svg";
import nestj_logo from "../../public/icons/nestjs-svgrepo-com.svg";
import tailwind_logo from "../../public/icons/tailwind-svgrepo-com.svg";
import postgres_logo from "../../public/icons/postgresql-svgrepo-com.svg";
import VisualNavBar from "@/components/VisualNavBar";

export default function Home() {
  return (
    <>
      <VisualNavBar />
      <div className="w-full overflow-hidden h-full min-h-screen bg-admin-pattern bg-cover bg-no-repeat bg-center flex items-center justify-center text-sm ">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex flex-col w-full items-center gap-16 pt-28 px-2"
        >
          <Image
            src={Logo}
            width={1000}
            alt="..."
            className="w-[324´px] md:w-[324px]"
          />
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 w-full">
            <Link
              href={"dashboard/login"}
              className="text-xs  md:text-sm md:hover:scale-x-105 order-3 md:order-2 transition ease-in-out w-full md:w-[200px] text-center  bg-custom-white border-2 border-orange-primary text-orange-primary py-3 md:py-2 px-4 rounded-md font-normal "
            >
              Acessar sua conta
            </Link>
          </div>
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
    </>
  );
}
