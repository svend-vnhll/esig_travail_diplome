import { Cours } from "./cours";

export interface Horaire {
    id: number;
    codeHoraire: string;
    codeCours: string;
    semestre: string;
    salle: string;
    eleve: string;
    cours: Cours;
}
