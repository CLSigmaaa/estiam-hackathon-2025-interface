"use client";

import { MapPin, Users, CalendarDays, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface Props {
  rooms: string[];
  teachers: string[];
  classes: string[];
  selectedRoom: string;
  setSelectedRoom: (value: string) => void;
  selectedTeacher: string;
  setSelectedTeacher: (value: string) => void;
  selectedClass: string;
  setSelectedClass: (value: string) => void;
}

export default function FiltersBar({
  rooms,
  teachers,
  classes,
  selectedRoom,
  setSelectedRoom,
  selectedTeacher,
  setSelectedTeacher,
  selectedClass,
  setSelectedClass,
}: Props) {
  return (
    <div className="bg-background border-b border-border px-6 py-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Salle */}
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedRoom} onValueChange={setSelectedRoom}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sélectionner une salle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les salles</SelectItem>
              {rooms.map((room) => (
                <SelectItem key={room} value={room}>
                  {room}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Professeur */}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sélectionner un professeur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les professeurs</SelectItem>
              {teachers.map((teacher) => (
                <SelectItem key={teacher} value={teacher}>
                  {teacher}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Classe */}
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sélectionner une classe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les classes</SelectItem>
              {classes.map((cls) => (
                <SelectItem key={cls} value={cls}>
                  {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Réinitialiser */}
        {(selectedRoom !== "all" ||
          selectedTeacher !== "all" ||
          selectedClass !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedRoom("all");
              setSelectedTeacher("all");
              setSelectedClass("all");
            }}
          >
            <X className="h-4 w-4 mr-1" />
            Réinitialiser les filtres
          </Button>
        )}
      </div>
    </div>
  );
}