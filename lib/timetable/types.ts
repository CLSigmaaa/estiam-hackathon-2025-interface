export type ScheduleData = {
  [date: string]: {
    [slot: string]: {
      [room: string]: string;
    };
  };
};

export type AlertMessage = {
  message: string;
  type: "info" | "warning" | "error" | "success";
};

export type AlertsData = {
  [date: string]: AlertMessage[];
};

export type Salle = {
  id: number;
  nom: string;
  capacite: number;
  statut: "ouverte" | "fermee";
};

export type Affectation = {
  id: number
  heure_debut: string // ISO
  heure_fin: string
  date_creation: string
  date_modification: string
  nom_professeur: string
  salles: { id: number; nom: string }[]
  classes: { id: number; nom: string }[]
}

export type Information = {
  id: number
  type: "info" | "warning" | "error" | "success"
  message: string
  statut: boolean
}