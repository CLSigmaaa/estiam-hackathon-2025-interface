"use client";

import { useEffect, useState } from "react";
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
  DialogTrigger,
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
import { Badge } from "@/components/ui/badge";
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
import { AlertCircle, Edit, MapPin, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Salle {
  id: number;
  nom: string;
  capacite: number;
  statut: "active" | "inactive";
}

interface FormData {
  nom: string;
  capacite: string;
  statut: "active" | "inactive";
}

export default function ClassroomManagement() {
  const [salles, setSalles] = useState<Salle[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSalle, setSelectedSalle] = useState<Salle | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nom: "",
    capacite: "",
    statut: "inactive",
  });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    fetch("/api/salles")
      .then((res) => res.json())
      .then(setSalles)
      .catch(() =>
        toast("Erreur", { description: "Impossible de charger les salles." })
      );
  }, []);

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};

    if (!formData.nom.trim()) errors.nom = "Le nom est requis";
    if (
      !formData.capacite ||
      isNaN(Number(formData.capacite)) ||
      Number(formData.capacite) <= 0
    )
      errors.capacite = "Capacité invalide";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({ nom: "", capacite: "", statut: "inactive" });
    setFormErrors({});
  };

  const handleAddSalle = async () => {
    if (!validateForm()) return;

    try {
      const res = await fetch("/api/salles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: formData.nom,
          capacite: Number(formData.capacite),
          statut: formData.statut,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error();
      setSalles((prev) => [...prev, data]);
      toast("Salle ajoutée", {
        description: `Salle "${data.nom}" ajoutée avec succès.`,
      });
      setIsDialogOpen(false);
      resetForm();
    } catch {
      toast("Erreur", { description: "Échec lors de l'ajout de la salle." });
    }
  };

  const handleEditSalle = async () => {
    if (!validateForm() || !selectedSalle) return;

    try {
      const res = await fetch(`/api/salles/${selectedSalle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: formData.nom,
          capacite: Number(formData.capacite),
          statut: formData.statut,
        }),
      });

      const updated = await res.json();
      if (!res.ok) throw new Error();
      setSalles((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      toast("Salle modifiée", {
        description: `Salle "${updated.nom}" modifiée avec succès.`,
      });
      setIsEditDialogOpen(false);
      setSelectedSalle(null);
      resetForm();
    } catch {
      toast("Erreur", { description: "Impossible de modifier la salle." });
    }
  };

  const handleDeleteSalle = async () => {
    if (!selectedSalle) {
      console.warn(
        "[handleDeleteSalle] Aucune salle sélectionnée pour suppression."
      );
      return;
    }

    try {
      const res = await fetch(`/api/salles/${selectedSalle.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setSalles((prev) => prev.filter((s) => s.id !== selectedSalle.id));
      toast("Salle supprimée", {
        description: `Salle "${selectedSalle.nom}" supprimée.`,
      });
      setSelectedSalle(null);
    } catch {
      toast("Erreur", {
        description: "Échec lors de la suppression de la salle.",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des salles</h1>
          <p className="text-muted-foreground">
            Ajoutez, modifiez ou supprimez les salles disponibles
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter une salle</DialogTitle>
              <DialogDescription>
                Renseignez le nom, la capacité et le statut
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nom</Label>
                <Input
                  value={formData.nom}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                  className={formErrors.nom ? "border-destructive" : ""}
                />
                {formErrors.nom && (
                  <p className="text-destructive text-sm">{formErrors.nom}</p>
                )}
              </div>
              <div>
                <Label>Capacité</Label>
                <Input
                  type="number"
                  value={formData.capacite}
                  onChange={(e) =>
                    setFormData({ ...formData, capacite: e.target.value })
                  }
                  className={formErrors.capacite ? "border-destructive" : ""}
                />
                {formErrors.capacite && (
                  <p className="text-destructive text-sm">
                    {formErrors.capacite}
                  </p>
                )}
              </div>
              <div>
                <Label>Statut</Label>
                <Select
                  value={formData.statut}
                  onValueChange={(v) =>
                    setFormData({
                      ...formData,
                      statut: v as "active" | "inactive",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir le statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddSalle}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" /> Liste des salles
          </CardTitle>
          <CardDescription>
            {salles.length} salle{salles.length > 1 ? "s" : ""} enregistrée
            {salles.length > 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Capacité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salles.map((salle) => (
                <TableRow key={salle.id}>
                  <TableCell>{salle.nom}</TableCell>
                  <TableCell>{salle.capacite}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        salle.statut === "active" ? "default" : "secondary"
                      }
                    >
                      {salle.statut}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedSalle(salle);
                          setFormData({
                            nom: salle.nom,
                            capacite: salle.capacite.toString(),
                            statut: salle.statut,
                          });
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedSalle(salle)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Supprimer la salle
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer la salle «{" "}
                              {salle.nom} » ?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogAction
                            className="bg-destructive"
                            onClick={handleDeleteSalle}
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Édition */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la salle</DialogTitle>
            <DialogDescription>
              Mettre à jour les informations de la salle
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom</Label>
              <Input
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Capacité</Label>
              <Input
                type="number"
                value={formData.capacite}
                onChange={(e) =>
                  setFormData({ ...formData, capacite: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Statut</Label>
              <Select
                value={formData.statut}
                onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    statut: v as "active" | "inactive",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleEditSalle}>Valider</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
