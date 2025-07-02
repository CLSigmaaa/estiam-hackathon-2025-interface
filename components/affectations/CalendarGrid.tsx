"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CellClassCard from "@/components/affectations/cell-class-card";
import { timeSlots } from "@/lib/constants";
import { AssignedClass } from "@/types/affectation";
import { useMemo, useState } from "react";
import { addDays, format, startOfWeek } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarGridProps {
  assignedClasses: Record<string, AssignedClass>;
  onDrop: (e: React.DragEvent, day: string, time: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  handleCellClick: (day: string, time: string) => void;
  selectedCell: { day: string; time: string } | null;
  popoverOpen: boolean;
  resetPopover: () => void;
  children?: React.ReactNode;
}

export default function CalendarGrid({
  assignedClasses,
  onDrop,
  onDragOver,
  handleCellClick,
  selectedCell,
  popoverOpen,
  resetPopover,
  children,
}: CalendarGridProps) {
  const [weekOffset, setWeekOffset] = useState(0);

  const currentWeekStart = useMemo(() => {
    return addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), weekOffset * 7);
  }, [weekOffset]);

  const currentWeekDays = useMemo(() => {
    const start = currentWeekStart;
    return Array.from({ length: 5 }).map((_, i) => addDays(start, i));
  }, [currentWeekStart]);

  return (
    <div className="space-y-2">
      <div className="text-center text-xl font-bold">
        {format(currentWeekStart, "yyyy")}
      </div>

      <div className="flex items-center justify-between px-4">
        <button
          className="text-muted-foreground hover:text-foreground"
          onClick={() => setWeekOffset((prev) => prev - 1)}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 grid grid-cols-6 gap-px text-sm text-center">
          <div />
          {currentWeekDays.map((day) => (
            <div key={day.toISOString()} className="font-medium">
              {format(day, "EEEE dd MMM", { locale: fr })}
            </div>
          ))}
        </div>

        <button
          className="text-muted-foreground hover:text-foreground"
          onClick={() => setWeekOffset((prev) => prev + 1)}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
        {timeSlots.map((time) => (
          <div key={time} className="grid grid-cols-6 border-b border-border last:border-b-0">
            <div className="p-3 border-r border-border flex items-center">
              <span className="text-sm text-muted-foreground">{time}</span>
            </div>

            {currentWeekDays.map((dayDate) => {
              const day = format(dayDate, "yyyy-MM-dd");
              const cellKey = `${day}-${time}`;
              const assigned = assignedClasses[cellKey];

              // Masquer les créneaux intermédiaires
              const isCoveredByPrevious = Object.entries(assignedClasses).some(
                ([key, aff]) => {
                  const [affDay, affTime] = key.split("-");
                  if (affDay !== day || key === cellKey) return false;

                  const start = new Date(`${affDay}T${affTime}`);
                  const current = new Date(`${day}T${time}`);
                  const end = new Date(start);
                  end.setHours(end.getHours() + (aff.period ?? 1));

                  const covered = current > start && current < end;
                  if (covered) {
                    console.log(`⛔ ${cellKey} masqué (couvert par ${key})`);
                  }

                  return covered;
                }
              );

              if (isCoveredByPrevious) return null;

              return (
                <Popover
                  key={cellKey}
                  open={selectedCell?.day === day && selectedCell?.time === time && popoverOpen}
                  onOpenChange={(open) => !open && resetPopover()}
                >
                  <PopoverTrigger asChild>
                    <div
                      className="p-2 border-r border-border last:border-r-0 hover:bg-muted transition-colors cursor-pointer"
                      onDragOver={onDragOver}
                      onDrop={(e) => onDrop(e, day, time)}
                      onClick={() => !assigned && handleCellClick(day, time)}
                    >
                      {assigned ? (
                        <CellClassCard
                          assignedClass={assigned}
                          onDeleted={(id) => {
                            console.log("🗑️ Suppression demandée :", id);
                          }}
                        />
                      ) : (
                        <div className="h-full border-2 border-dashed border-border rounded flex items-center justify-center min-h-[80px]">
                          <span className="text-xs text-muted-foreground">
                            Cliquez pour ajouter une leçon
                          </span>
                        </div>
                      )}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" side="right">
                    {selectedCell?.day === day && selectedCell?.time === time && children}
                  </PopoverContent>
                </Popover>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}