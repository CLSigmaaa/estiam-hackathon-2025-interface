import { NextResponse } from "next/server";


export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const baseUrl = process.env.API_JAVA_URL;
  if (!baseUrl) {
    console.error("API_JAVA_URL non défini dans .env");
    return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
  }

  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const body = await req.json();
    console.log("[PUT] Corps reçu :", body);

    const { nom, topique } = body;
    let { etat } = body;

    if (!nom || !topique) {
      console.warn("[PUT] Champs requis manquants :", { nom, topique });
      return NextResponse.json({ error: "Nom et topique requis" }, { status: 400 });
    }

    etat = etat === "online" ? "ACTIVE" : "INACTIVE";

    const payload = { id, nom, topique, etat };
    console.log("[PUT] Payload envoyé à l’API Java :", payload);

    const res = await fetch(`${baseUrl}/centrales/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const responseText = await res.text();
    if (!res.ok) {
      console.error("[PUT] Erreur API Java :", responseText);
      return NextResponse.json({ error: `Erreur API Java : ${responseText}` }, { status: 502 });
    }

    const result = JSON.parse(responseText);
    console.log("[PUT] Centrale mise à jour via API Java :", result);
    return NextResponse.json(result);

  } catch (error) {
    console.error("[PUT] Erreur Next.js :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const baseUrl = process.env.API_JAVA_URL;
  if (!baseUrl) {
    console.error("API_JAVA_URL non défini dans .env");
    return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
  }

  try {
    const id = parseInt(params.id);

    const res = await fetch(`${baseUrl}/centrales/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error(`[DELETE] Erreur côté API externe : ${res.status}`);
      return NextResponse.json({ error: "Erreur API externe" }, { status: 502 });
    }

    console.log("[DELETE] Centrale supprimée via API Java - ID:", id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE] Exception côté Next.js :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
