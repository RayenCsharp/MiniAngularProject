import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { type Article, type Offre } from '../Models/article.js';
import { type Admin } from '../Models/admin.js';

const DB = path.join(process.cwd(), 'data', 'db.json');

interface Db {
  articles: Article[];
  admins: Admin[];
}

export const readDb = (): Db => JSON.parse(fs.readFileSync(DB, 'utf8'));

export const writeDb = (db: Db): void => fs.writeFileSync(DB, JSON.stringify(db, null, 2));

export const getAllArticles = (): Article[] => readDb().articles;

export const getArticleById = (id: string): Article | undefined =>
  readDb().articles.find((article) => article.id === id);

export const searchArticles = (title?: string, category?: string): Article[] => {
  const t = title?.trim().toLowerCase() ?? '';
  const c = category?.toLowerCase() ?? '';

  return readDb().articles.filter(
    (a) =>
      a.nom.toLowerCase().includes(t) &&
      (!c || c === 'all' || a.categorie.toLowerCase() === c),
  );
};

export const addArticle = (data: Omit<Article, 'id'>): Article => {
  const db = readDb();
  const newArticle: Article = { ...data, id: randomUUID() };
  db.articles.push(newArticle);
  writeDb(db);
  return newArticle;
};

export const updateArticle = (updatedArticle: Article): boolean => {
  const db = readDb();
  const articleIndex = db.articles.findIndex((article) => article.id === updatedArticle.id);
  if (articleIndex === -1) return false;
  db.articles[articleIndex] = {...updatedArticle, offres: db.articles[articleIndex]?.offres || []};
  writeDb(db);
  return true;
};

export const deleteArticle = (articleId: string): boolean => {
  const db = readDb();
  const remaining = db.articles.filter((a) => a.id !== articleId);
  if (remaining.length === db.articles.length) return false;
  db.articles = remaining;
  writeDb(db);
  return true;
};

export const addOfferToArticle = (articleId: string, offer: Omit<Offre, 'id'>): boolean => {
  const db = readDb();
  const updatedArticle = db.articles.find((article) => article.id === articleId);
  if (!updatedArticle) return false;
  const newOffer: Offre = { ...offer, id: randomUUID() };
  updatedArticle.offres.push(newOffer);
  writeDb(db);
  return true;
};

export const updateOfferStatus = (
  articleId: string,
  offerId: string,
  status: Offre['status'],
): boolean => {
  const db = readDb();
  const article = db.articles.find((article) => article.id === articleId);
  const offer = article?.offres.find((offer) => offer.id === offerId);
  if (!article || !offer) return false;
  if (status === 'accepted') {
    if (!article.disponible) return false;
    article.offres.forEach((o) => {
      o.status = o.id === offerId ? 'accepted' : 'refused';
    });
    article.disponible = false;
  } else {
    offer.status = status;
  }
  writeDb(db);
  return true;
};
