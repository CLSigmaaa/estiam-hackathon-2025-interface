// /app/api/export-config/route.ts
import { NextResponse } from "next/server"
import crypto from "crypto"

const SALT = process.env.EXPORT_SALT || "salt"
const PEPPER = process.env.EXPORT_PEPPER || "pepper"
const KEY = crypto.createHash("sha256").update(SALT + PEPPER).digest() // 32 bytes

export async function GET() {
  try {
    // 🔧 Données de test simulées
    const fullData = JSON.stringify({
      timestamp: new Date().toISOString(),
      classes: [
        { id: 1, nom: "Terminale S", type: "groupe" },
        { id: 2, nom: "1ère STMG", type: "classe" },
      ],
      salles: [
        { id: 1, nom: "Salle A101", capacite: 30 },
        { id: 2, nom: "Salle B202", capacite: 25 },
      ],
      affectations: [
        {
          id: 1,
          nom_professeur: "M. Dupont",
          heure_debut: "2025-07-02T08:00:00Z",
          heure_fin: "2025-07-02T09:00:00Z",
          salles: [{ id: 1, nom: "Salle A101" }],
          classes: [{ id: 1, nom: "Terminale S" }],
        },
      ],
      ecrans: [
        { id: 1, nom: "Écran 1", position: "Entrée" },
      ],
      centrales: [
        { id: 1, nom: "Centrale 1", topic: "batiment/A", etat: "online" },
      ],
    })

    // 🔐 Chiffrement AES-256-CBC
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv("aes-256-cbc", KEY, iv)
    const encrypted = Buffer.concat([cipher.update(fullData), cipher.final()])
    const finalBuffer = Buffer.concat([iv, encrypted]) // IV + données chiffrées

    return new NextResponse(finalBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": "attachment; filename=config_backup.json.enc",
      },
    })
  } catch (error) {
    console.error("Erreur export (mock) :", error)
    return NextResponse.json({ error: "Erreur export" }, { status: 500 })
  }
}