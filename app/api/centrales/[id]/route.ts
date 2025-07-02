import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await req.json();

    console.log("[PUT] Corps reçu :", body);

    const { nom, topique } = body;
    let { etat } = body;

    if (!nom || !topique) {
      console.warn("[PUT] Champs requis manquants :", { nom, topique });
      return NextResponse.json({ error: "Nom et topique requis" }, { status: 400 });
    }

    // Valeur par défaut
    etat = ["online", "offline"].includes(etat) ? etat : "offline";

    const updated = await prisma.centrale.update({
      where: { id },
      data: { nom, topique, etat }
    });

    console.log("[PUT] Centrale mise à jour :", updated);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("[PUT] Erreur lors de la mise à jour :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    await prisma.centrale.delete({ where: { id } });
    console.log("[DELETE] Centrale supprimée ID:", id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE] Erreur lors de la suppression :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
