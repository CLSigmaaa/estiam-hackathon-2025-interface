import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const classes = await prisma.classe.findMany();
    return NextResponse.json(classes);
  } catch (error) {
    console.error("Erreur GET classes:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { nom, effectif, type } = await req.json();

    if (!["tp", "td", "amphi"].includes(type)) {
      return NextResponse.json({ error: "Type de classe invalide" }, { status: 400 });
    }

    const created = await prisma.classe.create({
      data: { nom, effectif, type },
    });

    return NextResponse.json(created);
  } catch (error) {
    console.error("Erreur POST classe:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}