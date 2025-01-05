import Image from "next/image";
import Logo from "../../public/images/logo-full-horizontal-dark.png";

export default function VisualNavBar() {
  return (
    <header className="absolute w-full h-12 md:h-16 bg-transparent flex items-center px-2 md:px-6 lg:px-10">
      <div className="w-full h-full flex items-center border-b-2 border-custom-white">
        <Image src={Logo} width={154} alt="..." className="w-[124px] md:w-[154px]" />
      </div>
    </header>
  );
}
