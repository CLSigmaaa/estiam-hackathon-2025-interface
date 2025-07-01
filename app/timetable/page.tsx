"use client";

import { useSearchParams } from "next/navigation";
import scheduleJson from "@/data/schedule.json" assert { type: "json" };
import alertsJson from "@/data/alerts.json" assert { type: "json" };
import sallesJson from "@/data/salles.json" assert { type: "json" };

import { ScheduleData, AlertsData, Salle } from "@/lib/timetable/types";
import { formatFrDate, getLastUpdated } from "@/lib/timetable/utils";
import { filterTimeSlots } from "@/lib/timetable/filters";

import TimetableHeader from "@/components/Timetable/Header";
import TimetableTable from "@/components/Timetable/Table";

export default function TimetableDisplay() {
  const searchParams = useSearchParams();

  const selectedDay =
    searchParams.get("jour") ?? new Date().toISOString().split("T")[0];
  const selectedRooms = searchParams.getAll("salle");
  const selectedSlot = searchParams.get("plage_horaire");
  const showAll = searchParams.get("tout") === "true";
  const theme = searchParams.get("theme") === "dark" ? "dark" : "light";

  const schedule: ScheduleData = scheduleJson;
  const alerts: AlertsData = alertsJson;
  const salles: Salle[] = sallesJson;

  const allRooms = salles.map((salle) => salle.nom);
  const allSlots = [
    "08:00–08:30", "08:30–09:00", "09:00–09:30", "09:30–10:00",
    "10:00–10:30", "10:30–11:00", "11:00–11:30", "11:30–12:00",
    "12:00–12:30", "12:30–13:00", "13:00–13:30", "13:30–14:00",
    "14:00–14:30", "14:30–15:00", "15:00–15:30", "15:30–16:00",
    "16:00–16:30"
  ];

  const roomsToRender = showAll || selectedRooms.length === 0 ? allRooms : selectedRooms;
  const slotsToRender = filterTimeSlots(allSlots, selectedSlot, showAll);

  const daySchedule = schedule[selectedDay] ?? {};
  const alertsForDay = alerts[selectedDay] ?? [];

  return (
    <div
      className={`min-h-screen flex flex-col p-4 lg:p-8 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <TimetableHeader formattedDate={formatFrDate(selectedDay)} alerts={alertsForDay} />

      <TimetableTable
        rooms={roomsToRender}
        slots={slotsToRender}
        schedule={daySchedule}
        theme={theme}
      />

      <div className="text-center mt-4 text-gray-500 text-sm lg:text-base dark:text-gray-400">
        Dernière mise à jour : {getLastUpdated()}
      </div>
    </div>
  );
}