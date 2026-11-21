import { Service, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map, catchError, of } from 'rxjs';
import { Article } from '../models/article';
import { Offre } from '../models/offre';
import { environment } from '../../environments/environment';


const ArticleUrl = `${environment.apiUrl}/articles`;

const jsonDateRevive = (a: Article): Article => ({
  ...a,
  datePublication: new Date(a.datePublication),
  deadline: new Date(a.deadline),
  offres: a.offres.map((o) => ({ ...o, date: new Date(o.date) })),
});

@Service()
export class ArticleServices {
  private readonly _http = inject(HttpClient);
  private _articles = signal<Article[]>([]);
  readonly articles = this._articles.asReadonly();

  // replace one article inside the signal with the version the server returned
  private replace(updated: Article) {
    this._articles.update((list) => list.map((a) => (a.id === updated.id ? updated : a)));
  }

  getAllArticles(): Observable<Article[]> {
    return this.searchArticles();
  }

  searchArticles(title = '', category = 'all'): Observable<Article[]> {
    const params = new HttpParams().set('title', title).set('category', category);
    return this._http.get<Article[]>(ArticleUrl, { params }).pipe(
      map((list) => list.map(jsonDateRevive)),
      tap((list) => this._articles.set(list)),
    );
  }

  getArticleById(id: string): Observable<Article | undefined> {
    return this._http.get<Article>(`${ArticleUrl}/${id}`).pipe(
      map(jsonDateRevive),
      catchError(() => of(undefined)), // a 404 becomes "no article", not an error
    );
  }

  addArticle(article: Article): Observable<Article> {
    return this._http.post<Article>(ArticleUrl, article).pipe(
      map(jsonDateRevive),
      tap((created) => this._articles.update((list) => [...list, created])),
    );
  }

  updateArticle(article: Article): Observable<Article> {
    return this._http.put<Article>(`${ArticleUrl}/${article.id}`, article).pipe(
      map(jsonDateRevive),
      tap((updated) => this.replace(updated)),
    );
  }

  deleteArticle(articleId: string): Observable<void> {
    return this._http.delete<void>(`${ArticleUrl}/${articleId}`).pipe(
      tap(() => this._articles.update((list) => list.filter((a) => a.id !== articleId))),
    );
  }

  addOfferToArticle(articleId: string, offer: Omit<Offre, 'id'>): Observable<Article> {
    return this._http.post<Article>(`${ArticleUrl}/${articleId}/offers`, offer).pipe(
      map(jsonDateRevive),
      tap((updated) => this.replace(updated)),
    );
  }

  updateOfferStatus(
    articleId: string,
    offerId: string,
    status: Offre['status'],
  ): Observable<Article> {
    return this._http
      .patch<Article>(`${ArticleUrl}/${articleId}/offers/${offerId}`, { status })
      .pipe(
        map(jsonDateRevive),
        tap((updated) => this.replace(updated)),
      );
  }
}
