import { Component, inject, signal, computed } from '@angular/core';
import { ArticleCard } from '../../shared/article-card/article-card';
import { ArticleServices } from '../../../services/article-services';

@Component({
  imports: [ArticleCard],
  selector: 'app-article-list',
  styleUrl: './article-list.css',
  templateUrl: './article-list.html',
})
export class ArticleList {
  private readonly articleServices = inject(ArticleServices);

  search = signal('');
  category = signal('all');
  sort = signal('newest');

  // the server does the filtering; the list only sorts what the service holds
  articles = computed(() => {
    const list = [...this.articleServices.articles()];

    switch (this.sort()) {
      case 'price-asc':
        return list.sort((a, b) => a.prix - b.prix);
      case 'price-desc':
        return list.sort((a, b) => b.prix - a.prix);
      case 'name':
        return list.sort((a, b) => a.nom.localeCompare(b.nom));
      case 'deadline':
        return list.sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
      default:
        return list.sort((a, b) => b.datePublication.getTime() - a.datePublication.getTime());
    }
  });

  constructor() {
    this.load();
  }

  private load() {
    this.articleServices.searchArticles(this.search().trim(), this.category()).subscribe();
  }

  onSearch(value: string) {
    this.search.set(value);
    this.load();
  }

  onCategoryChange(value: string) {
    this.category.set(value);
    this.load();
  }

  onSort(value: string) {
    this.sort.set(value);
  }
}