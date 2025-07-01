import { useEffect, useState } from "react";
import type { Salle, Affectation, Information } from "@/lib/timetable/types";

export function useTimetableData() {
  const [affectations, setAffectations] = useState<Affectation[]>([]);
  const [informations, setInformations] = useState<Information[]>([]);
  const [salles, setSalles] = useState<Salle[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/affectations").then(async (res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des affectations");
        const data = await res.json();
        console.log("Affectations API data:", data);
        return data;
      }) as Promise<Affectation[]>,

      fetch("/api/informations").then(async (res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des informations");
        const data = await res.json();
        console.log("Informations API data:", data);
        return data;
      }) as Promise<Information[]>,

      fetch("/api/salles").then(async (res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des salles");
        const data = await res.json();
        console.log("Salles API data:", data);
        return data;
      }) as Promise<Salle[]>,
    ])
      .then(([affectationsData, informationsData, sallesData]) => {
        setAffectations(affectationsData);
        setInformations(informationsData);
        setSalles(sallesData);
      })
      .catch((err) => {
        console.error("Erreur useTimetableData:", err);
        setError("Impossible de charger les données.");
      });
  }, []);

  return { affectations, informations, salles, error };
}