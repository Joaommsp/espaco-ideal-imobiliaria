# Como rodar

Precisa apenas de Docker. Nada de Node, Postgres ou Prisma instalados na máquina.

```bash
cp .env.example .env     # só na primeira vez
docker compose up -d
```

| Serviço | Endereço                | O que é                          |
| ------- | ----------------------- | -------------------------------- |
| Site    | http://localhost:2000   | Next 14 — vitrine de imóveis     |
| Painel  | http://localhost:2001   | Next 14 — administração          |
| API     | http://localhost:2002   | NestJS + Prisma                  |
| Banco   | localhost:2005          | PostgreSQL 16                    |

Na primeira subida o backend aplica as migrations e roda o seed sozinho
(6 cidades, 5 categorias, 2 transações e 8 imóveis de exemplo). O seed é
idempotente: rodar de novo não duplica nada.

O código dos três projetos é montado do host, então editar um arquivo recarrega
o serviço — não precisa rebuildar para desenvolver.

## Comandos do dia a dia

```bash
docker compose logs -f backend     # acompanhar um serviço
docker compose restart frontend    # reiniciar um serviço
docker compose down                # parar tudo (mantém o banco)
docker compose down -v             # parar e apagar o banco
docker compose build --no-cache    # rebuildar após mudar dependências
```

Para abrir o banco:

```bash
docker compose exec db psql -U espacoideal -d espacoideal
```

## Portas

Todas configuráveis no `.env`: `SITE_PORT`, `ADMIN_PORT`, `API_PORT`, `DB_PORT`.
O painel roda em 4000 dentro do container (é o que o script `dev` faz) e é
publicado em 3001 no host.

## Pontos que ainda dependem de coisa externa

- **Firebase** — login de usuário e do administrador usam dois projetos
  Firebase, com as chaves fixas no código. Enquanto continuarem válidas, o
  login funciona; se forem revogadas, é preciso trocar em
  `src/lib/services/firebase-*.js`.
- **Imagens dos imóveis** — o campo é uma URL. O seed usa fotos do Unsplash; o
  painel envia para o Storage do Firebase.
