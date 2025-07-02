"use server"

// TODO : A remplacer par la vraie db 
const users = [
  { id: 1, username: "admin", password: "admin" },
]

export async function loginAction(formData: FormData) {

  await new Promise((resolve) => setTimeout(resolve, 1000))

  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (!username || !password) {
    return {
      success: false,
      message: "Nom d'utilisateur et mot de passe requis",
    }
  }

  const user = users.find((u) => u.username === username && u.password === password)

  if (!user) {
    return {
      success: false,
      message: "Nom d'utilisateur ou mot de passe incorrect",
    }
  }

  // TODO : créer session et token JWT
  return {
    success: true,
    message: "Connexion réussie",
    user: { id: user.id, username: user.username },
  }
}

export async function registerAction(formData: FormData) {

    await new Promise((resolve) => setTimeout(resolve, 1000))

  const username = formData.get("username") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!username || !password || !confirmPassword) {
    return {
      success: false,
      message: "Tous les champs sont requis",
    }
  }

  if (username.length < 3) {
    return {
      success: false,
      message: "Le nom d'utilisateur doit contenir au moins 3 caractères",
    }
  }

  if (password.length < 6) {
    return {
      success: false,
      message: "Le mot de passe doit contenir au moins 6 caractères",
    }
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      message: "Les mots de passe ne correspondent pas",
    }
  }

  // Vérifier si l'utilisateur existe déjà
  const existingUser = users.find((u) => u.username === username)
  if (existingUser) {
    return {
      success: false,
      message: "Ce nom d'utilisateur est déjà utilisé",
    }
  }

  // TODO : Enregistrer l'utilisateur dans la base de données
  const newUser = {
    id: users.length + 1,
    username,
    password,
  }
  users.push(newUser)

  return {
    success: true,
    message: "Compte créé avec succès",
    user: { id: newUser.id, username: newUser.username },
  }
}
