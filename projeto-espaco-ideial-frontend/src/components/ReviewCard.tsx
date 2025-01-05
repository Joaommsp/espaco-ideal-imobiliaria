import Image, { StaticImageData } from "next/image";

export interface ReviewCardProps {
  icon: StaticImageData;
  text: string;
  name: string;
  position: string;
}

export default function ReviewCard(props: ReviewCardProps) {
  return (
    <div className="relative px-8 py-10 bg-white flex flex-col justify-center items-start rounded-lg min-w-[304px] shadow-md gap-8">
      <Image src={props.icon} alt="..." className="w-12" />
      <div className="w-full h-full absolute z-10 select-none">

      </div>
      <div className="flex flex-col gap-6">
        <p className="line-clamp-5 text-sm text-custom-gray-light">
          {props.text}
        </p>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-custom-black">{props.name}</span>
          <span className="text-custom-gray-strong text-xs">
            {props.position}
          </span>
        </div>
      </div>
    </div>
  );
}
