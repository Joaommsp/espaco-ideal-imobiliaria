# Espaço Ideal — vitrine

Site público da imobiliária: landing, catálogo com filtros, ficha do imóvel e
agendamento de visita.

Esta é a branch **`demo`** — a versão de exibição, feita para publicar sem
infraestrutura. Não há API, banco nem autenticação: o catálogo mora no próprio
bundle. A versão com backend (NestJS + Prisma + PostgreSQL + Firebase) está na
`main`.

> Os 28 imóveis, os preços e as praças são fictícios, e as fotos foram geradas
> por IA. Nenhum formulário envia dado para lugar nenhum.

## Rodando

```bash
npm install
npm run dev
```

Nenhuma variável de ambiente. Nada para subir antes.

| Comando         | O que faz                                  |
| --------------- | ------------------------------------------ |
| `npm run dev`   | desenvolvimento em http://localhost:3000   |
| `npm run build` | build de produção                          |
| `npm run lint`  | ESLint                                     |
| `npm test`      | Vitest — catálogo, serviços e regras puras |

## Publicando na Vercel

O repositório é um monorepo e este projeto é uma pasta dentro dele. Ao importar,
configure:

**Root Directory:** `projeto-espaco-ideial-frontend`

O resto a Vercel detecta sozinha (Next.js 14). Sem variável de ambiente.

## Como os dados funcionam sem backend

Todo o acesso a dados passa por `src/lib/services/imoveis.ts`. Na `main` esse
módulo fala com a API; aqui ele lê `src/lib/mocks/catalogo.ts`, transcrito do
seed do Prisma — 12 cidades, 8 categorias, 2 negócios e 28 imóveis, com as
relações já resolvidas.

Como as assinaturas exportadas são as mesmas, nenhuma tela sabe da troca. Duas
escolhas que valem saber:

- **As funções continuam assíncronas, com um atraso curto.** Responder na hora
  apagaria os estados de carregamento — parte do que este site tem para mostrar.
- **Imóvel inexistente rejeita a promessa**, em vez de devolver vazio. A API
  respondia `200 null` e a tela caía num erro sem mensagem.

O agendamento valida os campos e percorre o fluxo inteiro — carregando, erro,
confirmação — mas nada sai do navegador.

## Estrutura

```
src/
├── app/                  rotas (App Router)
│   ├── page.tsx          landing
│   └── (internal)/       catálogo, ficha do imóvel e busca por rota
├── components/
│   ├── landing/          cabeçalho, globo das praças, rodapé
│   ├── imoveis/          grade, esqueleto, aviso de erro, agendamento
│   └── ui/               botão, campos, paginação, menus, faixa de preço
├── data/                 praças, contato e navegação
└── lib/
    ├── mocks/catalogo.ts o catálogo
    ├── services/         a camada que as telas chamam
    ├── types/            o formato do imóvel
    └── utils/            formatadores, telefone, praças
```

## Autor

**João Marcos** — Frontend & UI/UX ·
[Portfólio](https://softwaredeveloper-jmmsp.vercel.app/) ·
[GitHub](https://github.com/Joaommsp) ·
[LinkedIn](https://www.linkedin.com/in/joaomarcos10oficial/)
