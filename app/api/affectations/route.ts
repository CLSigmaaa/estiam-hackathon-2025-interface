import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const affectations = await prisma.affectation.findMany({
      include: {
        salles: { include: { salle: true } },
        classes: { include: { classe: true } },
      },
    });

    // On aplati les sous-objets
    const transformed = affectations.map((aff: any) => ({
      ...aff,
      salles: aff.salles.map((s: any) => s.salle),
      classes: aff.classes.map((c: any) => c.classe),
    }));

    return NextResponse.json(transformed);
  } catch (error) {
    console.error("Erreur de récupération des affectations:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      heure_debut,
      heure_fin,
      nom_professeur,
      sallesIds,
      classesIds,
    } = body;

    const now = new Date();

    const newAffectation = await prisma.affectation.create({
      data: {
        heure_debut: new Date(heure_debut),
        heure_fin: new Date(heure_fin),
        nom_professeur,
        date_creation: now,
        date_modification: now,
        salles: {
          create: sallesIds.map((id: number) => ({ salleId: id })),
        },
        classes: {
          create: classesIds.map((id: number) => ({ classeId: id })),
        },
      },
    });

    return NextResponse.json(newAffectation);
  } catch (error) {
    console.error("Erreur de création d'une affectation:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}