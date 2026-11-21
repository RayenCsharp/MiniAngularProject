export interface Article {
  id: string;
  nom: string;
  photo: string;
  prix: number;
  categorie: string;
  description: string;
  etat: 'good' | 'new' | 'used';
  negociable: boolean;
  disponible: boolean;
  datePublication: Date;
  deadline: Date;
  offres: Offre[];
}

export interface Offre {
  id: string;
  nomAcheteur: string;
  emailAcheteur: string;
  telephoneAcheteur: string;
  montant: number;
  message: string;
  date: string;
  status: "waiting" | "accepted" | "refused";
}