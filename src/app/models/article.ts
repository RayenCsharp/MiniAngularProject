import { Offre } from './offre';

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
  offres: Offre[];
}
