import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const centrales = await prisma.centrale.findMany();
    console.log("[GET] centrales récupérées :", centrales);
    return NextResponse.json(centrales);
  } catch (error) {
    console.error("[GET] Erreur lors de la récupération des centrales :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[POST] Corps reçu :", body);

    const { nom, topique } = body;
    let { etat } = body;

    if (!nom || !topique) {
      console.warn("[POST] Champs manquants :", { nom, topique });
      return NextResponse.json(
        { error: "Nom et topique requis" },
        { status: 400 }
      );
    }

    // Valeur par défaut pour `etat`
    etat = ["online", "offline"].includes(etat) ? etat : "offline";

    const nouvelle = await prisma.centrale.create({
      data: { nom, topique, etat },
    });

    console.log("[POST] Centrale créée :", nouvelle);
    return NextResponse.json(nouvelle, { status: 201 });
  } catch (error) {
    console.error("[POST] Erreur lors de la création :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}