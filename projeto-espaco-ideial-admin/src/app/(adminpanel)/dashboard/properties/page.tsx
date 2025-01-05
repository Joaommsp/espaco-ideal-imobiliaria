"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { adminAuth } from "@/lib/services/firebase-admin-service";
import { clientStorage } from "@/lib/services/firebase-client-service";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import logo from "../../../../../public/images/logo-system.png";

import {
  IconBell,
  IconHome,
  IconLayoutList,
  IconMenu,
  IconPlus,
  IconProgressX,
  IconLogout,
  IconTrash,
  IconEdit,
} from "@tabler/icons-react";

import Footer from "@/components/Footer";
import { MenuItem } from "@/components/MenuItem";

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

export interface UserInterface {
  email: string;
  id: string;
  name: string;
  password: string;
  userId: string;
  userPfp: string;
}

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

export default function Home() {
  // GET DE PROPRIEDADES
  const [properties, setProperties] = useState<PropertyInterface[]>([]);

  // CONTROLE DO MENU LATERAL
  const [openMenu, setOpenMenu] = useState(false);

  // CARREGAMENTO DE TELA
  const [isLoading, setLoading] = useState(false);

  // FORMULÁRIOS DE AÇÕES
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // VALORES SETADOS DO BANCO
  const [registro, setRegistro] = useState("");
  const [endereco, setEndereco] = useState("");
  const [qtdQuartos, setQtdQuartos] = useState(0);
  const [qtdVagasGaragem, setQtdVagasGaragem] = useState(0);
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState(0);
  const [area, setArea] = useState(0);
  const [cityId, setCityId] = useState(0);
  const [cities, setCities] = useState<Record<number, string>>([]);
  const [categoryId, setCategoryId] = useState(0);
  const [categories, setCategories] = useState<Record<number, string>>({});
  const [transactionId, setTransactionId] = useState(0);
  const [transactions, setTransactions] = useState<Record<number, string>>({});

  // STATUS DE PROCESSO
  const [statusMessage, setStatusMessage] = useState("");

  // UPLOAD DE IMAGEM
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [, setProgress] = useState(0);

  // LISTAGEM DE CATEGORIAS, CIDADES E TRANSAÇÕES
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [citiesList, setCitiesList] = useState<City[]>([]);
  const [transactionsList, setTransactionsList] = useState<Transaction[]>([]);

  // STATES DE ATUALIZAÇÃO
  const [editingId, setEditingId] = useState(0);
  const [newRegistro, setNewRegistro] = useState("");
  const [newEndereco, setNewEndereco] = useState("");
  const [newQtdQuartos, setNewQtdQuartos] = useState(0);
  const [newQtdVagasGaragem, setNewQtdVagasGaragem] = useState(0);
  const [newDescricao, setNewDescricao] = useState("");
  const [newPreco, setNewPreco] = useState(0);
  const [newCategoryId, setNewCategoryId] = useState(0);
  const [newCityId, setNewCityId] = useState(0);
  const [newTransactionId, setNewTransactionId] = useState(0);
  const [newArea, setNewArea] = useState(0);

  // ROTA
  const router = useRouter();

  // URL DA API
  const API_URL = "http://localhost:3002/properties";

  useEffect(() => {
    getPropertiesData();
    loadLists();
    loadCategories();
    loadCities();
    loadTransactions();
    verifyUser();
    endLoading();
  }, []);

  function endLoading() {
    setTimeout(() => {
      setLoading(true);
    }, 2000);
  }

  function verifyUser() {
    onAuthStateChanged(adminAuth, async (user) => {
      if (user) {
        console.log("Usuário autenticado: ", user);
      } else {
        console.log("Usuário não autenticado ou sessão expirada.");
        router.push("/");
      }
    });
  }

  function controllMenu() {
    setOpenMenu((prevState) => !prevState);
  }

  function signOutUser() {
    signOut(adminAuth)
      .then(() => {
        router.push("/");
      })
      .catch((error) => {
        console.error("Erro ao sair:", error);
      });
  }

  async function getPropertiesData() {
    const propertiesData = await getProperty();
    setProperties(propertiesData);
  }

  async function getProperty() {
    try {
      const response = await fetch(`${API_URL}/all`);
      const data = await response.json();
      console.log("Propriedades:", data);
      return data;
    } catch (error) {
      console.error("Erro ao buscar propriedades:", error);
    }
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

  const loadLists = async () => {
    const [cityData, categoryData, transactionData] = await Promise.all([
      fetchCities(),
      fetchCategories(),
      fetchTransactions(),
    ]);
    setCitiesList(cityData);
    setCategoriesList(categoryData);
    setTransactionsList(transactionData);
  };

  function controlEditForm(
    newId: number,
    newRegistro: string,
    newEndereco: string,
    newQtdQuartos: number,
    newQtdVagasGaragem: number,
    newDescricao: string,
    newPreco: number,
    newCategoryId: number,
    newCityId: number,
    newTransactionId: number,
    newArea: number,
    setNewRegistro: (value: string) => void,
    setNewEndereco: (value: string) => void,
    setNewQtdQuartos: (value: number) => void,
    setNewQtdVagasGaragem: (value: number) => void,
    setNewDescricao: (value: string) => void,
    setNewPreco: (value: number) => void,
    setNewCategoryId: (value: number) => void,
    setNewCityId: (value: number) => void,
    setNewTransactionId: (value: number) => void,
    setNewArea: (value: number) => void
  ) {
    console.log("newId:", newId);
    console.log("newRegistro:", newRegistro);
    console.log("newEndereco:", newEndereco);
    console.log("newQtdQuartos:", newQtdQuartos);
    console.log("newQtdVagasGaragem:", newQtdVagasGaragem);
    console.log("newDescricao:", newDescricao);
    console.log("newPreco:", newPreco);
    console.log("newCategoryId:", newCategoryId);
    console.log("newCityId:", newCityId);
    console.log("newTransactionId:", newTransactionId);
    console.log("newArea:", newArea);

    setStatusMessage("");
    setEditingId(newId);
    setNewRegistro(newRegistro);
    setNewEndereco(newEndereco);
    setNewQtdQuartos(newQtdQuartos);
    setNewQtdVagasGaragem(newQtdVagasGaragem);
    setNewDescricao(newDescricao);
    setNewPreco(newPreco);
    setNewCategoryId(newCategoryId);
    setNewCityId(newCityId);
    setNewTransactionId(newTransactionId);
    setNewArea(newArea);
    setOpenEditForm((prev) => !prev);
  }

  async function updateProperty(
    id: number | null,
    newRegistro: string,
    newEndereco: string,
    newQtdQuartos: number,
    newQtdVagasGaragem: number,
    newDescricao: string,
    newPreco: number,
    newCategoryId: number,
    newCityId: number,
    newTransactionId: number,
    newArea: number
  ) {
    if (
      !id ||
      !newRegistro ||
      !newEndereco ||
      !newQtdQuartos ||
      !newQtdVagasGaragem ||
      !newDescricao ||
      !newPreco ||
      !newCategoryId ||
      !newCityId ||
      !newTransactionId ||
      !newArea
    ) {
      setStatusMessage("Todos os campos devem ser preenchidos.");
      throw new Error("Todos os campos devem ser preenchidos.");
    }

    try {
      const response = await fetch(`http://localhost:3002/properties/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registro: newRegistro,
          endereco: newEndereco,
          qtdQuartos: newQtdQuartos,
          qtdVagasGaragem: newQtdVagasGaragem,
          descricao: newDescricao,
          preco: newPreco,
          categoryId: newCategoryId,
          cityId: newCityId,
          transacaoId: newTransactionId,
          area: newArea,
        }),
      });

      if (response.ok) {
        setStatusMessage("Propriedade atualizada com sucesso.");
        window.location.reload();
      } else {
        setStatusMessage("Erro ao atualizar a propriedade.");
        throw new Error("Falha na requisição.");
      }
    } catch (error) {
      setStatusMessage("Erro ao atualizar");
      throw error;
    }
  }

  const handleUpload = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!selectedFile) {
        console.log("nenhum arquivo selecionado");
        reject("Nenhum arquivo selecionado");
        return;
      }

      const storageRef = ref(
        clientStorage,
        `propriedades/${selectedFile.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error("Erro ao fazer upload do arquivo:", error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              resolve(url);
              return url;
            })
            .catch((error) => {
              console.error("Erro ao obter a URL de download:", error);
              reject(error);
            });
        }
      );
    });
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    setStatusMessage("");
    e.preventDefault();

    console.log(transactionId);

    const urlImagem = await handleUpload();

    if (
      !registro ||
      !endereco ||
      !descricao ||
      !preco ||
      !categoryId ||
      !cityId ||
      !urlImagem ||
      !area ||
      !transactionId
    ) {
      setStatusMessage("Todos os campos devem ser preenchidos.");
      return;
    }
    
    try {
      const response = await fetch("http://localhost:3002/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cityId: cityId,
          categoryId: categoryId,
          registro: registro,
          endereco: endereco,
          qtdQuartos: qtdQuartos,
          qtdVagasGaragem: qtdVagasGaragem,
          descricao: descricao,
          preco: preco,
          urlImagem: urlImagem,
          area: area,
          transacaoId: transactionId,
        }),
      });

      if (response.ok) {
        setStatusMessage("Imóvel cadastrado com sucesso!");
        setRegistro("");
        setEndereco("");
        setQtdQuartos(0);
        setQtdVagasGaragem(0);
        setDescricao("");
        setPreco(0);
        setCategoryId(0);
        setCityId(0);
        setArea(0);
        setCategoryId(0);
        window.location.reload();
      } else {
        const errorData = await response.json();
        setStatusMessage("Erro ao cadastrar");
        console.error(errorData);
      }
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      setStatusMessage("Erro ao cadastrar o imóvel. Tente novamente.");
    }
  };

  async function controlDelete(id: number) {
    setStatusMessage("");
    setEditingId(id);
    setOpenDeleteModal((prev) => !prev);
  }

  const handleDelete = async () => {
    const response = await fetch(
      `http://localhost:3002/properties/${editingId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao deletar a propriedade.");
    } else {
      setStatusMessage("Registo apagado com sucesso!");
      window.location.reload();
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col justify-start items-center">
      <header className="w-full flex items-center justify-center py-3">
        <div className="w-full max-w-[1200px] flex justify-between items-center border-b-2">
          <Image src={logo} alt="..." width={1000} className="w-[200px]" />
          <div className="flex items-center gap-4">
            <button>
              <IconBell size={24} color="#1b1b1b" />
            </button>
            <Image
              src="https://images.unsplash.com/photo-1540066019607-e5f69323a8dc?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              width={500}
              height={500}
              className="w-[35px] h-[35px] object-cover rounded-full"
              alt="..."
            />
            <button
              onClick={controllMenu}
              className="hover:scale-110 transition ease-in-out"
            >
              <IconMenu size={24} color="#141414" />
            </button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {openMenu && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 z-50 w-72 h-full min-h-screen bg-white-secondary p-4 shadow-2xl flex flex-col items-end"
          >
            <div className="w-full flex items-center justify-between mb-8">
              <span>Menu</span>
              <button
                onClick={controllMenu}
                className="hover:scale-110 transition ease-in-out"
              >
                <IconProgressX size={24} color="#141414" />
              </button>
            </div>
            <div className="w-full h-full  flex flex-col justify-between">
              <div className="flex flex-col gap-2">
                <ul className="w-full flex flex-col text-base text-custom-black gap-2">
                  <MenuItem
                    icon={IconHome}
                    href="/dashboard/home"
                    text="Início"
                  />
                  <li className="flex items-center justify-between w-full">
                    <button
                      onClick={signOutUser}
                      className="text-red-500 flex items-center justify-between  w-full  hover:bg-gray-200 p-2 rounded-md"
                    >
                      <IconLogout size={24} />
                      <span>Sair</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      <main className="w-full max-w-[1200px] py-10 mb-32">
        <div className="flex flex-col gap-8">
          <h1 className="text-2xl font-medium text-custom-black">
            Gerenciar Propriedades
          </h1>
          <div className="flex items-center gap-4">
            <button className="text-sm px-4 py-2 bg-blue-300 rounded-md text-white flex items-center gap-2">
              <IconLayoutList size={22} />
              <span>Visualizar</span>
            </button>
            <button
              onClick={() => {
                setOpenCreateForm((prev) => !prev);
                setOpenEditForm(false);
                setOpenDeleteModal(false);
              }}
              className="text-sm px-4 py-2 bg-green-500 rounded-md text-white  flex items-center gap-2 "
            >
              <IconPlus size={22} />
              <span>Criar novo</span>
            </button>
            <span className="text-sm px-4 py-2 text-custom-gray-light">
              Total cadastrado: {properties.length}
            </span>
          </div>

          {!isLoading ? (
            <SkeletonTheme baseColor="#DDDDDD" highlightColor="#c0bebe">
              <div className="w-full grid grid-cols-1  gap-4 p-8">
                <div className="w-full flex flex-col gap-2">
                  <Skeleton height={25} className="w-full" />
                  <Skeleton height={25} className="w-full" />
                  <Skeleton height={25} className="w-full" />
                  <Skeleton height={25} className="w-full" />
                </div>
              </div>
            </SkeletonTheme>
          ) : (
            <table className="w-full border-collapse shadow-md min-w-[600px]">
              <thead>
                <tr className="bg-[#A6AEBF] text-white">
                  <th className="px-4 py-2 text-left text-xs font-medium">
                    ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium">
                    Registro
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium">
                    Categoria
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium">
                    Cidade
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium">
                    Preço
                  </th>
                  <th className="px-4 py-2  text-left text-xs font-medium">
                    Quartos
                  </th>
                  <th className="px-4 py-2  text-left text-xs font-medium">
                    Garagem
                  </th>
                  <th className="px-4 py-2  text-left text-xs font-medium">
                    Área
                  </th>
                  <th className="px-4 py-2  text-left text-xs font-medium">
                    Transação
                  </th>
                  <th className="px-4 py-2  text-center text-xs font-medium">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="w-full">
                {properties.map((property) => (
                  <tr
                    key={property.id}
                    className="border-b border-gray-200 w-full"
                  >
                    <td className="px-4 py-1 text-xs">{property.id}</td>
                    <td className="px-4 py-1 text-xs">{property.registro}</td>
                    <td className="px-4 py-1 text-xs">
                      {categories[property.categoryId] || "Não encontrada"}
                    </td>
                    <td className="px-4 py-1 text-xs">
                      {cities[property.cityId] || "Cidade não encontrada"}
                    </td>
                    <td className="px-4 py-1 text-xs w-10 text-left">
                      R${property.preco}
                    </td>
                    <td className="px-4 py-1 text-xs w-10 text-left">
                      {property.qtdQuartos}
                    </td>
                    <td className="px-4 py-1 text-xs w-10 text-left">
                      {property.qtdVagasGaragem}
                    </td>
                    <td className="px-4 py-1 text-xs w-10 text-left">
                      {property.area}
                    </td>
                    <td className="px-4 py-1 text-xs">
                      {transactions[property.transacaoId] || "Não encontrada"}
                    </td>
                    <td className="px-4 py-1">
                      <div className="flex items-center justify-center gap-4">
                        <button
                          className="p-2 flex items-center gap-2 rounded-md"
                          onClick={() => {
                            setOpenEditForm(false);
                            setOpenCreateForm(false);
                            controlDelete(property.id);
                          }}
                        >
                          <IconTrash size={20} color="#FF4545" />
                        </button>
                        <button
                          className="p-2 flex items-center gap-2 rounded-md"
                          onClick={() => {
                            setOpenDeleteModal(false);
                            setOpenCreateForm(false);
                            controlEditForm(
                              property.id,
                              property.registro,
                              property.endereco,
                              property.qtdQuartos,
                              property.qtdVagasGaragem,
                              property.descricao,
                              property.preco,
                              property.categoryId,
                              property.cityId,
                              property.transacaoId,
                              property.area,
                              setNewRegistro,
                              setNewEndereco,
                              setNewQtdQuartos,
                              setNewQtdVagasGaragem,
                              setNewDescricao,
                              setNewPreco,
                              setNewCategoryId,
                              setNewCityId,
                              setNewTransactionId,
                              setNewArea
                            );
                          }}
                        >
                          <IconEdit size={20} color="#37AFE1" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {openCreateForm && (
            <section className="fixed w-[800px] h-[500px] overflow-y-scroll top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative w-full mx-auto">
                <div className="w-full">
                  <div className="w-full rounded-lg bg-white p-8 shadow-lg lg:p-12">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm">
                        Cadastrando nova propriedade
                      </span>
                    </div>
                    <form className="space-y-4" onSubmit={handleCreate}>
                      {/* Registro */}
                      <div>
                        <label className="sr-only" htmlFor="registro">
                          Registro
                        </label>
                        <input
                          className="w-full rounded-lg border-gray-200 p-3 text-sm"
                          placeholder="Registro"
                          type="text"
                          id="registro"
                          value={registro}
                          onChange={(e) => setRegistro(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="sr-only" htmlFor="endereco">
                          Endereço
                        </label>
                        <input
                          className="w-full rounded-lg border-gray-200 p-3 text-sm"
                          placeholder="Endereço"
                          type="text"
                          id="endereco"
                          value={endereco}
                          onChange={(e) => setEndereco(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="sr-only" htmlFor="qtdQuartos">
                            Quartos
                          </label>
                          <input
                            className="w-full rounded-lg border-gray-200 p-3 text-sm"
                            placeholder="Quantidade de Quartos"
                            type="number"
                            id="qtdQuartos"
                            onChange={(e) =>
                              setQtdQuartos(Number(e.target.value))
                            }
                          />
                        </div>
                        <div>
                          <label className="sr-only" htmlFor="qtdVagasGaragem">
                            Vagas na Garagem
                          </label>
                          <input
                            className="w-full rounded-lg border-gray-200 p-3 text-sm"
                            placeholder="Vagas na Garagem"
                            type="number"
                            id="qtdVagasGaragem"
                            onChange={(e) =>
                              setQtdVagasGaragem(Number(e.target.value))
                            }
                          />
                        </div>
                      </div>

                      <div className="flex gap-4 items-center w-full">
                        <div>
                          <label htmlFor="transationId" className="sr-only">
                            Transação
                          </label>
                          <select
                            id="transationId"
                            value={transactionId}
                            onChange={(e) =>
                              setTransactionId(parseInt(e.target.value))
                            }
                            className="w-full rounded-lg border-gray-200 p-3 pr-8 text-sm"
                          >
                            <option value="">Método de transação</option>
                            {transactionsList.map((transation) => (
                              <option key={transation.id} value={transation.id}>
                                {transation.nomeTransacao}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="sr-only" htmlFor="area">
                            Área
                          </label>
                          <input
                            className="w-full rounded-lg border-gray-200 p-3 text-sm"
                            placeholder="Área m²"
                            type="number"
                            id="area"
                            onChange={(e) => setArea(Number(e.target.value))}
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="sr-only" htmlFor="descricao">
                          Descrição
                        </label>
                        <textarea
                          className="w-full rounded-lg border-gray-200 p-3 text-sm resize-none"
                          placeholder="Descrição"
                          rows={4}
                          id="descricao"
                          value={descricao}
                          onChange={(e) => setDescricao(e.target.value)}
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="sr-only" htmlFor="preco">
                            Preço
                          </label>
                          <input
                            className="w-full rounded-lg border-gray-200 p-3 text-sm"
                            placeholder="Preço (R$)"
                            type="number"
                            id="preco"
                            onChange={(e) => setPreco(Number(e.target.value))}
                            step="0.01"
                          />
                        </div>

                        <div>
                          <label htmlFor="categoryId" className="sr-only">
                            Categoria
                          </label>
                          <select
                            id="categoryId"
                            value={categoryId}
                            onChange={(e) =>
                              setCategoryId(parseInt(e.target.value))
                            }
                            className="w-full rounded-lg border-gray-200 p-3 text-sm"
                          >
                            <option value="">Selecione uma categoria</option>
                            {categoriesList.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.nomeCategoria}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="cityId" className="block sr-only">
                          Cidade
                        </label>
                        <select
                          id="cityId"
                          value={cityId}
                          onChange={(e) => setCityId(parseInt(e.target.value))}
                          className="w-full rounded-lg border-gray-200 p-3 text-sm"
                        >
                          <option value="">Selecione uma cidade</option>
                          {citiesList.map((city) => (
                            <option key={city.id} value={city.id}>
                              {city.nomeCidade}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="sr-only" htmlFor="urlImagem">
                          URL da Imagem
                        </label>
                        <input
                          id="input-name"
                          className="outline-none text-xs rounded-md bg-neutral-500 text-gray-50 p-2 w-full"
                          type="file"
                          onChange={(e) =>
                            setSelectedFile(e.target.files?.[0] || null)
                          }
                        />
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            type="submit"
                            className="flex items-center gap-2 w-full rounded-lg bg-blue-400 px-4 py-2 font-medium text-white sm:w-auto"
                          >
                            <span className="text-sm">Salvar</span>
                          </button>
                          <button
                            type="button"
                            className="flex items-center gap-2 w-full rounded-lg bg-red-400 px-4 py-2 font-medium text-white sm:w-auto"
                            onClick={() => setOpenCreateForm(false)}
                          >
                            <span className="text-sm">Cancelar</span>
                          </button>
                        </div>
                        <span className="text-center text-xs text-red-500">
                          {statusMessage}
                        </span>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          )}

          {openEditForm && (
            <section className="fixed w-[800px] h-[500px] overflow-y-scroll top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative w-full mx-auto">
                <div className="w-full">
                  <div className="w-full rounded-lg bg-white p-8 shadow-lg lg:p-12">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm">Editando propriedade</span>
                      <span className="text-sm text-custom-gray-light font-medium">
                        ID {editingId}
                      </span>
                    </div>
                    <form className="space-y-4" onSubmit={handleCreate}>
                      {/* Registro */}
                      <div>
                        <label className="sr-only" htmlFor="newRegistro">
                          Registro
                        </label>
                        <input
                          className="w-full rounded-lg border-gray-200 p-3 text-sm"
                          placeholder="Registro"
                          type="text"
                          id="newRegistro"
                          value={newRegistro}
                          onChange={(e) => setNewRegistro(e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="sr-only" htmlFor="newEndereco">
                          Endereço
                        </label>
                        <input
                          className="w-full rounded-lg border-gray-200 p-3 text-sm"
                          placeholder="Endereço"
                          type="text"
                          id="newEndereco"
                          value={newEndereco}
                          onChange={(e) => setNewEndereco(e.target.value)}
                        />
                      </div>

                      <div className="flex gap-4 items-center w-full">
                        <div>
                          <label htmlFor="transationId" className="sr-only">
                            Transação
                          </label>
                          <select
                            id="categoryId"
                            value={newTransactionId}
                            onChange={(e) =>
                              setNewTransactionId(parseInt(e.target.value))
                            }
                            className="w-full rounded-lg border-gray-200 p-3 pr-8 text-sm"
                          >
                            <option value="">Método de transação</option>
                            {transactionsList.map((transation) => (
                              <option key={transation.id} value={transation.id}>
                                {transation.nomeTransacao}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="sr-only" htmlFor="area">
                            Área
                          </label>
                          <input
                            className="w-full rounded-lg border-gray-200 p-3 text-sm"
                            placeholder="Área m²"
                            type="number"
                            id="area"
                            onChange={(e) => setNewArea(Number(e.target.value))}
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="sr-only" htmlFor="newQtdQuartos">
                            Quartos
                          </label>
                          <input
                            className="w-full rounded-lg border-gray-200 p-3 text-sm"
                            placeholder="Quantidade de Quartos"
                            type="number"
                            id="newQtdQuartos"
                            onChange={(e) =>
                              setNewQtdQuartos(Number(e.target.value))
                            }
                          />
                        </div>
                        <div>
                          <label
                            className="sr-only"
                            htmlFor="newQtdVagasGaragem"
                          >
                            Vagas na Garagem
                          </label>
                          <input
                            className="w-full rounded-lg border-gray-200 p-3 text-sm"
                            placeholder="Vagas na Garagem"
                            type="number"
                            id="newQtdVagasGaragem"
                            onChange={(e) =>
                              setNewQtdVagasGaragem(Number(e.target.value))
                            }
                          />
                        </div>
                        <div>
                          <label htmlFor="newCategoryId" className="sr-only">
                            Categoria
                          </label>
                          <select
                            id="newCategoryId"
                            value={newCategoryId}
                            onChange={(e) =>
                              setNewCategoryId(parseInt(e.target.value))
                            }
                            className="w-full rounded-lg border-gray-200 p-3 text-sm"
                          >
                            <option value="">Selecione uma categoria</option>
                            {categoriesList.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.nomeCategoria}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="sr-only" htmlFor="newDescricao">
                          Descrição
                        </label>
                        <textarea
                          className="w-full rounded-lg border-gray-200 p-3 text-sm resize-none"
                          placeholder="Descrição"
                          rows={4}
                          id="newDescricao"
                          value={newDescricao}
                          onChange={(e) => setNewDescricao(e.target.value)}
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="sr-only" htmlFor="newPreco">
                            Preço
                          </label>
                          <input
                            className="w-full rounded-lg border-gray-200 p-3 text-sm"
                            placeholder="Preço (R$)"
                            type="number"
                            id="newPreco"
                            onChange={(e) =>
                              setNewPreco(Number(e.target.value))
                            }
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="newCityId" className="block sr-only">
                          Cidade
                        </label>
                        <select
                          id="newCityId"
                          value={newCityId}
                          onChange={(e) =>
                            setNewCityId(parseInt(e.target.value))
                          }
                          className="w-full rounded-lg border-gray-200 p-3 text-sm"
                        >
                          <option value="">Selecione uma cidade</option>
                          {citiesList.map((city) => (
                            <option key={city.id} value={city.id}>
                              {city.nomeCidade}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button
                            type="submit"
                            className="flex items-center gap-2 w-full rounded-lg bg-blue-400 px-4 py-2 font-medium text-white sm:w-auto"
                            onClick={(e) => {
                              e.preventDefault();
                              updateProperty(
                                editingId,
                                newRegistro,
                                newEndereco,
                                newQtdQuartos,
                                newQtdVagasGaragem,
                                newDescricao,
                                newPreco,
                                newCategoryId,
                                newCityId,
                                newTransactionId,
                                newArea
                              );
                            }}
                          >
                            <span className="text-sm">Salvar</span>
                          </button>
                          <button
                            type="button"
                            className="flex items-center gap-2 w-full rounded-lg bg-red-400 px-4 py-2 font-medium text-white sm:w-auto"
                            onClick={() => setOpenEditForm(false)}
                          >
                            <span className="text-sm">Cancelar</span>
                          </button>
                        </div>
                        <span className="text-center text-xs text-red-500">
                          {statusMessage}
                        </span>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          )}

          {openDeleteModal && (
            <div className="fixed top-1/2 left-1/2  flex flex-col gap-4 transform -translate-x-1/2 -translate-y-1/2 min-w-[300px] rounded-lg bg-white p-8 shadow-lg lg:p-12">
              <span className="text-sm text-custom-gray-light">
                Deseja apagar o redistro N° {editingId} ?
              </span>
              <div className="flex w-full justify-center items-center gap-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 w-full rounded-lg bg-blue-400 px-4 py-2 font-medium text-white sm:w-auto"
                  onClick={handleDelete}
                >
                  <span className="text-sm">Apagar</span>
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 w-full rounded-lg bg-red-400 px-4 py-2 font-medium text-white sm:w-auto"
                  onClick={() => setOpenDeleteModal(false)}
                >
                  <span className="text-sm">Cancelar</span>
                </button>
              </div>
              <div className="flex items-center justify-center w-full h-[24px]">
                <span className="text-center text-xs text-red-500">
                  {statusMessage}
                </span>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
