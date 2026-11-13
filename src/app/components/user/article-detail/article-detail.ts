import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleServices } from '../../../services/article-services';
import { Article } from '../../../models/article';

@Component({
  imports: [],
  selector: 'app-article-detail',
  styleUrl: './article-detail.css',
  templateUrl: './article-detail.html',
})
export class ArticleDetail implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly articleServices = inject(ArticleServices);
  article = signal<Article | undefined>(undefined);
  private id: string | null = null;
  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id != null) {
      this.article.set(this.articleServices.getArticleById(this.id));
    }
  }
}
