"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useTheme } from "next-themes"
import { Camera, Moon, Sun, Trash2, Save, Shield, Mail, User } from "lucide-react"

export default function ProfilePage() {
  const { theme, setTheme } = useTheme()
  const [formData, setFormData] = useState({
    fullName: "Sarah Johnson",
    email: "sarah.johnson@ecolenom.edu",
    password: "••••••••••",
    language: "fr",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveChanges = () => {
    // Handle save logic here
    console.log("Sauvegarde des modifications:", formData)
  }

  const handleDeleteAccount = () => {
    // Handle account deletion logic here
    console.log("Suppression du compte")
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Paramètres du Profil</h1>
            <p className="text-muted-foreground">Gérez les paramètres de votre compte et vos préférences</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Basculer le thème</span>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Header Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="relative mx-auto">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Photo de profil" />
                  <AvatarFallback className="text-lg">SJ</AvatarFallback>
                </Avatar>
                <Button size="icon" variant="secondary" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
                  <Camera className="h-4 w-4" />
                  <span className="sr-only">Changer la photo de profil</span>
                </Button>
              </div>
              <div className="space-y-2">
                <CardTitle className="text-xl">{formData.fullName}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-1">
                  <Mail className="h-3 w-3" />
                  {formData.email}
                </CardDescription>
                <Badge variant="secondary" className="gap-1">
                  <Shield className="h-3 w-3" />
                  Administrateur
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations du Profil
                </CardTitle>
                <CardDescription>Mettez à jour vos informations personnelles et coordonnées</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nom Complet</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      placeholder="Entrez votre nom complet"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Adresse Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Entrez votre email"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de Passe</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="Entrez un nouveau mot de passe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Préférence de Langue</Label>
                    <Select value={formData.language} onValueChange={(value) => handleInputChange("language", value)}>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Sélectionnez une langue" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                  <div className="flex gap-3">
                    <Button onClick={handleSaveChanges} className="gap-2">
                      <Save className="h-4 w-4" />
                      Sauvegarder les Modifications
                    </Button>
                    <Button variant="outline">Annuler</Button>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Supprimer le Compte
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action ne peut pas être annulée. Cela supprimera définitivement votre compte et
                          supprimera vos données de nos serveurs.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Supprimer le Compte
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}