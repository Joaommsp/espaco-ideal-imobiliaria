/**
 * Acesso à API real do sistema. Substitui o antigo fake-api.js, que apontava
 * para um servidor de protótipo que não existe mais — as telas que o usavam
 * nunca listavam nada.
 */
const API_URL = "http://localhost:2002/properties";

async function getProperty() {
  const resposta = await fetch(`${API_URL}/all`);

  if (!resposta.ok) {
    throw new Error(`Não foi possível carregar os imóveis (${resposta.status}).`);
  }

  return resposta.json();
}

async function getPropertyById(id) {
  const resposta = await fetch(`${API_URL}/${id}`);

  if (!resposta.ok) {
    throw new Error(`Não foi possível carregar o imóvel ${id} (${resposta.status}).`);
  }

  return resposta.json();
}

export { getProperty, getPropertyById };
