"use client"

import { useState } from "react"
import { addProfessor } from "@/services/professeurService"

export default function AjoutProfesseurForm() {
  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await addProfessor({ nom, email })
      setMessage("✅ Professeur ajouté et mail envoyé.")
      setNom("")
      setEmail("")
    } catch (err: any) {
      setMessage("❌ " + err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Nom du professeur</label>
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          className="border p-2 rounded w-full"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Adresse e-mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded w-full"
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Ajouter le professeur
      </button>
      {message && <p className="mt-2">{message}</p>}
    </form>
  )
}