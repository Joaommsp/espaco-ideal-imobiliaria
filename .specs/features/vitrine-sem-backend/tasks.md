# Tarefas — Vitrine sem backend

Todos os caminhos são relativos a `projeto-espaco-ideial-frontend/`.
Um commit atômico por tarefa. O gate de cada tarefa precisa passar antes da
seguinte.

**Gate global (T7):** `npm run build` e `npm run lint`, sem `.env`.

---

## T1 — Catálogo em memória

**Depende de:** nada
**Cobre:** AC-01, AC-02, AC-03

- Adicionar `vitest` como devDependency e o script `test`. Só dev: não entra no
  bundle. É o que dá gate real à lógica nova.
- Criar `src/lib/mocks/catalogo.ts` transcrevendo
  `../projeto-espaco-ideal-backend/prisma/seed.ts`: `CIDADES` (12),
  `CATEGORIAS` (8), `TRANSACOES` (2), `IMOVEIS` (28).
- Ids sequenciais a partir de 1 na ordem do seed, montados por uma função de
  indexação — nada de número solto repetido item a item.
- Cada imóvel sai com `city`, `category` e `transacao` já resolvidos, coerentes
  com `cityId` / `categoryId` / `transacaoId`.
- Sem import de React ou Next.

**Testes:** contagens; ids 1..28 únicos e ordenados; toda relação bate com o id
correspondente; todo imóvel referencia cidade, categoria e transação existentes.

---

## T2 — Camada de serviço sobre o mock

**Depende de:** T1
**Cobre:** AC-04, AC-05, AC-06, AC-07, AC-08, AC-09, AC-10

- Reescrever `src/lib/services/imoveis.ts`: mesmas exportações, mesmas
  assinaturas, mesmos tipos. Sai todo o `fetch` e o par de endereços de API.
- `buscarImovel` rejeita com o id na mensagem quando não existe ou não é
  numérico (AD-002).
- `buscarImoveis` compara os cinco campos por igualdade exata, como o
  `findSearch` do Nest.
- Atraso curto e centralizado numa constante nomeada (AD-003), não espalhado.
- Remover `registrarUsuario` e a interface `NovoUsuario`.
- Devolver cópias, para que nenhuma tela mute o catálogo compartilhado.

**Testes:** um por AC de AC-04 a AC-10, incluindo busca sem correspondência
devolvendo `[]` e imóvel inexistente rejeitando.

---

## T3 — Remover a autenticação

**Depende de:** T2
**Cobre:** AC-11, AC-12, AC-13

- Apagar: `src/app/(authentication)/`, `src/app/api/register/route.ts`,
  `src/app/contexts/AuthContext.tsx`, `src/lib/services/firebase-service.js`,
  `src/app/(internal)/profile/page.tsx`.
- `src/app/(internal)/layout.tsx`: fora `onAuthStateChanged`, `signOut`,
  Firestore, `AuthProvider` e o estado de sessão. O menu lateral perde os itens
  de conta e mantém a navegação.
- `src/components/landing/Cabecalho.tsx`: as props `usuario` e `acaoDeUsuario`
  e o par Entrar/Criar conta saem; entra um botão "Falar no WhatsApp" com
  `CONTATO.whatsapp`, externo.
- `src/app/(internal)/properties/[id]/page.tsx`: sem `useAuth`.

**Gate:** `npx tsc --noEmit` limpo e `grep -rn "firebase" src/` vazio.

---

## T4 — Remover as sobras do pré-redesign

**Depende de:** T3
**Cobre:** AC-18

- Apagar `src/app/(internal)/home/` e os componentes que só ela usava:
  `NewProperties`, `VarietiesSection`, `VarietyCard`, `ReviewsSection`,
  `ReviewCard`, `Footer`, `VisualNavBar`, e `src/lib/services/api-service.js`.
- Conferir `MenuItem`: se o layout ainda usa, fica.
- Remover de `public/` só o que ficou sem nenhuma referência.

**Gate:** `npx tsc --noEmit` limpo; nenhum import apontando para arquivo
apagado.

---

## T5 — Agendamento com nome e WhatsApp

**Depende de:** T3
**Cobre:** AC-15, AC-16, AC-17

- `src/components/imoveis/AgendarVisita.tsx` passa a pedir nome, WhatsApp e
  dia. A prop `nomeDoUsuario` sai.
- Validação: nome e dia obrigatórios, cada erro nomeando o campo; WhatsApp
  opcional, mas com 10 ou 11 dígitos quando preenchido.
- Máscara de telefone e validação viram funções puras em
  `src/lib/utils/telefone.ts` — testáveis e reaproveitáveis, fora do componente.
- A data mínima continua sendo hoje em horário local; manter `paraDataLocal`.
- A tela de confirmação não muda.

**Testes:** máscara progressiva e formato final `(75) 99812-4407`; aceita 10 e
11 dígitos, recusa 9; a validação do formulário aponta o campo que falta.

---

## T6 — Dependências e configuração

**Depende de:** T4, T5
**Cobre:** AC-14, R6.3

- Tirar `firebase`, `bcrypt`, `bcryptjs`, `uuid` e os `@types` correspondentes
  do `package.json`; rodar `npm install` para acertar o lockfile.
- `next.config.mjs`: remover o `remotePattern` do Firebase Storage, manter o do
  Unsplash.
- Apagar `.env.example` do frontend se existir; a demo não tem variável.

**Gate:** `npm run build` conclui.

---

## T7 — README e gate final

**Depende de:** T6
**Cobre:** AC-19, R6.4

- Reescrever `README.md` do frontend: o que é a branch `demo`, que os dados são
  fictícios e ficam no bundle, e o **Root Directory**
  `projeto-espaco-ideial-frontend` a configurar na Vercel.
- Rodar `npm run build`, `npm run lint` e `npm test` sem `.env`.
