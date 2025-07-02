import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const { nom, effectif, type } = await req.json();

    if (!["tp", "td", "amphi"].includes(type)) {
      return NextResponse.json({ error: "Type de classe invalide" }, { status: 400 });
    }

    const updated = await prisma.classe.update({
      where: { id },
      data: { nom, effectif, type },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erreur PUT classe:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    await prisma.classe.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE classe:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}