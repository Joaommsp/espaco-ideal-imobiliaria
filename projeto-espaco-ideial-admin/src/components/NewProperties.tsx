import { useEffect, useState } from "react";
import { getProperty } from "../lib/services/fake-api";
import Image from "next/image";
import { IconHome, IconCar, IconBed, IconMapPin } from "@tabler/icons-react";
import Link from "next/link";

export interface PropertyInterface {
  id: number;
  imagem: string;
  registro: string;
  descricao: string;
  tipo: string;
  quartos: number;
  garagem: number;
  endereco: string;
  valor: number;
  apresentacao: string;
  transacao: string,
  area: number
}

export default function NewProperties() {
  const [properties, setProperties] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    getPropertiesData();
  }, []);

  async function getPropertiesData() {
    const propertiesData = await getProperty();
    setProperties(propertiesData);
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLDivElement;
    setIsDragging(true);
    setStartX(e.pageX - target.offsetLeft);
    setScrollLeft(target.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const target = e.currentTarget as HTMLDivElement;
    const x = e.pageX - target.offsetLeft;
    const walk = (x - startX) * 1.5;
    target.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      className="w-screen flex gap-3 md:gap-8 overflow-x-scroll cursor-grab justify-start pb-2 select-none px-5 md:px-10 lg:px-28 overflow-visible"
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {properties.map(
        (property: PropertyInterface) =>
          property.id < 10 && (
            <div
              key={property.id}
              className="relative max-w-[308px] min-w-[308px] md:max-w-[384px] md:min-w-[384px] bg-[#FFFDFF] flex flex-col rounded-lg overflow-hidden shadow-md"
            >
              <Image
                src={property.imagem}
                alt="..."
                width={500}
                height={500}
                className="w-full"
              />
              <div className="absolute w-full h-full"></div>
              <div className="flex flex-col overflow-hidden p-6 gap-4">
                <div className="flex flex-col mb-2">
                  <span className="text-sm md:text-base font-medium text-custom-black line-clamp-2">
                    {property.registro}
                  </span>
                  <span className="text-sm md:text-base text-custom-gray-strong line-clamp-2">
                    {property.descricao}
                  </span>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <IconHome size={18} color="#292929" />
                      <span className=" text-custom-black font-medium text-xs">
                        {property.tipo}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconBed size={18} color="#292929" />
                      <span className="text-custom-black font-medium text-xs">
                        {property.quartos}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconCar size={18} color="#292929" />
                      <span className="text-custom-black font-medium text-xs">
                        {property.garagem}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <IconMapPin size={22} color="#292929" />
                    <span className="pl-2 text-custom-black font-medium text-xs md:text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                      {property.endereco}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs md:text-sm font-bold text-custom-black">
                      R$
                    </span>
                    <span className="pl-1 text-base md:text-lg text-custom-black">
                      {property.valor.toFixed(2)}
                    </span>
                  </div>
                  <Link
                    className="uppercase text-[12px] z-10 px-4 py-2 text-gray-50 bg-orange-primary rounded-md  font-medium"
                    href={`http://localhost:3000/properties/${property.id}`}
                  >
                    Detalhes
                  </Link>
                </div>
              </div>
            </div>
          )
      )}
    </div>
  );
}
