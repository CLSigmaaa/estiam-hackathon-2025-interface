"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Server, Wifi, WifiOff } from "lucide-react";

interface Centrale {
  id: number;
  nom: string;
  topique: string;
  etat: "online" | "offline";
}

export default function GestionCentrales() {
  const [centrales, setCentrales] = useState<Centrale[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCentrale, setEditingCentrale] = useState<Centrale | null>(null);
  const [formData, setFormData] = useState({
    nom: "",
    topique: "",
    etat: "offline" as "online" | "offline",
  });
  const [errors, setErrors] = useState({ nom: "", topique: "" });

  useEffect(() => {
    fetch("/api/centrales")
      .then((res) => res.json())
      .then((data) => setCentrales(data))
      .catch(() =>
        toast("Erreur de chargement", {
          description: "Impossible de charger les centrales depuis l'API.",
        })
      );
  }, []);

  const isTopicUnique = (topic: string, excludeId?: number) =>
    !centrales.some((c) => c.topique === topic && c.id !== excludeId);

  const validateForm = () => {
    const newErrors = { nom: "", topique: "" };
    let valid = true;

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
      valid = false;
    }

    if (!formData.topique.trim()) {
      newErrors.topique = "Le topique est requis";
      valid = false;
    } else if (!isTopicUnique(formData.topique, editingCentrale?.id)) {
      newErrors.topique = "Ce topique est déjà utilisé";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleAdd = () => {
    setEditingCentrale(null);
    setFormData({ nom: "", topique: "", etat: "offline" });
    setErrors({ nom: "", topique: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (centrale: Centrale) => {
    setEditingCentrale(centrale);
    setFormData({
      nom: centrale.nom,
      topique: centrale.topique,
      etat: centrale.etat,
    });
    setErrors({ nom: "", topique: "" });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const method = editingCentrale ? "PUT" : "POST";
    const url = editingCentrale
      ? `/api/centrales/${editingCentrale.id}`
      : "/api/centrales";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: formData.nom,
          topique: formData.topique,
          etat: formData.etat,
        }),
      });

      if (!res.ok) throw new Error();
      const updated = await res.json();

      setCentrales((prev) =>
        editingCentrale
          ? prev.map((c) => (c.id === updated.id ? updated : c))
          : [...prev, updated]
      );

      toast(`Centrale ${editingCentrale ? "modifiée" : "ajoutée"}`, {
        description: `La centrale "${updated.nom}" a été ${editingCentrale ? "modifiée" : "ajoutée"}.`,
      });

      setIsDialogOpen(false);
      setFormData({ nom: "", topique: "", etat: "offline" });
      setEditingCentrale(null);
    } catch {
      toast("Erreur", {
        description: "Échec de l'enregistrement de la centrale.",
      });
    }
  };

  const handleDelete = async (centrale: Centrale) => {
    try {
      const res = await fetch(`/api/centrales/${centrale.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      setCentrales((prev) => prev.filter((c) => c.id !== centrale.id));
      toast("Centrale supprimée", {
        description: `La centrale "${centrale.nom}" a été supprimée.`,
      });
    } catch {
      toast("Erreur", {
        description: `Impossible de supprimer la centrale "${centrale.nom}".`,
      });
    }
  };
  
  const handleTestConnection = async (centrale: Centrale) => {
    toast("Test de communication", {
      description: `Rechargement de la centrale ID ${centrale.id}...`,
    });

    try {
      const res = await fetch(`/api/proxy/reload?id=${centrale.id}`);

      if (!res.ok) throw new Error();

      toast("Reload réussi", {
        description: `La centrale "${centrale.nom}" a bien été rechargée.`,
      });
    } catch {
      toast("Erreur de communication", {
        description: `Impossible de contacter "${centrale.nom}".`,
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Centrales</h1>
          <p className="text-muted-foreground">Déclarez vos centrales MQTT</p>
        </div>
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="w-4 h-4" /> Ajouter
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" /> Centrales enregistrées ({centrales.length})
          </CardTitle>
          <CardDescription>
            Topiques et états des centrales connectées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Topique</TableHead>
                <TableHead>État</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {centrales.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.nom}</TableCell>
                  <TableCell className="font-mono">{c.topique}</TableCell>
                  <TableCell>
                    {c.etat === "online" ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <Wifi className="w-4 h-4" /> En ligne
                      </span>
                    ) : (
                      <span className="text-gray-500 flex items-center gap-1">
                        <WifiOff className="w-4 h-4" /> Hors ligne
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestConnection(c)}
                    >
                      Reload
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(c)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer la centrale</AlertDialogTitle>
                          <AlertDialogDescription>
                            Confirmez la suppression de "{c.nom}" ?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(c)}
                            className="bg-destructive"
                          >
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
            <DialogTitle>
              {editingCentrale ? "Modifier la centrale" : "Ajouter une centrale"}
            </DialogTitle>
            <DialogDescription>Renseignez les informations de la centrale</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className={errors.nom ? "border-destructive" : ""}
              />
              {errors.nom && <p className="text-sm text-destructive">{errors.nom}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="topique">Topique MQTT</Label>
              <Input
                id="topique"
                value={formData.topique}
                onChange={(e) => setFormData({ ...formData, topique: e.target.value })}
                className={errors.topique ? "border-destructive" : ""}
              />
              {errors.topique && (
                <p className="text-sm text-destructive">{errors.topique}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="etat">État</Label>
              <select
                id="etat"
                value={formData.etat}
                onChange={(e) =>
                  setFormData({ ...formData, etat: e.target.value as "online" | "offline" })
                }
                className="border border-input rounded px-3 py-2"
              >
                <option value="online">En ligne</option>
                <option value="offline">Hors ligne</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave}>
              {editingCentrale ? "Modifier" : "Ajouter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}