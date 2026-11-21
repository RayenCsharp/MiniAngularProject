import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleServices } from '../../../services/article-services';
import { Article } from '../../../models/article';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Offre } from '../../../models/offre';
import { CountdownPipe } from '../../../pipes/countdown-pipe';
import {
  form,
  FormField,
  FormRoot,
  required,
  maxLength,
  minLength,
  minDate,
  pattern,
  min,
} from '@angular/forms/signals';

@Component({
  imports: [RouterLink, DatePipe, CountdownPipe, FormField, FormRoot],
  selector: 'app-article-edit',
  templateUrl: './article-edit.html',
})
export class ArticleEdit implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly articleServices = inject(ArticleServices);
  article = signal<Article | undefined>(undefined);
  offers = signal<Offre[] | undefined>(undefined);
  editing = signal<boolean>(false);
  successMessage = signal('');
  sortBy = signal<string>('newest');
  deleteDialogOpen = signal(false);
  infoDialogOpen = signal(false);
  selectedOffer = signal<Offre | undefined>(undefined);

  private show(article: Article) {
    this.article.set(article);
    this.offers.set(article.offres);
    this.sortOffers(this.sortBy());
  }

  private id: string | null = null;
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id == null) return;

    this.articleServices.getArticleById(this.id).subscribe((article) => {
      if (article == undefined) {
        console.error(this.id + " doesn't exist in the dataBase");
        return;
      }
      this.articleModel.set({ ...article });
      this.show(article);
    });
  }

  readonly articleModel = signal<Article>({
    id: '',
    nom: '',
    photo: '',
    prix: 0,
    categorie: '',
    description: '',
    etat: 'good',
    negociable: false,
    disponible: true,
    datePublication: new Date(),
    deadline: new Date(),
    offres: [],
  });

  readonly articleForm = form(this.articleModel, (path) => {
    required(path.nom, { message: 'Name is required' });
    maxLength(path.nom, 100, { message: 'Name must be less than or equal to 100 characters' });
    required(path.photo, { message: 'Photo URL is required' });
    pattern(path.photo, /^https?:\/\/.+/, { message: 'Must be a valid URL (https://...)' });
    required(path.prix, { message: 'Price is required' });
    min(path.prix, 1, { message: 'Price must be greater than or equal to 1 TND' });
    required(path.categorie, { message: 'Category is required' });
    required(path.etat, { message: 'State is required' });
    required(path.deadline, { message: 'Deadline is required' });
    minDate(path.deadline, () => this.article()?.datePublication ?? new Date(), {
      message: 'Deadline cannot be before the publication date',
    });
    required(path.description, { message: 'Description is required' });
    minLength(path.description, 30, { message: 'Description must be at least 30 characters' });
    maxLength(path.description, 500, {
      message: 'Description must be less than or equal to 500 characters',
    });
  });

  startEdit() {
    const current = this.article();
    if (current) this.articleModel.set({ ...current });
    this.editing.set(true);
  }

  cancelEdit() {
    const article = this.article();
    if (article) this.articleModel.set({ ...article });
    this.editing.set(false);
  }

  onSubmit() {
    if (this.articleForm().invalid()) return;
    const current = this.article();
    if (!current) return;

    const toSave = { ...this.articleModel(), offres: current.offres };
    this.articleServices.updateArticle(toSave).subscribe({
      next: (updated) => {
        this.show(updated);
        this.editing.set(false);
        this.successMessage.set('Article updated successfully.');
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: () => console.error('Could not update the article'),
    });
  }

  highestOfferId() {
    if (!this.offers() || this.offers()!.length === 0) return null;
    const highestOffer = this.offers()!.reduce((prev, current) => {
      return prev.montant > current.montant ? prev : current;
    });
    return highestOffer.id;
  }

  acceptOffer(offerId: string) {
    const article = this.article();
    if (!article) return;
    this.articleServices
      .updateOfferStatus(article.id, offerId, 'accepted')
      .subscribe((updated) => this.show(updated));
  }

  rejectOffer(offerId: string) {
    const article = this.article();
    if (!article) return;
    this.articleServices
      .updateOfferStatus(article.id, offerId, 'refused')
      .subscribe((updated) => this.show(updated));
  }

  sortOffers(sortBy: string) {
    this.sortBy.set(sortBy);
    const sortedOffers = [...(this.article()?.offres ?? [])];

    if (sortBy === 'newest') {
      sortedOffers.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'amount') {
      sortedOffers.sort((a, b) => b.montant - a.montant);
    } else {
      const statusOrder = { waiting: 0, accepted: 1, refused: 2 };
      sortedOffers.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    }

    this.offers.set(sortedOffers);
  }

  onDelete() {
    const article = this.article();
    if (!article) return;
    this.deleteDialogOpen.set(true);
  }

  cancelDelete() {
    this.deleteDialogOpen.set(false);
  }

  confirmDelete() {
    const article = this.article();
    if (!article) return;
    this.articleServices.deleteArticle(article.id).subscribe(() => {
      this.deleteDialogOpen.set(false);
      void this.router.navigate(['/admin/articles']);
    });
  }

  openOfferInfo(offer: Offre) {
    this.selectedOffer.set(offer);
    this.infoDialogOpen.set(true);
  }

  closeOfferInfo() {
    this.infoDialogOpen.set(false);
    this.selectedOffer.set(undefined);
  }
}
