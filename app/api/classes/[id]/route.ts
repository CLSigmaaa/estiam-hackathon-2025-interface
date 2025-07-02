import { NextResponse } from "next/server";

const baseUrl = process.env.API_JAVA_URL; 

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!baseUrl) {
    console.error("API_JAVA_URL non défini");
    return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
  }

  try {
    const id = parseInt(params.id);
    const { nom, effectif, type } = await req.json();

    if (!nom || typeof effectif !== "number" || !["ENTIERE", "GROUPE"].includes(type)) {
      return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
    }

    const payload = {
      id,
      nom,
      effectif,
      type: type.toUpperCase(), 
    };

    const res = await fetch(`${baseUrl}/classes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();

    if (!res.ok) {
      console.error(`[PUT /classes/${id}] Erreur API Java:`, text);
      return NextResponse.json({ error: "Erreur API externe" }, { status: 502 });
    }

    const updated = JSON.parse(text);
    return NextResponse.json(updated);
  } catch (error) {
    console.error(`[PUT /classes/${params.id}] Erreur serveur:`, error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!baseUrl) {
    console.error("API_JAVA_URL non défini");
    return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
  }

  try {
    const id = parseInt(params.id);

    const res = await fetch(`${baseUrl}/classes/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`[DELETE /classes/${id}] Erreur API Java:`, text);
      return NextResponse.json({ error: "Erreur API externe" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[DELETE /classes/${params.id}] Erreur serveur:`, error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}