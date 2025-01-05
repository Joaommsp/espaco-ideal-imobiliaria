const API_PROPERTIES_URL = "http://localhost:3002/properties";
const API_CITIES_URL = "http://localhost:3002/cities";
const API_CATEGORIES_URL = "http://localhost:3002/categories";
const API_TRANSATIONS_URL = "http://localhost:3002/transations";

async function getProperty() {
  try {
    const response = await fetch(`${API_PROPERTIES_URL}/all`);
    const data = await response.json();
    console.log("Propriedades:", data);
    return data;
  } catch (error) {
    console.error("Erro ao buscar propriedades:", error);
  }
}

async function getPropertyById(id) {
  try {
    const response = await fetch(`${API_PROPERTIES_URL}/${id}`);
    const data = await response.json();
    console.log("Propriedades", data);
    return data;
  } catch (error) {
    console.error("Erro ao buscar propriedades", error);
  }
}

async function getSearchProperties(
  transactionId,
  cityId,
  categoryId,
  qtdQuartos,
  qtdVagasGaragem
) {
  try {
    const response = await fetch(
      `${API_PROPERTIES_URL}/${transactionId}/${cityId}/${categoryId}/${qtdQuartos}/${qtdVagasGaragem}`
    );
    const data = await response.json();
    console.log("Propriedades:", data);
    return data;
  } catch (error) {
    console.error("Erro ao buscar propriedades:", error);
  }
}

async function fetchCities() {
  try {
    const response = await fetch(`${API_CITIES_URL}/all`);
    if (!response.ok) throw new Error("Erro ao buscar cidades");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchCategories() {
  try {
    const response = await fetch(`${API_CATEGORIES_URL}/all`);
    if (!response.ok) throw new Error("Erro ao buscar categorias");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchTransactions() {
  try {
    const response = await fetch(`${API_TRANSATIONS_URL}/all`);
    if (!response.ok) throw new Error("Erro ao buscar transações");
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export {
  getProperty,
  getPropertyById,
  fetchCategories,
  fetchCities,
  fetchTransactions,
  getSearchProperties,
};
