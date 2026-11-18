import { Component, inject, Signal } from '@angular/core';
import { ArticleCard } from '../../shared/article-card/article-card';
import { Article } from '../../../models/article';
import { ArticleServices } from '../../../services/article-services';

@Component({
  imports: [ArticleCard],
  selector: 'app-article-list',
  styleUrl: './article-list.css',
  templateUrl: './article-list.html',
})
export class ArticleList {
  private readonly articleServices = inject(ArticleServices);
  articles: Signal<Article[]> = this.articleServices.articles;

  onSort(sortValue: string) {
    if (sortValue === 'newest') {
      this.articles().sort((a, b) => b.datePublication.getTime() - a.datePublication.getTime());
    } else if (sortValue === 'price-asc') {
      this.articles().sort((a, b) => a.prix - b.prix);
    } else if (sortValue === 'price-desc') {
      this.articles().sort((a, b) => b.prix - a.prix);
    } else if (sortValue === 'name') {
      this.articles().sort((a, b) => a.nom.localeCompare(b.nom));
    } else if (sortValue === 'deadline') {
      this.articles().sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
    }
  }
}
