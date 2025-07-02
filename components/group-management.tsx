"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Pencil, Trash2, Plus, Users, GraduationCap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Group {
  id: string
  name: string
  type: "classe" | "groupe"
  effectif: number
}

export default function Component() {
  const [groups, setGroups] = useState<Group[]>([
    { id: "1", name: "6ème A", type: "classe", effectif: 28 },
    { id: "2", name: "Groupe Anglais LV1", type: "groupe", effectif: 15 },
    { id: "3", name: "5ème B", type: "classe", effectif: 25 },
  ])

  const [formData, setFormData] = useState({
    name: "",
    type: "" as "classe" | "groupe" | "",
    effectif: "",
  })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validation nom
    if (!formData.name.trim()) {
      newErrors.name = "Le nom est obligatoire"
    } else {
      // Vérifier l'unicité du nom
      const existingGroup = groups.find(
        (g) => g.name.toLowerCase() === formData.name.toLowerCase() && g.id !== editingId,
      )
      if (existingGroup) {
        newErrors.name = "Ce nom existe déjà"
      }
    }

    // Validation type
    if (!formData.type) {
      newErrors.type = "Le type est obligatoire"
    }

    // Validation effectif
    const effectif = Number.parseInt(formData.effectif)
    if (!formData.effectif) {
      newErrors.effectif = "L'effectif est obligatoire"
    } else if (isNaN(effectif) || effectif <= 0) {
      newErrors.effectif = "L'effectif doit être un nombre positif"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const groupData = {
      name: formData.name.trim(),
      type: formData.type as "classe" | "groupe",
      effectif: Number.parseInt(formData.effectif),
    }

    if (editingId) {
      // Modification
      setGroups(groups.map((group) => (group.id === editingId ? { ...group, ...groupData } : group)))
      toast({
        title: "Groupe modifié",
        description: `Le groupe "${groupData.name}" a été modifié avec succès.`,
      })
      setEditingId(null)
    } else {
      // Ajout
      const newGroup: Group = {
        id: Date.now().toString(),
        ...groupData,
      }
      setGroups([...groups, newGroup])
      toast({
        title: "Groupe ajouté",
        description: `Le groupe "${groupData.name}" a été ajouté avec succès.`,
      })
    }

    // Reset form
    setFormData({ name: "", type: "", effectif: "" })
    setErrors({})
  }

  const handleEdit = (group: Group) => {
    setFormData({
      name: group.name,
      type: group.type,
      effectif: group.effectif.toString(),
    })
    setEditingId(group.id)
    setErrors({})
  }

  const handleDelete = (id: string) => {
    const group = groups.find((g) => g.id === id)
    setGroups(groups.filter((g) => g.id !== id))
    toast({
      title: "Groupe supprimé",
      description: `Le groupe "${group?.name}" a été supprimé avec succès.`,
      variant: "destructive",
    })
  }

  const handleCancel = () => {
    setFormData({ name: "", type: "", effectif: "" })
    setEditingId(null)
    setErrors({})
  }

  const getTypeIcon = (type: "classe" | "groupe") => {
    return type === "classe" ? <GraduationCap className="w-4 h-4" /> : <Users className="w-4 h-4" />
  }

  const getTypeBadgeVariant = (type: "classe" | "groupe") => {
    return type === "classe" ? "default" : "secondary"
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-6 h-6" />
        <h1 className="text-3xl font-bold">Gestion des Groupes</h1>
      </div>

      {/* Formulaire */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {editingId ? "Modifier le groupe" : "Ajouter un nouveau groupe"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du groupe *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: 6ème A, Groupe Anglais..."
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.name}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as "classe" | "groupe" })}
                >
                  <SelectTrigger className={errors.type ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classe">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Classe
                      </div>
                    </SelectItem>
                    <SelectItem value="groupe">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Groupe
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.type}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="effectif">Effectif *</Label>
                <Input
                  id="effectif"
                  type="number"
                  min="1"
                  value={formData.effectif}
                  onChange={(e) => setFormData({ ...formData, effectif: e.target.value })}
                  placeholder="Ex: 25"
                  className={errors.effectif ? "border-red-500" : ""}
                />
                {errors.effectif && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.effectif}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">{editingId ? "Modifier" : "Ajouter"}</Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Annuler
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Liste des groupes */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des groupes ({groups.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {groups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucun groupe enregistré</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Effectif</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groups.map((group) => (
                    <TableRow key={group.id}>
                      <TableCell className="font-medium">{group.name}</TableCell>
                      <TableCell>
                        <Badge variant={getTypeBadgeVariant(group.type)} className="flex items-center gap-1 w-fit">
                          {getTypeIcon(group.type)}
                          {group.type === "classe" ? "Classe" : "Groupe"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-mono">{group.effectif}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(group)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(group.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
