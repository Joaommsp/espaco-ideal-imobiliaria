"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  IconSearch,
  IconHome,
  IconHomeFilled,
  IconBed,
  IconCar,
  IconMapPin,
  IconList,
  IconStar,
  IconInfoCircle,
} from "@tabler/icons-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";

import Link from "next/link";
import Footer from "@/components/Footer";

import { getPropertyById } from "../../../../lib/services/api-service";
import { City } from "../page";

import { clientAuth } from "@/lib/services/firebase-service";
import { onAuthStateChanged } from "firebase/auth";

import { useAuth } from "../../../contexts/AuthContext";

type ProductPageProps = {
  params: {
    id: string;
  };
};

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

export interface Category {
  id: number;
  nomeCategoria: string;
}

export interface Transaction {
  id: number;
  nomeTransacao: string;
}

export default function Property({ params }: ProductPageProps) {
  const { id } = params;
  const [isBuySelected, setIsBuySelected] = useState(true);
  const [purchaseType, setPurchaseType] = useState("Compra");
  const [propertyData, setPropertyData] = useState<PropertyInterface>({
    id: 0,
    registro: "",
    endereco: "",
    qtdQuartos: 0,
    qtdVagasGaragem: 0,
    descricao: "",
    preco: 0,
    urlImagem: "",
    cityId: 0,
    categoryId: 0,
    transacaoId: 0,
    area: 0,
  });
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  const [cities, setCities] = useState<Record<number, string>>([]);
  const [categories, setCategories] = useState<Record<number, string>>({});
  const [transactions, setTransactions] = useState<Record<number, string>>({});

  // LISTAGEM DE CATEGORIAS, CIDADES E TRANSAÇÕES
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [citiesList, setCitiesList] = useState<City[]>([]);

  // ESTADOS PARA O FILTRO
  const [transactionId, setTransactionId] = useState<number | null>(1);
  const [cityId, setCityId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [qtdQuartos, setQtdQuartos] = useState<number | null>(null);
  const [qtdVagasGaragem, setQtdVagasGaragem] = useState<number | null>(null);

  // CONDIÇÕES PARA O AGENDAMENTO
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const { userName } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    window.scrollTo(0, 0);
    getPropertyData(id);
    endLoading();
    console.log(id);
    console.log(encodeURIComponent(propertyData.endereco));
    loadCategories();
    loadCities();
    loadTransactions();
    loadLists();
    verifyUser();
  }, []);

  function endLoading() {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }

  function toggleBuyOption(state: boolean, option: string) {
    setIsBuySelected(state);
    setPurchaseType(option);
  }

  async function getPropertyData(id: string) {
    const data = await getPropertyById(id);
    setPropertyData(data);
    setAddress(data.endereco);
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

  function verifyUser() {
    onAuthStateChanged(clientAuth, async (user) => {
      if (user) {
        console.log("Usuário autenticado: ", user);
        setIsLoggedIn(true);
      } else {
        console.log("Usuário não autenticado ou sessão expirada.");
        setIsLoggedIn(false);
      }
    });
  }

  async function toSchedule(
    scheduleUserName: string,
    propertyId: number,
    propertyAdress: string
  ) {
    const scheduleData = {
      nomeUsuario: scheduleUserName,
      enderecoPropriedade: propertyAdress,
      propertyId: propertyId,
      date: new Date(selectedDate).toISOString(),
    };

    try {
      const response = await fetch("http://localhost:3002/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(scheduleData),
      });

      if (response.ok) {
        setStatusMessage("Agendamento realizado com sucesso!");
      } else {
        throw new Error("Erro ao criar o agendamento.");
      }
    } catch (error) {
      setStatusMessage("Erro ao criar o agendamento.");
      console.error(error);
    }
  }

  return (
    <main className="w-full min-h-screen h-full flex flex-col items-center">
      <div
        id="form"
        className="w-full h-full md:h-[300px] bg-center bg-cover bg-no-repeat flex items-center"
      >
        <div className="w-full h-full pt-20  pb-10 md:py-0 flex flex-col justify-center items-center gap-20">
          <section className="w-full h-full flex flex-col justify-center items-center gap-20 max-w-[1200px]">
            <div className="w-full flex flex-col gap-2">
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
                      : "bg-gray-50 text-custom-black"
                  }`}
                >
                  locação
                </button>
                <span className="text-custom-black text-xs">
                  Selecionado:{" "}
                  <strong className="font-medium">{purchaseType}</strong>
                </span>
              </div>
              <div className="order-1 md:order-2  flex flex-col md:flex-row items-center gap-2 w-full p-4 bg-custom-white rounded-md">
                <select
                  className="w-full block text-xs bg-gray-50 p-2 border-2 border-transparent rounded-md focus:border-orange-primary outline-none"
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
                  className="w-full block text-xs bg-gray-50 p-2 border-2 border-transparent rounded-md focus:border-orange-primary outline-none"
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
                  className="w-full block text-xs bg-gray-50 p-2 border-2 border-transparent rounded-md focus:border-orange-primary outline-none placeholder:text-neutral-800"
                  name=""
                  id=""
                  type="number"
                  placeholder="Quantidade de quartos"
                  value={String(qtdQuartos)}
                  onChange={(e) => setQtdQuartos(parseInt(e.target.value))}
                ></input>
                <input
                  className="w-full block text-xs bg-gray-50 p-2 border-2 border-transparent rounded-md focus:border-orange-primary outline-none placeholder:text-neutral-800"
                  name=""
                  id=""
                  type="number"
                  placeholder="Vagas na garagem"
                  value={String(qtdVagasGaragem)}
                  onChange={(e) => setQtdVagasGaragem(parseInt(e.target.value))}
                ></input>
                <Link
                  href={`/search/properties/${transactionId}/${cityId}/${categoryId}/${qtdQuartos}/${qtdVagasGaragem}`}
                  className="flex items-center gap-2 w-full justify-center bg-orange-primary rounded-md px-4 py-2"
                >
                  <IconSearch size={18} stroke={2} color="#FFFFFF" />
                  <span className="uppercase text-xs font-medium text-custom-white">
                    buscar
                  </span>
                </Link>
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
          {loading ? (
            <div className="w-full px-4 sm:px-4 md:px-10 py-10">
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
            </div>
          ) : (
            <div className="w-full px-4 sm:px-4 md:px-10 py-10">
              {propertyData != null && (
                <>
                  <div className="flex flex-col sm:flex-row items-start w-full gap-4">
                    <div className="flex w-full sm:max-w-full md:max-w-[400px] lg:max-w-[600px] flex-col gap-4">
                      <Image
                        src={propertyData.urlImagem}
                        width={1000}
                        height={1000}
                        className="object-cover w-full h-[400px] rounded-lg"
                        alt="..."
                      />
                      <div className="bg-[#F5F6F7] p-8 rounded-md shadow-lg flex flex-col gap-4">
                        <div className="flex flex-col gap-4">
                          <span className="text-xl font-medium text-custom-black leading-6">
                            {propertyData.registro} - {propertyData.endereco}
                          </span>
                          <p className="text-xs text-[#292929] leading-5">
                            {propertyData.descricao}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-medium text-custom-black">
                            R$
                          </span>
                          <span className="text-lg font-medium text-custom-black">
                            {propertyData.preco}
                          </span>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <div className="flex items-center gap-4 mb-2">
                            <div className="flex items-center gap-2">
                              <IconHome size={22} color="#292929" />
                              <span className="text-custom-black font-medium text-xs">
                                {categories[propertyData.categoryId] ||
                                  "Não encontrada"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <IconBed size={22} color="#292929" />
                              <span className="text-custom-black font-medium text-xs">
                                {propertyData.qtdQuartos}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <IconCar size={22} color="#292929" />
                              <span className="text-custom-black font-medium text-xs">
                                {propertyData.qtdVagasGaragem}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <IconMapPin size={22} color="#292929" />
                            <span className="pl-2 text-custom-black font-medium text-xs md:text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                              {propertyData.endereco}
                            </span>
                          </div>
                        </div>
                        {isLoggedIn ? (
                          <button
                            onClick={() =>
                              setOpenScheduleModal((prev) => !prev)
                            }
                            className="uppercase max-w-[300px] text-[12px] z-10 px-4 py-2 text-orange-primary border-2 border-orange-primary rounded-md font-medium"
                          >
                            Agendar visita
                          </button>
                        ) : (
                          <Link
                            href={"/login"}
                            className="uppercase text-center max-w-[300px] text-[12px] z-10 px-4 py-2 text-orange-primary border-2 border-orange-primary rounded-md font-medium"
                          >
                            Agendar visita
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="flex w-full flex-col gap-4">
                      <Image
                        src={propertyData.urlImagem}
                        width={1000}
                        height={1000}
                        className="object-cover w-full h-[400px] rounded-lg"
                        alt="..."
                      />
                      <div>
                        <div className="flex flex-col items-start w-full justify-between gap-4 bg-[#F5F6F7] p-8 rounded-md shadow-lg">
                          <div className="flex items-center ">
                            <button className="flex items-center w-full gap-2">
                              <IconList size={22} color="#292929" />
                              <span className="text-xs text-custom-black">
                                Mais opções
                              </span>
                            </button>
                          </div>
                          <div className="flex items-center ">
                            <button className="flex items-center w-full gap-2">
                              <IconStar size={22} color="#292929" />
                              <span className="text-xs text-custom-black">
                                Favoritar
                              </span>
                            </button>
                          </div>
                          <div className="flex items-center  ">
                            <button className="flex items-center w-full gap-2">
                              <IconInfoCircle size={22} color="#F46530" />
                              <span className="text-xs text-orange-primary">
                                Mais informações
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex flex-col gap-4 bg-[#F5F6F7] p-8 rounded-md shadow-lg">
                        <div className="flex w-full justify-between">
                          <span className="text-sm text-custom-black">
                            Transação
                          </span>
                          <span className="text-sm text-custom-black font-medium">
                            {transactions[propertyData.transacaoId] ||
                              "Não encontrada"}
                          </span>
                        </div>
                        <div className="flex w-full justify-between">
                          <span className="text-sm text-custom-black">
                            Área total
                          </span>
                          <span className="text-sm text-custom-black font-medium">
                            {propertyData.area}m²
                          </span>
                        </div>
                        <div className="flex w-full justify-between">
                          <span className="text-sm text-custom-black">
                            Cidade
                          </span>
                          <span className="text-sm text-custom-black font-medium">
                            {cities[propertyData.cityId] ||
                              "Cidade não encontrada"}
                          </span>
                        </div>
                        <div className="flex w-full justify-between">
                          <span className="text-sm text-custom-black">
                            Referência
                          </span>
                          <span className="text-sm text-custom-black font-medium">
                            000{propertyData.id}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:h-full  my-10 ">
                    <iframe
                      className="rounded-lg shadow-lg"
                      width="100%"
                      height="600"
                      src={`https://maps.google.com/maps?width=100%25&height=600&hl=en&q=${address}&t=&z=14&ie=UTF8&iwloc=B&output=embed`}
                      frameBorder="0"
                      allowFullScreen
                      aria-hidden="false"
                    ></iframe>
                  </div>
                  <div className="w-full flex flex-col sm:flex-row items-center max-w-[600px] my-10 gap-2">
                    <Link
                      href={"#form"}
                      className="w-full sm:max-w-[300px] justify-center  items-center flex px-4 py-2 bg-custom-black rounded-md gap-2"
                    >
                      <IconSearch size={20} color="#ffffff" />
                      <span className="text-custom-white text-xs md:text-sm uppercase">
                        Procurar mais imóveis
                      </span>
                    </Link>
                    <Link
                      href={"/"}
                      className="w-full sm:max-w-[300px] justify-center items-center flex px-4 py-2 bg-orange-primary rounded-md gap-2 uppercase"
                    >
                      <IconHomeFilled size={20} color="#ffffff" />
                      <span className="text-custom-white text-xs md:text-sm">
                        Página inicial
                      </span>
                    </Link>
                  </div>
                  {openScheduleModal && (
                    <div className="fixed z-20 flex flex-col items-center p-6 bg-white rounded-lg shadow-lg w-[90%] max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <h1 className="mb-4 text-2xl font-semibold text-gray-800">
                        Agendar Visita
                      </h1>
                      <form className="flex flex-col w-full space-y-4">
                        <input
                          type="text"
                          placeholder="ID do Usuário"
                          className="text-neutral-600 text-sm px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={String(userName)}
                          readOnly
                        />
                        <input
                          type="text"
                          placeholder="ID da Propriedade"
                          value={`PROPRIEDADE N°${propertyData.id}`}
                          className="text-neutral-600 text-sm px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                        <input
                          type="text"
                          placeholder="Endereço da Propriedade"
                          value={`${propertyData.endereco}`}
                          className="text-neutral-600 text-sm px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          readOnly
                        />
                        <input
                          type="datetime-local"
                          className="text-sm px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();

                            toSchedule(
                              String(userName),
                              propertyData.id,
                              propertyData.endereco
                            );
                          }}
                          type="submit"
                          className="px-4 text-sm py-2 font-medium text-white bg-orange-primary rounded-md "
                        >
                          Agendar
                        </button>
                        <button
                          onClick={() => {
                            setOpenScheduleModal((prev) => !prev);
                          }}
                          type="submit"
                          className="px-4 text-sm py-2 font-medium text-red-500 border-2 border-red-500 bg-transparent rounded-md"
                        >
                          Cancelar
                        </button>
                      </form>
                      {statusMessage && (
                        <p className="mt-4 text-sm text-red-500">
                          {statusMessage}
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </section>
      </div>

      <div className="w-full bg-[#F5F6F7]  flex items-center justify-center">
        <Footer />
      </div>
    </main>
  );
}
