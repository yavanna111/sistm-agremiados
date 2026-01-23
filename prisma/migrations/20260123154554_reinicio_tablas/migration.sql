-- CreateTable
CREATE TABLE "Agremiado" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cop" TEXT NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "colegio" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "habilitado" TEXT NOT NULL,
    "fechaRegistro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Agremiado_cop_key" ON "Agremiado"("cop");
