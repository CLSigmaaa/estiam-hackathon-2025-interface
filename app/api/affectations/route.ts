import { NextResponse } from "next/server";

const baseUrl = process.env.API_JAVA_URL;

export async function GET() {
  if (!baseUrl) {
    console.error("❌ API_JAVA_URL non défini");
    return NextResponse.json(
      { error: "Configuration manquante" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(`${baseUrl}/affectations`, { cache: "no-store" });
    const text = await res.text();

    if (!res.ok) {
      console.error("❌ [GET /affectations] Erreur API Java :", text);
      return NextResponse.json(
        { error: "Erreur API externe" },
        { status: 502 }
      );
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
      heureDebut,
      heureFin,
      nomProfesseur,
      salles,
      classes,
    } = body;

    if (
      !heureDebut ||
      !heureFin ||
      !nomProfesseur ||
      !Array.isArray(salles) ||
      !Array.isArray(classes) ||
      salles.length === 0 ||
      classes.length === 0
    ) {
      console.warn("⚠️ [POST /affectations] Données invalides :", body);
      return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
    }

    const now = new Date().toISOString();

    const payload = {
      heureDebut,
      heureFin,
      dateCreation: now,
      dateModification: now,
      nomProfesseur,
      salles: salles.map((salle) => ({
        id: salle.id,
        nom: salle.nom,
        capacite: salle.capacite,
        statut: salle.statut ?? "OCCUPE",
      })),
      classes: classes.map((classe) => ({
        id: classe.id,
        nom: classe.nom,
        effectif: classe.effectif,
        type: classe.type ?? "ENTIERE",
      })),
    };

    console.log("📤 [POST /affectations] Payload à envoyer :", payload);

    console.log("🧪 JSON.stringify(payload) :", JSON.stringify(payload));
    const res = await fetch(`${baseUrl}/affectations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
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
