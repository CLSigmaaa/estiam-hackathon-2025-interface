"use client";

import { useState } from "react";

export default function SalleEControlPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const sendTimetableLink = async () => {
    setStatus("loading");
    setError(null);

    const topic = "display/salle-e";
    const message =
      "http://172.19.2.29:3000/?jour=2025-07-01&plage_horaire=08%3A00–10%3A30&salle=E301&salle=E3021&salle=E303&salle=E305";

    try {
      const res = await fetch("/api/centrales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, message }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setError(data?.error || "Erreur inconnue");
      }
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Erreur réseau");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 text-black">
      <h1 className="text-2xl font-bold mb-4">Contrôle affichage Salle E</h1>

      <button
        onClick={sendTimetableLink}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Envoi en cours..." : "Envoyer le lien à la salle E"}
      </button>

      {status === "success" && (
        <p className="text-green-600 mt-4">✅ Message envoyé avec succès !</p>
      )}

      {status === "error" && (
        <p className="text-red-600 mt-4">❌ Erreur : {error}</p>
      )}
    </main>
  );
}