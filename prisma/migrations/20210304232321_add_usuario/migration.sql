-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "nome" TEXT,
    "senha" TEXT,
    "entidade" TEXT,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario.id_unique" ON "Usuario"("id");
