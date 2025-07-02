"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import CellClassCard from "@/components/affectations/cell-class-card"
import { weekdays, timeSlots } from "@/lib/constants"
import { AssignedClass } from "@/types/affectation"
import { useState } from "react"
import PopoverLessonForm from "./PopoverLessonForm"

interface CalendarGridProps {
  assignedClasses: Record<string, AssignedClass>
  onDrop: (e: React.DragEvent, day: string, time: string) => void
  onAddLesson: (day: string, time: string, lesson: any) => void
  onDragOver: (e: React.DragEvent) => void
}

export default function CalendarGrid({
  assignedClasses,
  onDrop,
  onAddLesson,
  onDragOver,
}: CalendarGridProps) {
  const [popoverOpenKey, setPopoverOpenKey] = useState<string | null>(null)

  const handleOpen = (key: string) => setPopoverOpenKey(key)
  const handleClose = () => setPopoverOpenKey(null)

  return (
    <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
      {timeSlots.map((time) => (
        <div
          key={time}
          className="grid grid-cols-6 border-b border-border last:border-b-0"
        >
          {/* Time column */}
          <div className="p-3 border-r border-border flex items-center">
            <span className="text-sm text-muted-foreground">{time}</span>
          </div>

          {/* Weekday cells */}
          {weekdays.map((day) => {
            const cellKey = `${day}-${time}`
            const assigned = assignedClasses[cellKey]

            return (
              <Popover
                key={cellKey}
                open={popoverOpenKey === cellKey}
                onOpenChange={(open) => !open && handleClose()}
              >
                <PopoverTrigger asChild>
                  <div
                    className="p-2 border-r border-border last:border-r-0 min-h-[80px] hover:bg-muted transition-colors cursor-pointer"
                    onDragOver={onDragOver}
                    onDrop={(e) => onDrop(e, day, time)}
                    onClick={() => !assigned && handleOpen(cellKey)}
                  >
                    {assigned ? (
                      <CellClassCard assignedClass={assigned} />
                    ) : (
                      <div className="h-full border-2 border-dashed border-border rounded flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">Cliquez pour ajouter une leçon</span>
                      </div>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80" side="right">
                  <PopoverLessonForm
                    day={day}
                    time={time}
                    onClose={handleClose}
                    onSubmit={(lesson) => onAddLesson(day, time, lesson)}
                  />
                </PopoverContent>
              </Popover>
            )
          })}
        </div>
      ))}
    </div>
  )
}
