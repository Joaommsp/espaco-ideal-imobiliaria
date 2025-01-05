import { useEffect, useState } from "react";
import { getProperty } from "../lib/services/api-service";
import Image from "next/image";
import { IconHome, IconCar, IconBed, IconMapPin } from "@tabler/icons-react";
import Link from "next/link";

export interface PropertyInterface {
  id: number;
  registro: string;
  endereco: string;
  qtdQuartos: number;
  qtdVagasGaragem: number;
  descricao: string;
  preco: number;
  urlImagem: string;
  cityId: number;
  categoryId: number;
  transacaoId: number;
  area: number;
}

export default function NewProperties() {
  const [properties, setProperties] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // CORRESPONDÊNCIAS DE LISTAGENS COM ID
  const [, setCities] = useState<Record<number, string>>([]);
  const [categories, setCategories] = useState<Record<number, string>>({});
  const [, setTransactions] = useState<Record<number, string>>({});

  useEffect(() => {
    getPropertiesData();
    loadCategories();
    loadCities();
    loadTransactions();
  }, []);

  async function getPropertiesData() {
    const propertiesData = await getProperty();
    setProperties(propertiesData);
  }

  const loadCategories = async () => {
    try {
      const response = await fetch("http://localhost:3002/categories/all");
      const data = await response.json();
      const categoryMap: Record<number, string> = {};
      data.forEach((category: { id: number; nomeCategoria: string }) => {
        categoryMap[category.id] = category.nomeCategoria;
      });
      setCategories(categoryMap);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const loadCities = async () => {
    try {
      const response = await fetch("http://localhost:3002/cities/all");
      const data = await response.json();
      const cityMap: Record<number, string> = {};
      data.forEach((city: { id: number; nomeCidade: string }) => {
        cityMap[city.id] = city.nomeCidade;
      });
      setCities(cityMap);
    } catch (error) {
      console.error("Erro ao carregar cidades:", error);
    }
  };

  const loadTransactions = async () => {
    try {
      const response = await fetch("http://localhost:3002/transactions/all");
      const data = await response.json();
      const transactionMap: Record<number, string> = {};
      data.forEach((transaction: { id: number; nomeTransacao: string }) => {
        transactionMap[transaction.id] = transaction.nomeTransacao;
      });
      setTransactions(transactionMap);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

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
                src={property.urlImagem}
                alt="..."
                width={500}
                height={500}
                 className="w-full h-[300px] object-cover"
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
                        {categories[property.categoryId] || "Não encontrada"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconBed size={18} color="#292929" />
                      <span className="text-custom-black font-medium text-xs">
                        {property.qtdQuartos}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IconCar size={18} color="#292929" />
                      <span className="text-custom-black font-medium text-xs">
                        {property.qtdVagasGaragem}
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
                      {property.preco.toFixed(2)}
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
