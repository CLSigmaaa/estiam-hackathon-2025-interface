import { NextResponse } from "next/server";

const baseUrl = process.env.API_JAVA_URL;

export async function GET() {
  if (!baseUrl) {
    console.error("API_JAVA_URL non défini");
    return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
  }

  try {
    const res = await fetch(`${baseUrl}/classes`);
    const text = await res.text();

    if (!res.ok) {
      console.error("[GET /classes] Erreur API Java:", text);
      return NextResponse.json({ error: "Erreur API externe" }, { status: 502 });
    }

    const classes = JSON.parse(text);
    return NextResponse.json(classes);
  } catch (error) {
    console.error("[GET /classes] Erreur serveur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!baseUrl) {
    console.error("API_JAVA_URL non défini dans .env");
    return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
  }

  try {
    const body = await req.json();
    console.log("📥 [POST /classes] Données reçues :", body);

    const { nom, effectif, type } = body;

    if (!nom || typeof effectif !== "number" || !["ENTIERE", "GROUPE"].includes(type?.toUpperCase())) {
      console.warn("⚠️ [POST /classes] Données invalides :", { nom, effectif, type });
      return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
    }

    const payload = {
      nom,
      effectif,
      type: type.toUpperCase(), 
    };

    console.log("📤 [POST /classes] Payload à envoyer :", payload);
    console.log(`🌐 [POST /classes] Envoi vers : ${baseUrl}/classes`);

    const res = await fetch(`${baseUrl}/classes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log("📨 [POST /classes] Réponse brute :", text);

    if (!res.ok) {
      console.error("❌ [POST /classes] Erreur côté API Java :", text);
      return NextResponse.json({ error: "Erreur API externe" }, { status: 502 });
    }

    const created = JSON.parse(text);
    console.log("✅ [POST /classes] Classe créée avec succès :", created);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("🔥 [POST /classes] Erreur serveur Next.js :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}