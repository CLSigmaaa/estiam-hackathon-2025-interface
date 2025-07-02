"use client"

import { useEffect, useState } from "react"
import { TempNavbar } from "@/components/temp-navbar"
import FilterBar from "@/components/affectations/FiltersBar"
import CalendarGrid from "@/components/affectations/CalendarGrid"
import PopoverLessonForm from "@/components/affectations/PopoverLessonForm"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
]
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

export default function AffectationsPage() {
  const [selectedRoom, setSelectedRoom] = useState("all")
  const [selectedTeacher, setSelectedTeacher] = useState("all")
  const [selectedClass, setSelectedClass] = useState("all")

  const [fetchedRooms, setFetchedRooms] = useState<string[]>([])
  const [fetchedTeachers, setFetchedTeachers] = useState<string[]>([])
  const [fetchedClasses, setFetchedClasses] = useState<string[]>([])

  const [assignedClasses, setAssignedClasses] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)

  const [draggedClass, setDraggedClass] = useState<any>(null)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [selectedCell, setSelectedCell] = useState<{ day: string; time: string } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, affRes, classesRes] = await Promise.all([
          fetch("/api/salles"),
          fetch("/api/affectations"),
          fetch("/api/classes"),
        ])

        const roomsData = await roomsRes.json()
        console.log("[Données API] Salles :", roomsData)

        const affData = await affRes.json()
        console.log("[Données API] Affectations :", affData)

        const classData = await classesRes.json()
        console.log("[Données API] Classes :", classData)

        const activeRooms = roomsData
          .filter((r: any) => r.statut === "LIBRE")
          .map((r: any) => r.nom)
        setFetchedRooms(activeRooms)

        const classNames = classData.map((cls: any) => cls.nom)
        setFetchedClasses(classNames)

        const transformed: Record<string, any> = {}
        const uniqueTeachers = new Set<string>()

        affData.forEach((aff: any) => {
          const start = new Date(aff.heureDebut)
          if (isNaN(start.getTime())) return

          const time = format(start, "HH:mm")
          const day = format(start, "EEEE", { locale: fr })

          const room = aff.salles?.[0]?.nom ?? "Inconnue"
          const teacher = aff.nomProfesseur ?? "Inconnu"
          const className = aff.classes?.[0]?.nom ?? "Sans nom"

          uniqueTeachers.add(teacher)

          const key = `${format(start, "yyyy-MM-dd")}-${time}`
          transformed[key] = {
            id: aff.id,
            name: className,
            teacher,
            room,
            students: aff.classes?.[0]?.effectif ?? 0,
            status: "confirmed",
          }
        })

        setFetchedTeachers([...uniqueTeachers])
        setAssignedClasses(transformed)
        console.log(`[Chargement] ${Object.keys(transformed).length} affectations chargées.`)
      } catch (err) {
        console.error("Erreur de chargement :", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredClasses = Object.fromEntries(
    Object.entries(assignedClasses).filter(([_, cls]) => {
      const matchRoom = selectedRoom === "all" || cls.room === selectedRoom
      const matchTeacher = selectedTeacher === "all" || cls.teacher === selectedTeacher
      const matchClass = selectedClass === "all" || cls.name === selectedClass
      return matchRoom && matchTeacher && matchClass
    })
  )

  const handleDragStart = (e: React.DragEvent, classItem: any) => {
    setDraggedClass(classItem)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDrop = (e: React.DragEvent, day: string, time: string) => {
    e.preventDefault()
    if (draggedClass) {
      console.log(`[Déplacement] "${draggedClass.name}" déplacé vers ${day} à ${time}`)
      setDraggedClass(null)
    }
  }

  const handleCellClick = (day: string, time: string) => {
    setSelectedCell({ day, time })
    setPopoverOpen(true)
  }

  const handleAddLesson = async (lesson: any) => {
    if (!selectedCell) return

    const { day, time } = selectedCell
    const startISO = `${day}T${time}`

    const endHour = parseInt(time.split(":")[0]) + parseInt(lesson.period)
    const endISO = `${day}T${endHour.toString().padStart(2, "0")}:${time.split(":")[1]}`

    const payload = {
      heure_debut: startISO,
      heure_fin: endISO,
      nom_professeur: lesson.teacher,
      sallesIds: [1], // TODO: Mapper nom → ID
      classesIds: [1], // TODO: Mapper nom → ID
    }

    try {
      const res = await fetch("/api/affectations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Échec création affectation")

      console.log(`[Ajout] "${lesson.name}" affecté à ${day} ${time}, salle ${lesson.room}, prof ${lesson.teacher}`)
    } catch (err) {
      console.error(`[Erreur ajout]`, err)
    } finally {
      resetPopover()
    }
  }

  const resetPopover = () => {
    setPopoverOpen(false)
    setSelectedCell(null)
  }

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
          />
        )}
      </CalendarGrid>
    </div>
  )
}