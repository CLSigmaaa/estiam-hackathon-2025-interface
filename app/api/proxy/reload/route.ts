// app/api/proxy/reload/route.ts
import { NextResponse } from "next/server";

const API_URL = process.env.API_JAVA_URL;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!API_URL || !id) {
    return NextResponse.json({ error: "Paramètre ou config manquante" }, { status: 400 });
  }

  try {
    const res = await fetch(`${API_URL}/centrales/reload/${id}`);
    const text = await res.text();
    return new Response(text, { status: res.status });
  } catch (err) {
    console.error("Erreur proxy reload:", err);
    return NextResponse.json({ error: "Erreur proxy" }, { status: 500 });
  }
}