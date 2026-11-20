import { Service, signal } from '@angular/core';
import { Article } from '../models/article';
import { Offre } from '../models/offre';

@Service()
export class ArticleServices {
  private _articles = signal<Article[]>([
    {
      id: '1',
      nom: 'Vintage Leather Jacket',
      photo:
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      prix: 85,
      categorie: 'Clothing',
      description: 'Brown leather jacket, size M. A few small scratches on the sleeves.',
      etat: 'good',
      negociable: true,
      disponible: true,
      datePublication: new Date('2026-10-12'),
      deadline: new Date('2026-11-30'),
      offres: [
        {
          id: '101',
          nomAcheteur: 'Rayen',
          emailAcheteur: 'rayen@example.com',
          telephoneAcheteur: '20000001',
          montant: 70,
          message: 'Can you do 70 TND?',
          date: new Date('2026-10-14'),
          status: 'waiting',
        },
        {
          id: '102',
          nomAcheteur: 'Sami Ben Ali',
          emailAcheteur: 'sami.benali@example.com',
          telephoneAcheteur: '22123456',
          montant: 75,
          message: 'Is the jacket still available? I can pick it up this weekend.',
          date: new Date('2026-10-16'),
          status: 'waiting',
        },
      ],
    },
    {
      id: '2',
      nom: 'Samsung Galaxy A12',
      photo:
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
      prix: 220,
      categorie: 'Electronics',
      description: '64 GB, cracked corner on the back, screen is perfect. Charger included.',
      etat: 'used',
      negociable: true,
      disponible: true,
      datePublication: new Date('2026-10-20'),
      deadline: new Date('2026-12-05'),
      offres: [],
    },
    {
      id: '3',
      nom: 'Wooden Bookshelf',
      photo:
        'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=800&q=80',
      prix: 120,
      categorie: 'Furniture',
      description: 'Five shelves, 180 cm tall. Solid wood, needs to be picked up in Tunis.',
      etat: 'good',
      negociable: false,
      disponible: true,
      datePublication: new Date('2026-10-25'),
      deadline: new Date('2026-12-10'),
      offres: [],
    },
    {
      id: '4',
      nom: 'Harry Potter Box Set',
      photo:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
      prix: 60,
      categorie: 'Books',
      description: 'Books 1 to 7, English edition. Pages slightly yellowed.',
      etat: 'good',
      negociable: true,
      disponible: false,
      datePublication: new Date('2026-09-30'),
      deadline: new Date('2026-10-31'),
      offres: [],
    },
    {
      id: '5',
      nom: 'Photoshop Poster Templates',
      photo:
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
      prix: 15,
      categorie: 'Digital',
      description: 'Pack of 20 editable poster templates (PSD). Sent by email after purchase.',
      etat: 'new',
      negociable: false,
      disponible: true,
      datePublication: new Date('2026-11-01'),
      deadline: new Date('2026-12-15'),
      offres: [],
    },
    {
      id: '6',
      nom: 'Mountain Bike 26"',
      photo:
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
      prix: 300,
      categorie: 'Sports',
      description: '21 speeds, new tires. The front brake needs adjusting.',
      etat: 'used',
      negociable: true,
      disponible: true,
      datePublication: new Date('2026-11-03'),
      deadline: new Date('2026-12-20'),
      offres: [],
    },
  ]);
  readonly articles = this._articles.asReadonly();
  getArticleById(id: string): Article | undefined {
    return this._articles().find((article) => article.id == id);
  }
  addArticle(article: Article): boolean {
    this._articles.update((articles) => [...articles, article]);
    return true;
  }

  updateArticle(updatedArticle: Article): boolean {
    const exists = this._articles().some((article) => article.id === updatedArticle.id);
    if (!exists) return false;

    this._articles.update((articles) =>
      articles.map((article) => (article.id === updatedArticle.id ? updatedArticle : article)),
    );
    return true;
  }

  deleteArticle(articleId: string): boolean {
    const exists = this._articles().some((article) => article.id === articleId);
    if (!exists) return false;

    this._articles.update((articles) => articles.filter((article) => article.id !== articleId));
    return true;
  }

  updateOfferStatus(articleId: string, offerId: string, status: Offre['status']): boolean {
    const article = this.getArticleById(articleId);
    if (!article) return false;

    this._articles.update((articles) =>
      articles.map((currentArticle) =>
        currentArticle.id === articleId
          ? {
              ...currentArticle,
              disponible: status === 'accepted' ? false : currentArticle.disponible,
              offres: currentArticle.offres.map((offer) =>
                status === 'accepted'
                  ? {
                      ...offer,
                      status: offer.id === offerId ? 'accepted' : 'refused',
                    }
                  : offer.id === offerId
                    ? { ...offer, status: status }
                    : offer,
              ),
            }
          : currentArticle,
      ),
    );
    return true;
  }

  addOfferToArticle(articleId: string, offer: Offre): boolean {
    const article = this.getArticleById(articleId);
    if (article) {
      this._articles.update((articles) =>
        articles.map((a) => {
          if (a.id === articleId) {
            return { ...a, offres: [...a.offres, offer] };
          }
          return a;
        }),
      );
      return true;
    }
    return false;
  }
}
