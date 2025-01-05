-- CreateTable
CREATE TABLE "Usuario_cliente" (
    "id" SERIAL NOT NULL,
    "id_firebase" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "Usuario_cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Propriedade" (
    "id" SERIAL NOT NULL,
    "id_cidade" INTEGER NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "registro" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "qtd_quartos" INTEGER NOT NULL,
    "qtd_vagas_garagem" INTEGER NOT NULL,
    "descricao" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "imagem" TEXT NOT NULL,

    CONSTRAINT "Propriedade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agendamento_propriedade" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_propriedade" INTEGER NOT NULL,
    "data_agendamento" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agendamento_propriedade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cadastro_propriedade" (
    "id" SERIAL NOT NULL,
    "id_propriedade" INTEGER NOT NULL,
    "id_administrador" INTEGER NOT NULL,

    CONSTRAINT "Cadastro_propriedade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cidade" (
    "id" SERIAL NOT NULL,
    "nome_cidade" TEXT NOT NULL,

    CONSTRAINT "Cidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nome_categoria" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cliente_id_firebase_key" ON "Usuario_cliente"("id_firebase");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_cliente_email_key" ON "Usuario_cliente"("email");

-- AddForeignKey
ALTER TABLE "Propriedade" ADD CONSTRAINT "Propriedade_id_cidade_fkey" FOREIGN KEY ("id_cidade") REFERENCES "Cidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Propriedade" ADD CONSTRAINT "Propriedade_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento_propriedade" ADD CONSTRAINT "Agendamento_propriedade_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuario_cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agendamento_propriedade" ADD CONSTRAINT "Agendamento_propriedade_id_propriedade_fkey" FOREIGN KEY ("id_propriedade") REFERENCES "Propriedade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cadastro_propriedade" ADD CONSTRAINT "Cadastro_propriedade_id_propriedade_fkey" FOREIGN KEY ("id_propriedade") REFERENCES "Propriedade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
