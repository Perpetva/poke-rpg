/*
  Warnings:

  - The primary key for the `Jogador` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."Pokemon" DROP CONSTRAINT "Pokemon_jogadorId_fkey";

-- AlterTable
ALTER TABLE "Jogador" DROP CONSTRAINT "Jogador_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Jogador_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Jogador_id_seq";

-- AlterTable
ALTER TABLE "Pokemon" ALTER COLUMN "jogadorId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
