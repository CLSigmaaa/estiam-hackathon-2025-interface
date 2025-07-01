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