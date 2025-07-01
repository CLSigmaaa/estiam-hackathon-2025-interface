// app/api/affectations/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const { heure_debut, heure_fin, nom_professeur, sallesIds, classesIds } = await req.json();

    const now = new Date();

    // Supprime les anciennes relations
    await prisma.affectationSalle.deleteMany({ where: { affectationId: id } });
    await prisma.affectationClasse.deleteMany({ where: { affectationId: id } });

    const updated = await prisma.affectation.update({
      where: { id },
      data: {
        heure_debut: new Date(heure_debut),
        heure_fin: new Date(heure_fin),
        nom_professeur,
        date_modification: now,
        salles: {
          create: sallesIds.map((sid: number) => ({ salleId: sid })),
        },
        classes: {
          create: classesIds.map((cid: number) => ({ classeId: cid })),
        },
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Erreur de mise à jour:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    await prisma.affectationSalle.deleteMany({ where: { affectationId: id } });
    await prisma.affectationClasse.deleteMany({ where: { affectationId: id } });

    await prisma.affectation.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erreur de suppression:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}