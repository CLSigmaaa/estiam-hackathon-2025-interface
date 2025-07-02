"use client"

import { useState } from "react"

export default function ImportTestPage() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/import-config", {
        method: "POST",
        body: formData,
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Erreur inconnue")

      setResult(json.data)
      setError(null)
    } catch (err: any) {
      setResult(null)
      setError(err.message)
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">🛠️ Test d’import de configuration</h1>

      <input
        type="file"
        accept=".enc"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Importer
      </button>

      {error && <p className="text-red-600 font-medium">❌ {error}</p>}

      {result && (
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto max-h-[500px]">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}