import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const informations = await prisma.information.findMany()
  return NextResponse.json(informations)
}

export async function POST(req: Request) {
  try {
    const { message, type, statut } = await req.json();

    const info = await prisma.information.create({
      data: { message, type, statut },
    });

    return NextResponse.json(info);
  } catch (error) {
    console.error("Erreur de création d'information:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}