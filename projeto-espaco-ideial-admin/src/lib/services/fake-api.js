const API_URL = "http://localhost:3001/propriedades";

async function getProperty() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    console.log("Propriedades:", data);
    return data;
  } catch (error) {
    console.error("Erro ao buscar propriedades:", error);
  }
}

async function getPropertyById(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const data = await response.json();
    console.log("Propriedade:", data);
    return data;
  } catch (error) {
    console.error("Erro ao buscar os dados da propriedade", error);
  }
}

export { getProperty, getPropertyById };
