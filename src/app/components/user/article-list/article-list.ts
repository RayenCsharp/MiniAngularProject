import { Component, inject, signal } from '@angular/core';
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
  search = signal('');
  category = signal('all');
  sort = signal('newest');
  articles = signal<Article[]>(this.articleServices.articles());

  updateArticles() {
    const title = this.search().trim();
    const category = this.category();
    let filtered = title
      ? this.articleServices.getArticlesByTitle(title)
      : [...this.articleServices.articles()];

    if (category !== 'all') {
      const categoryIds = this.articleServices.getArticlesByCategory(category).map((article) => article.id)
      
      filtered = filtered.filter((article) => categoryIds.includes(article.id));
    }

    this.articles.set(filtered);
    this.onSort(this.sort());
  }

  onSearch(value: string) {
    this.search.set(value);
    this.updateArticles();
  }

  onCategoryChange(value: string) {
    this.category.set(value);
    this.updateArticles();
  }

  onSort(sortValue: string) {
    this.sort.set(sortValue);
    const articles = this.articles();

    if (sortValue === 'newest') {
      articles.sort(
        (a, b) => b.datePublication.getTime() - a.datePublication.getTime(),
      );
    } else if (sortValue === 'price-asc') {
      articles.sort((a, b) => a.prix - b.prix);
    } else if (sortValue === 'price-desc') {
      articles.sort((a, b) => b.prix - a.prix);
    } else if (sortValue === 'name') {
      articles.sort((a, b) => a.nom.localeCompare(b.nom));
    } else if (sortValue === 'deadline') {
      articles.sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
    }

    this.articles.set([...articles]);
  }
}
