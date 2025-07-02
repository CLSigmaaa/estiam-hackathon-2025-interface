import { NextResponse } from "next/server"

const baseUrl = process.env.API_JAVA_URL

export async function PUT(req: Request) {
  if (!baseUrl) {
    console.error("API_JAVA_URL non défini")
    return NextResponse.json({ error: "Configuration manquante" }, { status: 500 })
  }

  try {
    const url = new URL(req.url)
    const id = parseInt(url.pathname.split("/").pop()!)
    const { nom, capacite, statut } = await req.json()

    if (!nom || typeof capacite !== "number" || !["active", "inactive"].includes(statut)) {
      return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 })
    }

    const payload = {
      id,
      nom,
      capacite,
      statut: statut === "active" ? "LIBRE" : "OCCUPE" // ou selon logique métier
    }

    const res = await fetch(`${baseUrl}/salles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })

    const text = await res.text()
    if (!res.ok) {
      console.error(`[PUT] Erreur API Java: ${text}`)
      return NextResponse.json({ error: "Erreur API Java" }, { status: 502 })
    }

    const salle = JSON.parse(text)
    return NextResponse.json(salle)

  } catch (error) {
    console.error("[PUT] Erreur serveur :", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  if (!baseUrl) {
    console.error("API_JAVA_URL non défini")
    return NextResponse.json({ error: "Configuration manquante" }, { status: 500 })
  }

  try {
    const url = new URL(req.url)
    const idRaw = url.pathname.split("/").pop()
    const id = parseInt(idRaw!)

    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 })
    }

    const res = await fetch(`${baseUrl}/salles/${id}`, { method: "DELETE" })

    if (!res.ok) {
      const errorText = await res.text()
      console.error(`[DELETE] Erreur API Java : ${errorText}`)
      return NextResponse.json({ error: "Erreur API Java" }, { status: 502 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("[DELETE] Erreur serveur :", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}