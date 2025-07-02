import { NextResponse } from "next/server";

const baseUrl = process.env.API_JAVA_URL;

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!baseUrl) {
    console.error("❌ API_JAVA_URL non défini");
    return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
  }

  try {
    const id = parseInt(params.id);
    const {
      heure_debut,
      heure_fin,
      nom_professeur,
      sallesIds,
      classesIds
    } = await req.json();

    if (
      !heure_debut ||
      !heure_fin ||
      !nom_professeur ||
      !Array.isArray(sallesIds) ||
      !Array.isArray(classesIds)
    ) {
      return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
    }

    const now = new Date().toISOString();

    const payload = {
      id,
      heureDebut: heure_debut,
      heureFin: heure_fin,
      nomProfesseur: nom_professeur,
      dateModification: now,
      // dateCreation est ignorée ici car déjà présente en base
      salles: sallesIds.map((id: number) => ({ id })),
      classes: classesIds.map((id: number) => ({ id })),
    };

    console.log("📤 [PUT /affectations] Payload envoyé :", payload);

    const res = await fetch(`${baseUrl}/affectations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("❌ [PUT /affectations] Erreur API Java :", text);
      return NextResponse.json({ error: "Erreur API externe" }, { status: 502 });
    }

    const updated = JSON.parse(text);
    console.log("✅ [PUT /affectations] Réponse :", updated);
    return NextResponse.json(updated);
  } catch (err) {
    console.error("🔥 [PUT /affectations] Erreur serveur :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!baseUrl) {
    console.error("❌ API_JAVA_URL non défini");
    return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
  }

  try {
    const id = parseInt(params.id);

    console.log("🗑️ [DELETE /affectations] Suppression de :", id);

    const res = await fetch(`${baseUrl}/affectations/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("❌ [DELETE /affectations] Erreur API Java :", text);
      return NextResponse.json({ error: "Erreur API externe" }, { status: 502 });
    }

    console.log("✅ [DELETE /affectations] Suppression réussie");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("🔥 [DELETE /affectations] Erreur serveur :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}