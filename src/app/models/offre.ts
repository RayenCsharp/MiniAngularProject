export interface Offre {
  nomAcheteur: string;
  emailAcheteur: string;
  telephoneAcheteur: string;
  montant: number;
  message?: string;
  date: Date;
  status: 'waiting' | 'accepted' | 'refused';
}
