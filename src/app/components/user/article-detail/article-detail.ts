import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleServices } from '../../../services/article-services';
import { Article } from '../../../models/article';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Offre } from '../../../models/offre';
import { CountdownPipe } from '../../../pipes/countdown-pipe';
import { form, FormField, FormRoot, required, email, pattern, min } from '@angular/forms/signals';

@Component({
  imports: [RouterLink, DatePipe, CountdownPipe, FormField, FormRoot, DecimalPipe],
  selector: 'app-article-detail',
  styleUrl: './article-detail.css',
  templateUrl: './article-detail.html',
})
export class ArticleDetail implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly articleServices = inject(ArticleServices);
  article = signal<Article | undefined>(undefined);
  offers = signal<Offre[] | undefined>(undefined);
  offerSuccess = signal(false);
  sortBy = signal('mostRecent');
  private id: string | null = null;
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id == null) return;

    this.articleServices.getArticleById(this.id).subscribe((article) => {
      this.article.set(article);
      if (article == undefined) {
        console.error(this.id + " doesn't exist in the dataBase");
        return;
      }
      this.offers.set(article.offres);
      this.sortOffers(this.sortBy());
    });
  }

  readonly offreModel = signal<Offre>({
    id: Math.random().toString(36).substring(2, 15),
    nomAcheteur: '',
    emailAcheteur: '',
    telephoneAcheteur: '',
    montant: 0,
    message: '',
    date: new Date(),
    status: 'waiting',
  });

  readonly offreForm = form(this.offreModel, (path) => {
    required(path.nomAcheteur, { message: 'Name is required' });
    required(path.emailAcheteur, { message: 'Email is required' });
    email(path.emailAcheteur, { message: 'Invalid email format' });
    required(path.telephoneAcheteur, { message: 'Phone number is required' });
    pattern(path.telephoneAcheteur, /^[0-9]{8}$/, { message: 'Phone number must be 8 digits' });
    required(path.montant, { message: 'Amount is required' });
    min(path.montant, () => (this.article()?.negociable ? 1 : (this.article()?.prix ?? 0) + 0.01), {
      message: () =>
        this.article()?.negociable
          ? 'Amount must be at least 1 TND'
          : `Amount must be greater than ${this.article()?.prix} TND`,
    });
  });

  onSubmit() {
    if (this.offreForm().invalid()) return;
    this.offerSuccess.set(false);

    const articleId = this.article()?.id;
    if (!articleId) {
      console.error('Cannot add offer: article is not loaded');
      return;
    }

    const offre = { ...this.offreModel(), date: new Date() };

    this.articleServices.addOfferToArticle(articleId, offre).subscribe({
      next: (updatedArticle) => {
        this.article.set(updatedArticle);
        this.offers.set(updatedArticle.offres);
        this.sortOffers(this.sortBy());
        this.resetForm();
        this.offerSuccess.set(true);
        setTimeout(() => this.offerSuccess.set(false), 3000);
      },
      error: () => console.error(`Cannot add offer: article ${articleId} does not exist`),
    });
  }

  resetForm() {
    this.offreForm().reset();
    this.offreModel.set({
      id: Math.random().toString(36).substring(2, 15),
      nomAcheteur: '',
      emailAcheteur: '',
      telephoneAcheteur: '',
      montant: 0,
      message: '',
      date: new Date(),
      status: 'waiting',
    });
  }

  sortOffers(sortBy: string) {
    let sortOffers = [...(this.article()?.offres ?? [])];
    this.sortBy.set(sortBy);

    if (sortBy === 'mostRecent') {
      sortOffers.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'amount') {
      sortOffers.sort((a, b) => b.montant - a.montant);
    } else if (sortBy === 'status') {
      sortOffers.sort((a, b) => {
        const statusOrder = { waiting: 0, accepted: 1, refused: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      });
    }

    this.offers.set(sortOffers);
  }
}
