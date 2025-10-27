-- CreateTable
CREATE TABLE "Jogador" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "picUrl" TEXT,
    "pokeCoins" INTEGER NOT NULL DEFAULT 500,
    "diaryLogin" TIMESTAMP(3),
    "items" JSONB,

    CONSTRAINT "Jogador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pokemon" (
    "id" SERIAL NOT NULL,
    "specieId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "exp" INTEGER NOT NULL,
    "maxHp" INTEGER NOT NULL,
    "currentHp" INTEGER NOT NULL,
    "types" TEXT[],
    "evolutionStage" INTEGER NOT NULL,
    "nextEvolutionLevel" INTEGER NOT NULL,
    "jogadorId" INTEGER NOT NULL,
    "ivId" INTEGER,
    "baseStatsId" INTEGER,
    "currentStatsId" INTEGER,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Iv" (
    "id" SERIAL NOT NULL,
    "hp" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "specialAttack" INTEGER NOT NULL,
    "specialDefense" INTEGER NOT NULL,

    CONSTRAINT "Iv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BaseStats" (
    "id" SERIAL NOT NULL,
    "hp" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "specialAttack" INTEGER NOT NULL,
    "specialDefense" INTEGER NOT NULL,

    CONSTRAINT "BaseStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentStats" (
    "id" SERIAL NOT NULL,
    "hp" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "specialAttack" INTEGER NOT NULL,
    "specialDefense" INTEGER NOT NULL,

    CONSTRAINT "CurrentStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Move" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "maxPp" INTEGER NOT NULL,
    "currentPp" INTEGER NOT NULL,
    "power" INTEGER NOT NULL,
    "accuracy" INTEGER NOT NULL,
    "moveCategory" TEXT NOT NULL,
    "pokemonId" INTEGER,

    CONSTRAINT "Move_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Jogador_phone_key" ON "Jogador"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_ivId_key" ON "Pokemon"("ivId");

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_baseStatsId_key" ON "Pokemon"("baseStatsId");

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_currentStatsId_key" ON "Pokemon"("currentStatsId");

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_jogadorId_fkey" FOREIGN KEY ("jogadorId") REFERENCES "Jogador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_ivId_fkey" FOREIGN KEY ("ivId") REFERENCES "Iv"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_baseStatsId_fkey" FOREIGN KEY ("baseStatsId") REFERENCES "BaseStats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pokemon" ADD CONSTRAINT "Pokemon_currentStatsId_fkey" FOREIGN KEY ("currentStatsId") REFERENCES "CurrentStats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Move" ADD CONSTRAINT "Move_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
