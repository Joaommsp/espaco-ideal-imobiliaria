"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function UserProfile() {
  const { userName, userData } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
    verifyUser();
  }, []);

  function verifyUser() {
    if (userName === null || userData === null) {
      router.push("/");
    } else {
      setIsLoggedIn(true);
    }
  }

  return isLoggedIn ? (
    <div className="w-full min-h-screen px-8 pt-10 flex">
      <div className="">
        <div className="flex flex-col w-full h-full gap-4">
          <h2 className="text-xl text-black font-medium">Configurações</h2>
          <div className="ml-2">
            <ul className="flex flex-col gap-2">
              <li>
                <button className="text-custom-gray-strong">
                  Alterar minha foto de perfil
                </button>
              </li>
              <li>
                <button className="text-custom-gray-strong">
                  Alterar meus dados
                </button>
              </li>
              <li>
                <button></button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="">
        <div></div>
      </div>
    </div>
  ) : (
    <div className="py-20 px-48">
      <SkeletonTheme baseColor="#DDDDDD" highlightColor="#F5EDED">
        <div className="flex gap-8">
          {" "}
          <div className="w-[200px]">
            <Skeleton count={1} height={200} width="100%" />{" "}
          </div>
          <div className="w-full">
            <Skeleton count={1} height={300} width="100%" />

            <div className="flex w-full gap-4 p-5">
              <div className="w-full">
                {" "}
                <Skeleton count={1} height={50} width="100%" />
              </div>
              <div className="w-full">
                {" "}
                <Skeleton count={1} height={50} width="100%" />
              </div>
              <div className="w-full">
                {" "}
                <Skeleton count={1} height={50} width="100%" />
              </div>
              <div className="w-full">
                {" "}
                <Skeleton count={1} height={50} width="100%" />
              </div>
            </div>
          </div>
        </div>
        <div className="w-full"></div>
      </SkeletonTheme>
    </div>
  );
}
