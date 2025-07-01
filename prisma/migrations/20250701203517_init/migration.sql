-- CreateEnum
CREATE TYPE "StatutSalle" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "TypeClasse" AS ENUM ('tp', 'td', 'amphi');

-- CreateEnum
CREATE TYPE "StatutCentrale" AS ENUM ('online', 'offline');

-- CreateEnum
CREATE TYPE "TypeInformation" AS ENUM ('info', 'warning', 'error');

-- CreateTable
CREATE TABLE "Salle" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "capacite" INTEGER NOT NULL,
    "statut" "StatutSalle" NOT NULL,

    CONSTRAINT "Salle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Classe" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "effectif" INTEGER NOT NULL,
    "type" "TypeClasse" NOT NULL,

    CONSTRAINT "Classe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Centrale" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "topique" TEXT NOT NULL,
    "etat" "StatutCentrale" NOT NULL,

    CONSTRAINT "Centrale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Affectation" (
    "id" SERIAL NOT NULL,
    "heure_debut" TIMESTAMP(3) NOT NULL,
    "heure_fin" TIMESTAMP(3) NOT NULL,
    "date_creation" TIMESTAMP(3) NOT NULL,
    "date_modification" TIMESTAMP(3) NOT NULL,
    "nom_professeur" TEXT NOT NULL,

    CONSTRAINT "Affectation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffectationSalle" (
    "id" SERIAL NOT NULL,
    "affectationId" INTEGER NOT NULL,
    "salleId" INTEGER NOT NULL,

    CONSTRAINT "AffectationSalle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffectationClasse" (
    "id" SERIAL NOT NULL,
    "affectationId" INTEGER NOT NULL,
    "classeId" INTEGER NOT NULL,

    CONSTRAINT "AffectationClasse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "mail" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Information" (
    "id" SERIAL NOT NULL,
    "type" "TypeInformation" NOT NULL,
    "message" TEXT NOT NULL,
    "statut" BOOLEAN NOT NULL,

    CONSTRAINT "Information_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_mail_key" ON "User"("mail");

-- AddForeignKey
ALTER TABLE "AffectationSalle" ADD CONSTRAINT "AffectationSalle_affectationId_fkey" FOREIGN KEY ("affectationId") REFERENCES "Affectation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffectationSalle" ADD CONSTRAINT "AffectationSalle_salleId_fkey" FOREIGN KEY ("salleId") REFERENCES "Salle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffectationClasse" ADD CONSTRAINT "AffectationClasse_affectationId_fkey" FOREIGN KEY ("affectationId") REFERENCES "Affectation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffectationClasse" ADD CONSTRAINT "AffectationClasse_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "Classe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
