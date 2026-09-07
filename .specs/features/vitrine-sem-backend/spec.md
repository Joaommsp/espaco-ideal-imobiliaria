# Vitrine sem backend

Versão de exibição do site público **Espaço Ideal**, para publicar na Vercel
como template de portfólio. Sem API, sem banco e sem Firebase: o catálogo vive
no próprio bundle.

- **Escopo:** só `projeto-espaco-ideial-frontend/`.
- **Branch:** `demo`. O `main` continua com backend real.
- **Fora do escopo (decisão do usuário):** painel administrativo, login,
  cadastro, e qualquer aviso de "demonstração" na interface.

## Contexto

O redesign concentrou todo o acesso a dados em `src/lib/services/imoveis.ts`.
As telas nunca chamam `fetch` direto. Trocar a implementação desse módulo,
preservando as assinaturas exportadas, converte o site inteiro para mock sem
tocar em nenhuma página.

O que sobra de trabalho é o que **não** passa por esse módulo: a autenticação
Firebase e a página `/home` anterior ao redesign.

## Requisitos

### R1 — Catálogo em memória

- **R1.1** Um módulo de dados exporta cidades, categorias, transações e imóveis
  transcritos de `projeto-espaco-ideal-backend/prisma/seed.ts`: 12 cidades,
  8 categorias, 2 transações, 28 imóveis.
- **R1.2** Cada imóvel carrega as relações resolvidas (`city`, `category`,
  `transacao`), como o `include` do Prisma devolvia — a UI depende disso para
  escrever "Casa em Salvador" e distinguir venda de locação.
- **R1.3** Os ids são estáveis e sequenciais a partir de 1, na ordem do seed:
  as rotas `/properties/[id]` e `/search/...` são endereçáveis e um link
  compartilhado continua abrindo o mesmo imóvel.
- **R1.4** O módulo de dados não importa nada de React nem de Next: é dado
  puro, testável isoladamente.

### R2 — Camada de serviço preservada

- **R2.1** `src/lib/services/imoveis.ts` mantém os nomes, parâmetros e tipos de
  retorno que já exporta. Nenhuma página importadora muda por causa dela.
- **R2.2** `listarImoveis()` devolve os 28 imóveis com relações.
- **R2.3** `buscarImovel(id)` devolve o imóvel do id; para id inexistente ou
  não numérico, **rejeita** com mensagem que nomeia o id procurado.
- **R2.4** `buscarImoveis(filtros)` replica a semântica do
  `PropertyService.findSearch`: igualdade exata nos cinco campos
  (`transacaoId`, `cityId`, `categoryId`, `qtdQuartos`, `qtdVagasGaragem`),
  devolvendo lista vazia quando nada casa.
- **R2.5** `listarCidades`, `listarCategorias` e `listarTransacoes` devolvem
  `Opcao[]` (`{ id, nome }`), como hoje.
- **R2.6** As funções são assíncronas e resolvem após um atraso curto, para que
  os estados de carregamento das telas continuem aparecendo em vez de piscar.
- **R2.7** `agendarVisita(dados)` resolve sem erro e sem rede.
- **R2.8** `registrarUsuario` deixa de existir — não há mais cadastro.

### R3 — Autenticação removida

- **R3.1** Nenhum arquivo do projeto importa `firebase`.
- **R3.2** As rotas `/login`, `/register` e `/profile` deixam de existir, junto
  do `AuthContext`, do `firebase-service.js` e da rota `POST /api/register`.
- **R3.3** O menu lateral perde os itens de conta (entrar, criar conta, meu
  perfil, sair) e mantém a navegação do site.
- **R3.4** O cabeçalho troca os botões "Entrar" e "Criar conta" por um único
  botão "Falar no WhatsApp", usando o número de `data/contato.ts`.
- **R3.5** `firebase`, `bcrypt`, `bcryptjs` e `uuid` saem do `package.json` —
  existiam só para o cadastro, e `bcrypt` é binário nativo que atrapalha o
  build na Vercel.

### R4 — Agendamento sem usuário logado

- **R4.1** O formulário pede **nome**, **WhatsApp** e **dia da visita**.
- **R4.2** Nome e dia são obrigatórios; cada erro é exibido junto ao formulário
  e nomeia o campo que falta.
- **R4.3** O WhatsApp é opcional; quando preenchido, aceita telefone brasileiro
  com 10 ou 11 dígitos e é formatado enquanto se digita.
- **R4.4** O dia da visita não pode ser anterior a hoje em horário local.
- **R4.5** A confirmação é a mesma tela de sucesso que já existe, sem menção a
  demonstração.
- **R4.6** O botão de envio mostra estado de carregamento e fica desabilitado
  durante o envio.

### R5 — Sobras do pré-redesign

- **R5.1** A rota `/home` e os componentes que só ela usava
  (`NewProperties`, `VarietiesSection`, `VarietyCard`, `ReviewsSection`,
  `ReviewCard`, `Footer`, `VisualNavBar`, `api-service.js`) são removidos.
- **R5.2** Nenhum import quebrado permanece; nenhum componente fica órfão.

### R6 — Pronto para a Vercel

- **R6.1** `npm run build` conclui sem erro e sem variável de ambiente.
- **R6.2** `npm run lint` não acusa erro.
- **R6.3** As 8 fotos do Unsplash continuam liberadas em `next.config.mjs`;
  o `remotePattern` do Firebase Storage sai, porque nada mais o serve.
- **R6.4** O `README.md` do frontend diz o que é esta branch e qual é o
  **Root Directory** a configurar na Vercel.

## Critérios de aceitação

| ID     | Critério                                                                                      | Requisito |
| ------ | --------------------------------------------------------------------------------------------- | --------- |
| AC-01  | O catálogo tem 28 imóveis, 12 cidades, 8 categorias e 2 transações                             | R1.1      |
| AC-02  | Todo imóvel traz `city`, `category` e `transacao` preenchidos e coerentes com seus ids         | R1.2      |
| AC-03  | Os ids dos imóveis são 1..28 sem repetição, na ordem do seed                                   | R1.3      |
| AC-04  | `listarImoveis()` devolve 28 itens                                                              | R2.2      |
| AC-05  | `buscarImovel(9)` devolve o imóvel de registro `EI-1009`                                        | R2.3      |
| AC-06  | `buscarImovel(999)` e `buscarImovel("abc")` rejeitam com o id na mensagem                       | R2.3      |
| AC-07  | `buscarImoveis` com os cinco filtros casando devolve só os imóveis que batem em **todos**       | R2.4      |
| AC-08  | `buscarImoveis` sem correspondência devolve `[]`, não erro                                      | R2.4      |
| AC-09  | `listarCidades/Categorias/Transacoes` devolvem `{ id, nome }` com as contagens de AC-01         | R2.5      |
| AC-10  | `agendarVisita` resolve sem lançar                                                              | R2.7      |
| AC-11  | `grep -r "firebase"` no `src/` não retorna nada                                                 | R3.1      |
| AC-12  | Os arquivos de auth listados em R3.2 não existem mais                                           | R3.2      |
| AC-13  | O cabeçalho renderiza "Falar no WhatsApp" apontando para `CONTATO.whatsapp`                     | R3.4      |
| AC-14  | `firebase`, `bcrypt`, `bcryptjs` e `uuid` não constam no `package.json`                         | R3.5      |
| AC-15  | Enviar o agendamento sem nome mostra erro que cita o nome, e não conclui                        | R4.2      |
| AC-16  | Telefone com 10 e com 11 dígitos é aceito; com 9 é recusado                                     | R4.3      |
| AC-17  | A máscara formata `75998124407` como `(75) 99812-4407`                                          | R4.3      |
| AC-18  | Nenhum arquivo referencia os componentes removidos em R5.1                                      | R5.2      |
| AC-19  | `npm run build` e `npm run lint` passam sem variável de ambiente                                | R6.1 R6.2 |

## Decisões

- **AD-001 — Mock atrás da mesma interface, não nas páginas.** A troca acontece
  só em `imoveis.ts`. Alternativa descartada: `NEXT_PUBLIC_API_URL` com
  fallback, que deixaria caminho morto de rede num template que nunca terá API.
- **AD-002 — Imóvel inexistente rejeita em vez de devolver `null`.** O Nest
  respondia `200 null` e a tela caía num erro sem mensagem. Rejeitando, o
  `AvisoDeErro` mostra motivo legível.
- **AD-003 — Atraso curto nas funções do mock.** Sem ele os estados de
  carregamento — parte do que este template existe para mostrar — nunca
  apareceriam.
- **AD-004 — Sem aviso de demonstração na interface.** Pedido explícito do
  usuário. O aviso fica no `README.md`, fora da tela.
