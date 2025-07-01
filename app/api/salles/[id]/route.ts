import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(req: Request) {
  try {
    const url = new URL(req.url)
    const id = parseInt(url.pathname.split("/").pop()!)

    const { nom, capacite, statut } = await req.json()

    if (!nom || typeof capacite !== "number" || !["active", "inactive"].includes(statut)) {
      return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 })
    }

    const salle = await prisma.salle.update({
      where: { id },
      data: { nom, capacite, statut },
    })

    return NextResponse.json(salle)
  } catch (error) {
    console.error(`[PUT ${req.url}] Erreur:`, error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url)
    const idRaw = url.pathname.split("/").pop()
    console.log(`[DELETE] Requête reçue pour suppression - URL: ${req.url}, ID brut: ${idRaw}`)

    const id = parseInt(idRaw!)
    if (isNaN(id)) {
      console.warn(`[DELETE] ID invalide : ${idRaw}`)
      return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }

    console.log(`[DELETE] Suppression de la salle avec ID: ${id}`)
    await prisma.salle.delete({ where: { id } })
    console.log(`[DELETE] Salle supprimée avec succès (ID: ${id})`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`[DELETE ${req.url}] Erreur lors de la suppression :`, error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}