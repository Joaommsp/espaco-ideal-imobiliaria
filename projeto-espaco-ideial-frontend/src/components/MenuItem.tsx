import Link from "next/link";
import { ElementType } from "react";

export interface MenuItemProps {
  icon: ElementType;
  href: string;
  text: string;
}

export function MenuItem(props: MenuItemProps) {
  return (
    <li className="flex items-center justify-between">
      <Link
        href={props.href}
        className="text-custom-black w-full flex items-center justify-between hover:bg-gray-200 p-2 rounded-md transition ease-in-out"
      >
        <props.icon size={24} />
        <span>{props.text}</span>
      </Link>
    </li>
  );
}
