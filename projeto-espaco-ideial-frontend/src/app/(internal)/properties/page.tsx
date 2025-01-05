"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  IconSearch,
  IconMapPinFilled,
  IconHome,
  IconBed,
  IconCar,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";

import Link from "next/link";
import Footer from "@/components/Footer";
import PropertiesList from "@/components/PropertiesList";

export interface City {
  id: number;
  nomeCidade: string;
}

export interface Category {
  id: number;
  nomeCategoria: string;
}

export interface Transaction {
  id: number;
  nomeTransacao: string;
}

export default function Properties() {
  const [isBuySelected, setIsBuySelected] = useState(true);
  const [purchaseType, setPurchaseType] = useState("Compra");

  // LISTAGEM DE CATEGORIAS, CIDADES E TRANSAÇÕES
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [citiesList, setCitiesList] = useState<City[]>([]);

  // ESTADOS PARA O FILTRO
  const [transactionId, setTransactionId] = useState<number | null>(1);
  const [cityId, setCityId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [qtdQuartos, setQtdQuartos] = useState<number | null>(null);
  const [qtdVagasGaragem, setQtdVagasGaragem] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadLists();
  }, []);

  function toggleBuyOption(state: boolean, option: string) {
    setIsBuySelected(state);
    setPurchaseType(option);
  }

  async function fetchCities() {
    try {
      const response = await fetch("http://localhost:3002/cities/all");
      if (!response.ok) throw new Error("Erro ao buscar cidades");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch("http://localhost:3002/categories/all");
      if (!response.ok) throw new Error("Erro ao buscar categorias");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async function fetchTransactions() {
    try {
      const response = await fetch("http://localhost:3002/transactions/all");
      if (!response.ok) throw new Error("Erro ao buscar transações");
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const loadLists = async () => {
    const [cityData, categoryData] = await Promise.all([
      fetchCities(),
      fetchCategories(),
      fetchTransactions(),
    ]);
    setCitiesList(cityData);
    setCategoriesList(categoryData);
  };

  return (
    <main className="w-full min-h-screen h-full flex flex-col items-center">
      <div className="w-full h-full md:h-[600px] bg-home-pattern bg-center bg-cover bg-no-repeat flex items-center">
        <div className="w-full h-full pt-20  pb-10 md:py-0 bg-[#00000040] flex flex-col justify-center items-center gap-20">
          <section className="w-full h-full flex flex-col justify-center items-center gap-20 max-w-[1200px]">
            <div className="flex flex-col items-start justify-between px-2 md:px-10 w-full gap-8">
              <form className="w-full flex flex-col gap-2" action="">
                <div className="order-2 md:order-1 flex flex-col md:flex-row items-center gap-2 md:gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      toggleBuyOption(true, "Compra");
                      setTransactionId(1);
                    }}
                    className={`w-full md:w-fit py-2 px-4 text-xs font-medium rounded-md uppercase ${
                      isBuySelected
                        ? "bg-gray-400 md:bg-orange-primary text-gray-50"
                        : "bg-gray-50 text-custom-black"
                    }`}
                  >
                    compra
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      toggleBuyOption(false, "Locação");
                      setTransactionId(2);
                    }}
                    className={`w-full md:w-fit py-2 px-4 text-xs font-medium rounded-md uppercase ${
                      !isBuySelected
                        ? "bg-gray-400 md:bg-orange-primary text-gray-50"
                        : "bg-gray-50 text-custom-black md:bg-gray-50 md:text-orange-primary"
                    }`}
                  >
                    locação
                  </button>
                  <span className="text-custom-white text-xs">
                    Selecionado:{" "}
                    <strong className="font-medium">{purchaseType}</strong>
                  </span>
                </div>
                <div className="order-1 md:order-2  flex flex-col md:flex-row items-center gap-2 w-full p-4 bg-custom-white rounded-md">
                  <select
                    className="w-full block text-xs bg-neutral-300 p-2 border-2 border-transparent rounded-md focus:border-orange-primary outline-none"
                    name=""
                    id=""
                    value={String(cityId)}
                    onChange={(e) => setCityId(parseInt(e.target.value))}
                  >
                    <optgroup>
                      <option className="bg-gray-50" value="">
                        Cidade
                      </option>
                      {citiesList.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.nomeCidade}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <select
                    className="w-full block text-xs bg-neutral-300 p-2 border-2 border-transparent rounded-md focus:border-orange-primary outline-none"
                    name=""
                    id="categoryId"
                    value={String(categoryId)}
                    onChange={(e) => setCategoryId(parseInt(e.target.value))}
                  >
                    <optgroup>
                      <option className="bg-gray-50" value="">
                        Tipo de Imóvel
                      </option>
                      {categoriesList.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.nomeCategoria}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <input
                    className="w-full block text-xs bg-neutral-300 p-2 border-2 border-transparent rounded-md focus:border-orange-primary outline-none placeholder:text-neutral-800"
                    name=""
                    id=""
                    type="number"
                    placeholder="Quantidade de quartos"
                    value={String(qtdQuartos)}
                    onChange={(e) => setQtdQuartos(parseInt(e.target.value))}
                  ></input>
                  <input
                    className="w-full block text-xs bg-neutral-300 p-2 border-2 border-transparent rounded-md focus:border-orange-primary outline-none placeholder:text-neutral-800"
                    name=""
                    id=""
                    type="number"
                    placeholder="Vagas na garagem"
                    value={String(qtdVagasGaragem)}
                    onChange={(e) =>
                      setQtdVagasGaragem(parseInt(e.target.value))
                    }
                  ></input>
                  <button
                    type="button"
                    className="flex items-center gap-2 w-full justify-center bg-orange-primary rounded-md px-4 py-2"
                  >
                    <IconSearch size={18} stroke={2} color="#FFFFFF" />
                    <Link
                      href={`/search/properties/${transactionId}/${cityId}/${categoryId}/${qtdQuartos}/${qtdVagasGaragem}`}
                      className="uppercase text-xs font-medium text-custom-white"
                    >
                      buscar
                    </Link>
                  </button>
                </div>
              </form>
              <div className="flex flex-wrap items-center w-fit justify-start text-gray-50 bg-white bg-opacity-10 backdrop-blur-md rounded-lg border border-white/20 shadow-lg py-2 px-2 md:px-8 gap-2 md:gap-4">
                <span className="text-sm font-medium">Filtre por</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-light">Cidade</span>
                  <IconMapPinFilled size={18} color="#FFFFFF" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-light">Tipo de imóvel</span>
                  <IconHome size={18} color="#FFFFFF" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-light">Total de quartos</span>
                  <IconBed size={18} color="#FFFFFF" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-light">Garagem </span>
                  <IconCar size={18} color="#FFFFFF" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className="w-full h-full flex items-center justify-center py-10 bg-[#EBF0F6]">
        <section className="w-full flex-col flex items-center justify-center max-w-[1200px]">
          <div className="w-full flex-col flex items-center justify-center gap-4">
            <div className="w-[176px] h-[5px] bg-orange-primary rounded-full"></div>
          </div>
          <PropertiesList />
        </section>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-8 bg-white w-full max-w-[1200px] px-4 md:px-10 py-10 md:py-20 justify-between">
        <div className="w-full flex justify-center items-center order-2 md:order-1">
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/espaco-ideal-auth-storage.appspot.com/o/assets%2Fabout-us-img02.png?alt=media&token=0cc9c417-51e2-46ab-96d3-0ca155779a7c"
            alt="..."
            width={400}
            height={400}
          />
        </div>
        <div className="flex flex-col w-full gap-12 order-1 md:order-2 ">
          <div className="flex flex-col  gap-4 ">
            <h3 className="text-custom-black md:text-xl font-medium leading-6">
              Uma equipe inteira especializada no assunto
            </h3>
            <p className="text-sm md:text-base text-custom-gray-strong">
              Com profundo conhecimento do mercado e das melhores oportunidades,
              oferecemos um atendimento personalizado para garantir que você
              faça a escolha certa, seja para encontrar o lar ideal ou o
              investimento perfeito.
            </p>
            <Link
              href={""}
              className="uppercase px-4 py-2 bg-custom-black text-custom-white font-medium rounded-md text-xs md:text-sm w-fit"
            >
              FALE CONOSCO
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 md:gap-4">
              <IconMail size={20} color="#F46530" />
              <span className="text-xs md:text-sm font-medium text-custom-black">
                espaco_ideal.imob@outlook.com
              </span>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <IconPhone size={20} color="#F46530" />
              <span className="text-xs md:text-sm font-medium text-custom-black">
                75 9 4002-0822
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#F5F6F7]  flex items-center justify-center pt-16">
        <Footer />
      </div>
    </main>
  );
}
