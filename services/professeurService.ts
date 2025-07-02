export async function addProfessor(data: {
  nom: string
  email: string
}) {
  const res = await fetch("/api/professeurs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || "Erreur lors de l’ajout du professeur")
  }

  return await res.json()
}