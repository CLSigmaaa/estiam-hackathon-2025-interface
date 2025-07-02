// app/api/informations/route.ts
import { NextResponse } from "next/server";

const baseUrl = process.env.API_JAVA_URL;

export async function GET() {
  if (!baseUrl) {
    console.error("API_JAVA_URL non défini");
    return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
  }

  try {
    const res = await fetch(`${baseUrl}/informations`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("[GET /informations] Erreur API Java:", text);
      return NextResponse.json({ error: "Erreur API externe" }, { status: 502 });
    }

    const infos = JSON.parse(text);
    return NextResponse.json(infos);
  } catch (err) {
    console.error("[GET /informations] Erreur serveur:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!baseUrl) {
    console.error("API_JAVA_URL non défini");
    return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { type, message, statut } = body;

    if (!type || typeof message !== "string" || typeof statut !== "boolean") {
      return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
    }

    const payload = {
      id: 0, // ignoré par l'API Java
      type,
      message,
      statut,
    };

    console.log("[POST /informations] Payload :", payload);

    const res = await fetch(`${baseUrl}/informations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("[POST /informations] Erreur API Java:", text);
      return NextResponse.json({ error: "Erreur API externe" }, { status: 502 });
    }

    const info = JSON.parse(text);
    return NextResponse.json(info, { status: 201 });
  } catch (err) {
    console.error("[POST /informations] Erreur serveur:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
