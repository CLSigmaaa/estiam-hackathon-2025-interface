"use client";

import { useEffect } from "react";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { filterTimeSlots } from "@/lib/timetable/filters";
import { formatFrDate, getLastUpdated, getTimeSlotsBetween } from "@/lib/timetable/utils";
import { ALL_TIME_SLOTS } from "@/lib/timetable/constants";
import { parseTimetableParams } from "@/lib/timetable/searchParams";
import { useTimetableData } from "@/hooks/useTimetableData";

import TimetableHeader from "@/components/Timetable/Header";
import TimetableTable from "@/components/Timetable/Table";
import LoadingState from "@/components/LoadingState";

export default function TimetableDisplay() {
  const { affectations, informations, salles, error } = useTimetableData();
  const searchParams = useSearchParams();

  useEffect(() => {
    const originalCursor = document.body.style.cursor;
    document.body.style.cursor = "none";

    return () => {
      document.body.style.cursor = originalCursor;
    };
  }, []);

  const { day, rooms, slot, showAll, theme } = useMemo(() => {
    return parseTimetableParams(searchParams);
  }, [searchParams]);

  const safeDay = useMemo(() => {
    const d = new Date(day);
    return isNaN(d.getTime()) ? new Date().toISOString().split("T")[0] : day;
  }, [day]);

  const allRooms = Array.from(new Set(salles?.map((s) => s.nom))) || [];
  const roomsToRender = showAll || rooms.length === 0 ? allRooms : rooms;
  const slotsToRender = filterTimeSlots(ALL_TIME_SLOTS, slot, showAll);

  // Construction d’un planning à partir des affectations
  const daySchedule = useMemo(() => {
    const map: Record<string, Record<string, string>> = {};
    const dateOnly = safeDay;

    for (const aff of affectations || []) {
      const affDate = new Date(aff.heureDebut).toISOString().split("T")[0];
      if (affDate !== dateOnly) continue;

      const slots = getTimeSlotsBetween(new Date(aff.heureDebut), new Date(aff.heureFin));

      for (const timeRange of slots) {
        if (!map[timeRange]) map[timeRange] = {};

        for (const salle of aff.salles || []) {
          const label = aff.classes?.map((c) => c.nom).join(", ") || aff.nomProfesseur;
          map[timeRange][salle.nom] = label;
        }
      }
    }

    return map;
  }, [affectations, safeDay]);

  const alertsForDay = useMemo(() => {
    const d = new Date(safeDay).toISOString().split("T")[0];
    return (
      informations?.filter(
        (info) => info.statut && info.type !== "success" && d
      ) || []
    );
  }, [informations, safeDay]);

  if (error) {
    return <div className="p-4 text-red-600 text-center">{error}</div>;
  }

  if (!affectations || !informations || !salles) {
    return <LoadingState message="Chargement des emplois du temps..." />;
  }

  return (
    <div
      className={`min-h-screen flex flex-col p-4 lg:p-8 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
        }`}
    >
      <TimetableHeader
        formattedDate={formatFrDate(safeDay)}
        alerts={alertsForDay}
      />

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