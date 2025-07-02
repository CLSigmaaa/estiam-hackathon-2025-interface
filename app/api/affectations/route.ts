import { NextResponse } from "next/server";

const baseUrl = process.env.API_JAVA_URL;

export async function GET() {
  if (!baseUrl) {
    console.error("❌ API_JAVA_URL non défini");
    return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
  }

  try {
    const res = await fetch(`${baseUrl}/affectations`, { cache: "no-store" });
    const text = await res.text();

    if (!res.ok) {
      console.error("❌ [GET /affectations] Erreur API Java :", text);
      return NextResponse.json({ error: "Erreur API externe" }, { status: 502 });
    }

    const data = JSON.parse(text);
    console.log("✅ [GET /affectations] Données reçues :", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("🔥 [GET /affectations] Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!baseUrl) {
    console.error("❌ API_JAVA_URL non défini");
    return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
  }

  try {
    const body = await req.json();
    console.log("📥 [POST /affectations] Données reçues :", body);

    const {
      heure_debut,
      heure_fin,
      nom_professeur,
      sallesIds,
      classesIds,
    } = body;

    if (
      !heure_debut ||
      !heure_fin ||
      !nom_professeur ||
      !Array.isArray(sallesIds) ||
      !Array.isArray(classesIds)
    ) {
      console.warn("⚠️ [POST /affectations] Données invalides :", body);
      return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
    }

    const now = new Date().toISOString();

    const payload = {
      heureDebut: heure_debut,
      heureFin: heure_fin,
      nomProfesseur: nom_professeur,
      dateCreation: now,
      dateModification: now,
      salles: sallesIds.map((id: number) => ({ id })),
      classes: classesIds.map((id: number) => ({ id })),
    };

    console.log("📤 [POST /affectations] Payload à envoyer :", payload);

    const res = await fetch(`${baseUrl}/affectations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("❌ [POST /affectations] Erreur API Java :", text);
      return NextResponse.json({ error: "Erreur API externe" }, { status: 502 });
    }

    const created = JSON.parse(text);
    console.log("✅ [POST /affectations] Affectation créée :", created);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("🔥 [POST /affectations] Erreur serveur :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}