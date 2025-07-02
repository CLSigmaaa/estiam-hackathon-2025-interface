"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Users, Plus, Edit, Trash2 } from "lucide-react"

interface Classe {
  id: number
  nom: string
  effectif: number
  type: "GROUPE" | "ENTIERE"
}

export default function ClassroomAdmin() {
  const [classes, setClasses] = useState<Classe[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Classe | null>(null)
  const [form, setForm] = useState({ nom: "", effectif: "", type: "GROUPE" })
  const [errors, setErrors] = useState({ nom: "", effectif: "", type: "" })

  useEffect(() => {
    fetch("/api/classes")
      .then((res) => res.json())
      .then(setClasses)
      .catch(() =>
        toast("Erreur", { description: "Impossible de charger les classes." })
      )
  }, [])

  const validate = () => {
    const err = { nom: "", effectif: "", type: "" }
    let valid = true

    if (!form.nom.trim()) {
      err.nom = "Nom requis"
      valid = false
    }
    const n = parseInt(form.effectif)
    if (!form.effectif || isNaN(n) || n <= 0) {
      err.effectif = "Effectif invalide"
      valid = false
    }
    if (!["ENTIERE", "GROUPE"].includes(form.type)) {
      err.type = "Type invalide"
      valid = false
    }

    setErrors(err)
    return valid
  }

  const reset = () => {
    setForm({ nom: "", effectif: "", type: "ENTIERE" })
    setErrors({ nom: "", effectif: "", type: "" })
    setEditing(null)
  }

  const openEdit = (c: Classe) => {
    setEditing(c)
    setForm({ nom: c.nom, effectif: c.effectif.toString(), type: c.type })
    setIsDialogOpen(true)
  }

  const save = async () => {
    if (!validate()) return
    const payload = {
      nom: form.nom,
      effectif: parseInt(form.effectif),
      type: form.type as "ENTIERE" | "GROUPE",
    }

    const method = editing ? "PUT" : "POST"
    const url = editing ? `/api/classes/${editing.id}` : "/api/classes"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setClasses((prev) =>
        editing ? prev.map((c) => (c.id === data.id ? data : c)) : [...prev, data]
      )
      toast(`Classe ${editing ? "modifiée" : "ajoutée"}`, {
        description: `La classe "${data.nom}" a été ${editing ? "modifiée" : "créée"}.`,
      })
      setIsDialogOpen(false)
      reset()
    } catch {
      toast("Erreur", { description: "Impossible d'enregistrer la classe." })
    }
  }

  const remove = async (id: number) => {
    try {
      const res = await fetch(`/api/classes/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setClasses((prev) => prev.filter((c) => c.id !== id))
      toast("Classe supprimée", { description: `Classe supprimée avec succès.` })
    } catch {
      toast("Erreur", { description: "Suppression impossible." })
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des classes</h1>
          <p className="text-muted-foreground">Liste des groupes d'élèves</p>
        </div>
        <Button onClick={() => { reset(); setIsDialogOpen(true) }} className="gap-2">
          <Plus className="w-4 h-4" /> Ajouter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" /> {classes.length} classes
          </CardTitle>
          <CardDescription>Effectifs et types de cours</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Effectif</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.nom}</TableCell>
                  <TableCell>{c.effectif}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{c.type}</Badge>
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(c)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer la classe</AlertDialogTitle>
                          <AlertDialogDescription>
                            Voulez-vous supprimer « {c.nom} » ?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => remove(c.id)} className="bg-destructive">
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier" : "Ajouter"} une classe</DialogTitle>
            <DialogDescription>
              Renseignez les informations de la classe.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                className={errors.nom ? "border-destructive" : ""}
              />
              {errors.nom && <p className="text-sm text-destructive">{errors.nom}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="effectif">Effectif</Label>
              <Input
                id="effectif"
                type="number"
                value={form.effectif}
                onChange={(e) => setForm({ ...form, effectif: e.target.value })}
                className={errors.effectif ? "border-destructive" : ""}
              />
              {errors.effectif && <p className="text-sm text-destructive">{errors.effectif}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Classe["type"] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ENTIERE">ENTIERE</SelectItem>
                  <SelectItem value="GROUPE">GROUPE</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
            <Button onClick={save}>{editing ? "Modifier" : "Ajouter"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
