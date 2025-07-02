import { NextResponse } from "next/server"
import { Readable } from "stream"
import crypto from "crypto"

export const dynamic = "force-dynamic"

const SALT = process.env.EXPORT_SALT || "salt"
const PEPPER = process.env.EXPORT_PEPPER || "pepper"
const KEY = crypto.createHash("sha256").update(SALT + PEPPER).digest() // 32 bytes

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file") as File

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier reçu." }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  try {
    const iv = buffer.subarray(0, 16)
    const encrypted = buffer.subarray(16)

    const decipher = crypto.createDecipheriv("aes-256-cbc", KEY, iv)
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
    const json = JSON.parse(decrypted.toString("utf8"))

    return NextResponse.json({ success: true, data: json })
  } catch (err) {
    console.error("Erreur de déchiffrement :", err)
    return NextResponse.json({ error: "Le fichier est invalide ou corrompu." }, { status: 400 })
  }
}