import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(req: NextRequest) {
  const { nom, email } = await req.json()

  if (!nom || !email) {
    return NextResponse.json({ error: "Nom et email requis." }, { status: 400 })
  }

  const baseUrl = process.env.API_JAVA_URL
  if (!baseUrl) {
    return NextResponse.json(
      { error: "Variable d'environnement API_JAVA_URL manquante." },
      { status: 500 }
    )
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const rgpdLink = `${baseUrl}/rgpd-charte?email=${encodeURIComponent(email)}`
  const rgpdCharter = `
    Bonjour ${nom},

    Vous avez été ajouté comme professeur dans notre système de gestion des emplois du temps.

    Afin de respecter la règlementation RGPD, veuillez lire et accepter notre charte :

    ${rgpdLink}

    Merci,
    L'équipe MonitorControl
  `

  try {
    await transporter.sendMail({
      from: `"MonitorControl" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Consentement RGPD - MonitorControl",
      text: rgpdCharter,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Erreur d'envoi d'email :", error)
    return NextResponse.json({ error: "Échec de l'envoi du mail." }, { status: 500 })
  }
}