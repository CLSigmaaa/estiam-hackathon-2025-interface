"use client";

import { useEffect, useState } from "react";
import { TempNavbar } from "@/components/temp-navbar";
import FilterBar from "@/components/affectations/FiltersBar";
import CalendarGrid from "@/components/affectations/CalendarGrid";
import PopoverLessonForm from "@/components/affectations/PopoverLessonForm";

const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function AffectationsPage() {
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");

  const [fetchedRooms, setFetchedRooms] = useState<string[]>([]);
  const [fetchedTeachers, setFetchedTeachers] = useState<string[]>([]);
  const [fetchedClasses, setFetchedClasses] = useState<string[]>([]);

  const [assignedClasses, setAssignedClasses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  const [draggedClass, setDraggedClass] = useState<any>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ day: string; time: string } | null>(null);
  const [newLesson, setNewLesson] = useState({
    name: "",
    room: "",
    teacher: "",
    students: "",
    period: 1,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, affRes, classesRes] = await Promise.all([
          fetch("/api/salles"),
          fetch("/api/affectations"),
          fetch("/api/classes"),
        ]);

        const roomsData = await roomsRes.json();
        const affData = await affRes.json();
        const classData = await classesRes.json();

        // Salles actives
        const activeRooms = roomsData.filter((r: any) => r.statut === "active").map((r: any) => r.nom);
        setFetchedRooms(activeRooms);

        // Liste des classes globales
        const classNames = classData.map((cls: any) => cls.nom);
        setFetchedClasses(classNames);

        const transformed: Record<string, any> = {};
        const uniqueTeachers = new Set<string>();

        affData.forEach((aff: any) => {
  const start = new Date(aff.heure_debut);
  if (isNaN(start.getTime())) {
    console.warn("Date invalide pour l'affectation :", aff);
    return; // skip invalid date
  }

  const time = start.toISOString().substring(11, 16);
  const day = start.toLocaleDateString("en-US", { weekday: "long" });

  const room = aff.salles?.[0]?.nom ?? "Inconnue";
  const teacher = aff.nom_professeur ?? "Inconnu";
  const className = aff.classes?.[0]?.nom ?? "Sans nom";

  uniqueTeachers.add(teacher);

  const key = `${day}-${time}`;
  transformed[key] = {
    id: aff.id,
    name: className,
    teacher: teacher,
    room: room,
    students: aff.classes?.[0]?.effectif ?? 0,
    status: "confirmed",
  };
});


        setFetchedTeachers([...uniqueTeachers]);
        setAssignedClasses(transformed);
      } catch (err) {
        console.error("Erreur de chargement :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredClasses = Object.fromEntries(
    Object.entries(assignedClasses).filter(([_, cls]) => {
      const matchRoom = selectedRoom === "all" || cls.room === selectedRoom;
      const matchTeacher = selectedTeacher === "all" || cls.teacher === selectedTeacher;
      const matchClass = selectedClass === "all" || cls.name === selectedClass;
      return matchRoom && matchTeacher && matchClass;
    })
  );

  const handleDragStart = (e: React.DragEvent, classItem: any) => {
    setDraggedClass(classItem);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e: React.DragEvent, day: string, time: string) => {
    e.preventDefault();
    if (draggedClass) {
      console.log(`Assigning ${draggedClass.name} to ${day} at ${time}`);
      setDraggedClass(null);
    }
  };

  const handleCellClick = (day: string, time: string) => {
    setSelectedCell({ day, time });
    setPopoverOpen(true);
  };

  const handleAddLesson = () => {
    if (selectedCell && newLesson.name && newLesson.room && newLesson.teacher) {
      console.log(`Adding lesson: ${newLesson.name} to ${selectedCell.day} at ${selectedCell.time}`);
      setPopoverOpen(false);
      setNewLesson({ name: "", room: "", teacher: "", students: "", period: 1 });
      setSelectedCell(null);
    }
  };

  const resetPopover = () => {
    setPopoverOpen(false);
    setNewLesson({ name: "", room: "", teacher: "", students: "", period: 1 });
    setSelectedCell(null);
  };

  return (
    <div>
      <TempNavbar />

      {!loading && (
        <FilterBar
          rooms={fetchedRooms}
          teachers={fetchedTeachers}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          selectedTeacher={selectedTeacher}
          setSelectedTeacher={setSelectedTeacher}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
          classes={fetchedClasses}
        />
      )}

      <CalendarGrid
        weekdays={weekdays}
        timeSlots={timeSlots}
        assignedClasses={filteredClasses}
        draggedClass={draggedClass}
        handleDrop={handleDrop}
        handleCellClick={handleCellClick}
        handleDragOver={(e) => e.preventDefault()}
        selectedCell={selectedCell}
        popoverOpen={popoverOpen}
        resetPopover={resetPopover}
      >
        <PopoverLessonForm
          selectedCell={selectedCell}
          popoverOpen={popoverOpen}
          newLesson={newLesson}
          setNewLesson={setNewLesson}
          handleAddLesson={handleAddLesson}
          resetPopover={resetPopover}
          rooms={fetchedRooms}
          teachers={fetchedTeachers}
        />
      </CalendarGrid>
    </div>
  );
}