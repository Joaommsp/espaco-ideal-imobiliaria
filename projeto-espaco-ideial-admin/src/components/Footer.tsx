import Image from "next/image";
import {
  IconBrandInstagram,
  IconBrandX,
  IconBrandFacebook,
} from "@tabler/icons-react";

import logoDark from "../../public/images/logo-full-horizontal-dark.png";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-10 px-10 flex flex-col items-center gap-8 w-full bg-[#DDDDDD]">
      <Image
        src={logoDark}
        alt="..."
        width={500}
        height={500}
        className="w-[200px]"
      />
    
      <span className="text-center text-xs text-custom-gray-strong">
        Todos os direitos reservados Espaço Ideal 2024©
      </span>
    </footer>
  );
}
