"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { getProperty } from "../lib/services/api-service";
import Link from "next/link";
import { IconBed, IconCar, IconHome, IconMapPin } from "@tabler/icons-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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

export default function PropertiesList() {
  const [properties, setProperties] = useState<PropertyInterface[]>([]);
  const [pages, setPages] = useState<number>(0);
  const [start, setStart] = useState<number>(0);
  const [current, setCurrent] = useState<number>(1);
  const [end, setEnd] = useState<number>(9);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // CORRESPONDÊNCIAS DE LISTAGENS COM ID
  const [, setCities] = useState<Record<number, string>>([]);
  const [categories, setCategories] = useState<Record<number, string>>({});
  const [, setTransactions] = useState<Record<number, string>>({});

  useEffect(() => {
    getPropertiesData();
    endLoading();
    loadCategories();
    loadCities();
    loadTransactions();
  }, []);

  function endLoading() {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }

  async function getPropertiesData() {
    const propertiesData = await getProperty();
    setProperties(propertiesData);
    pagination(propertiesData);
  }

  function pagination(propertiesList: PropertyInterface[]) {
    if (propertiesList.length > 0) {
      const count = propertiesList.length;
      const pages = Math.ceil(count / 9);
      setPages(pages);
    }
    if (propertiesList.length == 0) {
      setPages(1);
    }
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

  function controlPage(index: number) {
    setLoading(true);
    endLoading();
    setCurrent(index + 1);
    const newStart = index * 9;
    const newEnd = newStart + 9;
    setStart(newStart);
    setEnd(newEnd);

    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center bg-transparent px-4 py-5 md:py-10 w-full gap-4 bg-[#EBF0F6]"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 max-w-fit items-center justify-center gap-4 bg-[#EBF0F6]">
        {loading ? (
          <SkeletonTheme baseColor="#DDDDDD" highlightColor="#c0bebe">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className=" max-w-[300px] min-w-[300px] sm:max-w-[500px] sm:min-w-[500px] flex flex-col gap-2">
                <Skeleton height={200} className="w-full" />
                <Skeleton height={25} className="w-full" />
                <Skeleton height={25} className="w-full" />
                <Skeleton height={25} className="w-full" />
              </div>
            </div>
          </SkeletonTheme>
        ) : (
          properties.map(
            (property: PropertyInterface, index) =>
              index >= start &&
              index < end && (
                <div
                  key={property.id}
                  className="relative w-full bg-[#FFFDFF] flex flex-col rounded-lg overflow-hidden shadow-md"
                >
                  <Image
                    src={property.urlImagem}
                    alt="Imagem do imóvel"
                    width={500}
                    height={500}
                    className="w-full h-[300px] object-cover"
                  />
                  <div className="absolute w-full h-full"></div>
                  <div className="flex flex-col overflow-hidden p-6 gap-4">
                    <div className="flex flex-col mb-2">
                      <span className="text-sm font-medium text-custom-black line-clamp-1">
                        {property.registro}
                      </span>
                      <span className="text-sm text-custom-gray-strong line-clamp-2 h-16">
                        {property.descricao}
                      </span>
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <IconHome size={18} color="#292929" />
                          <span className="text-custom-black font-medium text-xs">
                            {categories[property.categoryId] ||
                              "Não encontrada"}
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
                        className="uppercase text-[12px] z-10 px-4 py-2 text-gray-50 bg-orange-primary rounded-md font-medium"
                        href={`http://localhost:3000/properties/${property.id}`}
                      >
                        Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              )
          )
        )}
      </div>
      <div className="w-full flex items-center justify-end px-4 md:px-20 gap-4 py-5">
        <span className="text-sm text-custom-gray-light">
          Página {current} de {pages}
        </span>
        <div className="flex items-center gap-2">
          {Array.from({ length: pages }).map((_, index) => (
            <button
              key={index}
              className={
                index + 1 == current
                  ? `px-3 min-w-8 py-1 bg-orange-primary border-[1px] border-orange-primary rounded flex items-center justify-center`
                  : `px-3 min-w-8 py-1 bg-transparent border-[1px] border-gray-400 rounded flex items-center justify-center`
              }
              onClick={() => controlPage(index)}
            >
              <span
                className={
                  index + 1 == current
                    ? `text-sm text-custom-white font-medium`
                    : `text-sm text-custom-gray-light font-medium`
                }
              >
                {index + 1}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
