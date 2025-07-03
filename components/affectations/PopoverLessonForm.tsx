"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PopoverLessonFormProps {
  day: string;
  time: string;
  onSubmit: (lesson: any) => void;
  onClose: () => void;
  rooms: string[];
  teachers: string[];
  classes?: string[]; 
}

export default function PopoverLessonForm({
  day,
  time,
  onSubmit,
  onClose,
  rooms,
  teachers,
  classes = [],
}: PopoverLessonFormProps) {
  const [form, setForm] = useState({
    room: "",
    teacher: "",
    className: "",
    period: "1",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (form.room && form.teacher && form.className) {
      const payload = {
        ...form,
        day,
        time,
        startISO: `${day}T${time}`,
        duration: `${form.period}h`,
      };

      onSubmit(payload);
      onClose();
    } else {
      console.warn("⚠️ Formulaire incomplet. Champs requis manquants :");
      if (!form.room) console.warn("- Salle");
      if (!form.teacher) console.warn("- Enseignant");
      if (!form.className) console.warn("- Classe");
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="font-medium leading-none">Ajouter un cours</h4>
        <p className="text-sm text-muted-foreground">
          {`${day} à ${time}`}
        </p>
      </div>

      <div className="grid gap-3">
        <div className="grid gap-2">
          <Label>Classe</Label>
          <Select
            value={form.className}
            onValueChange={(v) => handleChange("className", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir une classe" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls} value={cls}>
                  {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Salle</Label>
          <Select
            value={form.room}
            onValueChange={(v) => handleChange("room", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir une salle" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((room) => (
                <SelectItem key={room} value={room}>
                  {room}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Enseignant</Label>
          <Select
            value={form.teacher}
            onValueChange={(v) => handleChange("teacher", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir un enseignant" />
            </SelectTrigger>
            <SelectContent>
              {teachers.map((teacher) => (
                <SelectItem key={teacher} value={teacher}>
                  {teacher}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Durée (en heures)</Label>
          <Select
            value={form.period}
            onValueChange={(v) => handleChange("period", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Durée" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 heure</SelectItem>
              <SelectItem value="2">2 heures</SelectItem>
              <SelectItem value="3">3 heures</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSubmit} className="flex-1">
          Ajouter
        </Button>
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
      </div>
    </div>
  );
}