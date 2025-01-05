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
    <footer className="py-10 px-10 flex flex-col items-center gap-8">
      <Image
        src={logoDark}
        alt="..."
        width={500}
        height={500}
        className="w-[300px]"
      />
      <ul className="flex flex-col sm:flex-row items-center gap-4">
        <li className="text-sm text-custom-black">
          <Link href={""}> Useless link</Link>{" "}
        </li>
        <li className="text-sm text-custom-black">
          <Link href={""}> Useless link</Link>{" "}
        </li>
        <li className="text-sm text-custom-black">
          <Link href={""}> Useless link</Link>{" "}
        </li>
        <li className="text-sm text-custom-black">
          <Link href={""}> Useless link</Link>{" "}
        </li>
      </ul>
      <ul className="flex items-center gap-4">
        <li>
          {" "}
          <a href="">
            <IconBrandInstagram size={22} color="#F46530" />
          </a>
        </li>
        <li>
          {" "}
          <a href="">
            <IconBrandX size={22} color="#F46530" />
          </a>
        </li>
        <li>
          {" "}
          <a href="">
            <IconBrandFacebook size={22} color="#F46530" />
          </a>
        </li>
      </ul>
      <span className="text-center text-xs text-custom-gray-strong">
        Todos os direitos reservados Espaço Ideal 2024©
      </span>
    </footer>
  );
}
