"use client";

import { useEffect, useState } from "react";
import { TempNavbar } from "@/components/temp-navbar";
import FilterBar from "@/components/affectations/FiltersBar";
import CalendarGrid from "@/components/affectations/CalendarGrid";
import PopoverLessonForm from "@/components/affectations/PopoverLessonForm";
import { format } from "date-fns";

function generateTimeSlots(
  start: string,
  end: string,
  stepMinutes: number
): string[] {
  const slots: string[] = [];
  let [hour, minute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  while (hour < endHour || (hour === endHour && minute < endMinute)) {
    slots.push(
      `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`
    );
    minute += stepMinutes;
    if (minute >= 60) {
      minute -= 60;
      hour += 1;
    }
  }

  return slots;
}

const timeSlots = generateTimeSlots("08:00", "18:00", 30);
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function AffectationsPage() {
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");

  const [fetchedRooms, setFetchedRooms] = useState<string[]>([]);
  const [fetchedTeachers, setFetchedTeachers] = useState<string[]>([]);
  const [fetchedClasses, setFetchedClasses] = useState<string[]>([]);

  const [allRooms, setAllRooms] = useState<any[]>([]);
  const [allClasses, setAllClasses] = useState<any[]>([]);

  const [assignedClasses, setAssignedClasses] = useState<Record<string, any>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  const [draggedClass, setDraggedClass] = useState<any>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    day: string;
    time: string;
  } | null>(null);

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

        setAllRooms(roomsData);
        setAllClasses(classData);

        const activeRooms = roomsData
          .filter((r: any) => r.statut === "LIBRE")
          .map((r: any) => r.nom);
        setFetchedRooms(activeRooms);

        const classNames = classData.map((cls: any) => cls.nom);
        setFetchedClasses(classNames);

        const transformed: Record<string, any> = {};
        const uniqueTeachers = new Set<string>();

        affData.forEach((aff: any) => {
          const start = new Date(aff.heureDebut);
          const end = new Date(aff.heureFin);
          if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

          const startDate = format(start, "yyyy-MM-dd");

          const durationInMinutes = (end.getTime() - start.getTime()) / 60000;
          const period = Math.max(1, Math.round(durationInMinutes / 60));

          const room = aff.salles?.[0]?.nom ?? "Inconnue";
          const teacher = aff.nomProfesseur ?? "Inconnu";
          const className = aff.classes?.[0]?.nom ?? "Sans nom";
          const effectif = aff.classes?.[0]?.effectif ?? 0;

          uniqueTeachers.add(teacher);

          for (const slot of timeSlots) {
            const slotTime = new Date(`${startDate}T${slot}`);
            if (slotTime >= start && slotTime < end) {
              const key = `${startDate}-${slot}`;
              transformed[key] = {
                id: aff.id,
                name: className,
                teacher,
                room,
                students: effectif,
                status: "confirmed",
                period,
              };
            }
          }
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
      const matchTeacher =
        selectedTeacher === "all" || cls.teacher === selectedTeacher;
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
      setDraggedClass(null);
    }
  };

  const handleCellClick = (day: string, time: string) => {
    setSelectedCell({ day, time });
    setPopoverOpen(true);
  };

  const handleAddLesson = async (lesson: any) => {
    if (!selectedCell) return;

    const { day, time } = selectedCell;
    const startISO = `${day}T${time}`;

    const endHour = parseInt(time.split(":")[0]) + parseInt(lesson.period);
    const endISO = `${day}T${endHour.toString().padStart(2, "0")}:${
      time.split(":")[1]
    }`;

    const matchedRoom = allRooms.find((r) => r.nom === lesson.room);
    const matchedClass = allClasses.find((c) => c.nom === lesson.className);

    if (!matchedRoom || !matchedClass) {
      console.error("❌ Salle ou classe non trouvée", {
        salle: lesson.room,
        classe: lesson.name,
      });
      return;
    }

    const payload = {
      heureDebut: startISO,
      heureFin: endISO,
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString(),
      nomProfesseur: lesson.teacher,
      salles: [
        {
          id: matchedRoom.id,
          nom: matchedRoom.nom,
          capacite: matchedRoom.capacite,
          statut: "OCCUPE", 
        },
      ],
      classes: [
        {
          id: matchedClass.id,
          nom: matchedClass.nom,
          effectif: matchedClass.effectif,
          type: matchedClass.type ?? "ENTIERE", 
        },
      ],
    };

    console.log("📤 [Formulaire] Données à soumettre :", payload);

    try {
      const res = await fetch("/api/affectations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Échec création affectation");

    } catch (err) {
      console.error(`[Erreur ajout]`, err);
    } finally {
      resetPopover();
    }
  };

  const resetPopover = () => {
    setPopoverOpen(false);
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
        {popoverOpen && selectedCell && (
          <PopoverLessonForm
            day={selectedCell.day}
            time={selectedCell.time}
            onSubmit={handleAddLesson}
            onClose={resetPopover}
            rooms={fetchedRooms}
            teachers={fetchedTeachers}
            classes={fetchedClasses}
          />
        )}
      </CalendarGrid>
    </div>
  );
}
