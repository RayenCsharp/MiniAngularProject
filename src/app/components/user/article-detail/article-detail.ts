import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleServices } from '../../../services/article-services';
import { Article } from '../../../models/article';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Offre } from '../../../models/offre';

@Component({
  imports: [RouterLink, DatePipe],
  selector: 'app-article-detail',
  styleUrl: './article-detail.css',
  templateUrl: './article-detail.html',
})
export class ArticleDetail implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly articleServices = inject(ArticleServices);
  article = signal<Article | undefined>(undefined);
  offers = signal<Offre[] | undefined>(undefined);
  private id: string | null = null;
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id != null) {
      this.article.set(this.articleServices.getArticleById(this.id));
      if (this.article() == undefined) {
        console.error(this.id + " doesn't exist in the dataBase");
      } else {
        this.offers.set(this.article()?.offres);
      }
    }
  }

  sortOffers(event: Event): void {
    const sortBy = (event.target as HTMLSelectElement).value;
    const originalOffers = this.article()?.offres ?? [];

    const sortedOffers = [...originalOffers].sort((first, second) => {
      if (sortBy === 'amount') {
        return second.montant - first.montant;
      }

      if (sortBy === 'status') {
        return first.status.localeCompare(second.status);
      }

      if (sortBy === 'mostRecent') {
        return second.date.getTime() - first.date.getTime();
      }

      return 0;
    });

    this.offers.set(sortedOffers);
  }
}
