import { NextResponse } from "next/server"

const baseUrl = process.env.API_JAVA_URL 

export async function GET() {
  if (!baseUrl) {
    console.error("API_JAVA_URL non défini")
    return NextResponse.json({ error: "Configuration manquante" }, { status: 500 })
  }

  try {
    const res = await fetch(`${baseUrl}/salles`)
    const text = await res.text()

    if (!res.ok) {
      console.error("[GET /salles] Erreur API Java:", text)
      return NextResponse.json({ error: "Erreur API Java" }, { status: 502 })
    }

    const salles = JSON.parse(text)
    return NextResponse.json(salles)
  } catch (error) {
    console.error("[GET /salles] Erreur serveur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!baseUrl) {
    console.error("API_JAVA_URL non défini")
    return NextResponse.json({ error: "Configuration manquante" }, { status: 500 })
  }

  try {
    const body = await req.json()
    console.log("[POST /salles] Données reçues:", body)

    const { nom, capacite, statut } = body

    if (!nom || typeof capacite !== "number" || !["active", "inactive"].includes(statut)) {
      console.warn("[POST /salles] Requête invalide:", { nom, capacite, statut })
      return NextResponse.json({ error: "Requête invalide" }, { status: 400 })
    }

    const payload = {
      nom,
      capacite,
      statut: statut === "active" ? "LIBRE" : "OCCUPE"
    }

    const res = await fetch(`${baseUrl}/salles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })

    const text = await res.text()

    if (!res.ok) {
      console.error("[POST /salles] Erreur API Java:", text)
      return NextResponse.json({ error: "Erreur API Java" }, { status: 502 })
    }

    const salle = JSON.parse(text)
    return NextResponse.json(salle, { status: 201 })
  } catch (error) {
    console.error("[POST /salles] Erreur serveur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}