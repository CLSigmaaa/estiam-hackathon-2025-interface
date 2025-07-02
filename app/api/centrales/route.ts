import { NextResponse } from "next/server";

export async function GET() {
  try {
    const baseUrl = process.env.API_JAVA_URL;
    if (!baseUrl) {
      console.error("API_JAVA_URL non défini dans .env");
      return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
    }

    const res = await fetch(`${baseUrl}/centrales`);
    if (!res.ok) {
      console.error("[GET] Erreur API externe :", res.status);
      return NextResponse.json({ error: "Erreur API externe" }, { status: 502 });
    }

    const data = await res.json();

    const transformed = data.map((c: any) => ({
      id: c.id,
      nom: c.nom,
      topique: c.topique,
      etat: c.etat === "ACTIVE" ? "online" : "offline",
    }));

    console.log("[GET] centrales depuis API Java :", transformed);
    return NextResponse.json(transformed);
  } catch (error) {
    console.error("[GET] Exception :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const baseUrl = process.env.API_JAVA_URL;
  if (!baseUrl) {
    console.error("API_JAVA_URL non défini dans .env");
    return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
  }

  try {
    const body = await req.json();
    console.log("[POST] Corps reçu :", body);

    const { nom, topique } = body;
    let { etat } = body;

    if (!nom || !topique) {
      console.warn("[POST] Champs manquants :", { nom, topique });
      return NextResponse.json(
        { error: "Nom et topique requis" },
        { status: 400 }
      );
    }

    // Conversion de l'état
    etat = etat === "online" ? "ACTIVE" : "INACTIVE";

    // Construction du payload SANS ID
    const payload = { nom, topique, etat };
    console.log("[POST] Payload final :", payload);

    const res = await fetch(`${baseUrl}/centrales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const responseText = await res.text();
    if (!res.ok) {
      console.error("[POST] Erreur API Java :", responseText);
      return NextResponse.json({ error: `Erreur API Java : ${responseText}` }, { status: 502 });
    }

    const result = JSON.parse(responseText);
    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error("[POST] Erreur Next.js :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
