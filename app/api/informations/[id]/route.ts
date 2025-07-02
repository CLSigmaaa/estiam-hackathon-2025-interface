// app/api/informations/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const { message, type, statut } = await req.json();

    const updated = await prisma.information.update({
      where: { id },
      data: { message, type, statut },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Erreur de mise à jour information:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    await prisma.information.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur suppression info:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}