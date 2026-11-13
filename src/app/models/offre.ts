export interface Offre {
  id: string;
  nomAcheteur: string;
  emailAcheteur: string;
  telephoneAcheteur: string;
  montant: number;
  message?: string;
  date: Date;
  status: 'waiting' | 'accepted' | 'refused';
}
