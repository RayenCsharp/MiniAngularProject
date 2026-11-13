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
}
