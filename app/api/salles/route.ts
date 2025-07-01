import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const salles = await prisma.salle.findMany()
    return NextResponse.json(salles)
  } catch (error) {
    console.error("[GET /salles] Erreur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("[POST /salles] Données reçues:", body)

    const { nom, capacite, statut } = body

    if (!nom || !capacite || !["active", "inactive"].includes(statut)) {
      console.warn("[POST /salles] Requête invalide:", { nom, capacite, statut })
      return NextResponse.json({ error: "Requête invalide" }, { status: 400 })
    }

    const salle = await prisma.salle.create({
      data: {
        nom,
        capacite: Number(capacite),
        statut
      }
    })

    console.log("[POST /salles] Salle créée avec succès:", salle)

    return NextResponse.json(salle)
  } catch (error) {
    console.error("[POST /salles] Erreur serveur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}