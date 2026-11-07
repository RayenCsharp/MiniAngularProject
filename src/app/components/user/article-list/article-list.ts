import { Component } from '@angular/core';
import { ArticleCard } from '../../shared/article-card/article-card';
  
@Component({
  imports: [ArticleCard],
  selector: 'app-article-list',
  styleUrl: './article-list.css',
  templateUrl: './article-list.html',
})
export class ArticleList {}
