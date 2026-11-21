import { type Request, type Response } from "express";
import * as articleService from "../Services/articleService.js";

export const getAll = (req: Request, res: Response) => {
  const { title, category } = req.query;
  res.json(
    articleService.searchArticles(
      typeof title === 'string' ? title : undefined,
      typeof category === 'string' ? category : undefined,
    ),
  );
};

export const getById = (req: Request, res: Response) => {
  const id = String(req.params.id);
  const article = articleService.getArticleById(id);
  if (!article) {
    res.status(404).json({ message: 'Article not found' });
    return;
  }
  res.json(article);
};

export const create = (req: Request, res: Response) => {
  const data = req.body;
  const article = articleService.addArticle(data);
  if (!article) {
    res.status(500).json({ message: 'Failed to create article' });
    return;
  }
  res.status(201).json(article);
};

export const update = (req: Request, res: Response) => {
  const updatedArticle = req.body;
  const article = articleService.updateArticle(updatedArticle);
  if (!article) {
    res.status(404).json({ message: 'Article not found' });
    return;
  }
  res.json(article);
}

export const remove = (req: Request, res: Response) => {
  const articleId = String(req.params.id);
  const success = articleService.deleteArticle(articleId);
  if (!success) {
    res.status(404).json({ message: 'Article not found' });
    return;
  }
  res.json().send();
};

export const addOffer = (req: Request, res: Response) => {
  const articleId = String(req.params.id);
  const offerData = req.body;
  const article = articleService.addOfferToArticle(articleId, offerData);
  if (!article) {
    res.status(404).json({ message: 'Article not found' });
    return;
  }
  res.status(201).json(article);
};

export const updateOffer = (req: Request, res: Response) => {
  const articleId = String(req.params.id);
  const offerId = String(req.params.offerId);
  const { status } = req.body;
  const article = articleService.updateOfferStatus(articleId, offerId, status);
  if (!article) {
    res.status(404).json({ message: 'Article or offer not found' });
    return;
  }
  res.json(article);
}
