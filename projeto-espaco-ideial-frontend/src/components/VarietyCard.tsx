import Image, { StaticImageData } from "next/image";

export interface VarietyCardProps {
  icon: StaticImageData;
  title: string;
  text: string;
}

export default function VarietyCard(props: VarietyCardProps) {
  return (
    <div
      className="px-8 py-10 bg-white flex flex-col items-center justify-center sm:items-start rounded-lg w-full sm:min-w-[242px] sm:max-w-[242px] shadow-md
      gap-8
    "
    >
      <Image src={props.icon} alt="..." className="w-12" />
      <div className="flex flex-col items-center sm:items-start">
        <span className="text-sm font-medium ">{props.title}</span>
        <p className="text-custom-gray-strong text-xs">{props.text}</p>
      </div>
    </div>
  );
}
