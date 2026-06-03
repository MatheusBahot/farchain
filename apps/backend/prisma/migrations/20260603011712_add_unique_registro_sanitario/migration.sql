/*
  Warnings:

  - A unique constraint covering the columns `[registroSanitario]` on the table `medicamentos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "medicamentos_registroSanitario_key" ON "medicamentos"("registroSanitario");
