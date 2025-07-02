// app/api/informations/[id]/route.ts
import { NextResponse } from "next/server";

const baseUrl = process.env.API_JAVA_URL;

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!baseUrl) {
    console.error("API_JAVA_URL non défini");
    return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
  }

  try {
    const id = parseInt(params.id);
    const { type, message, statut } = await req.json();

    if (!type || typeof message !== "string" || typeof statut !== "boolean") {
      return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
    }

    const payload = {
      id,
      type,
      message,
      statut,
    };

    console.log(`[PUT /informations/${id}] Payload :`, payload);

    const res = await fetch(`${baseUrl}/informations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();

    if (!res.ok) {
      console.error(`[PUT /informations/${id}] Erreur API Java:`, text);
      return NextResponse.json({ error: "Erreur API externe" }, { status: 502 });
    }

    const updated = JSON.parse(text);
    return NextResponse.json(updated);
  } catch (err) {
    console.error(`[PUT /informations/${params.id}] Erreur serveur:`, err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}