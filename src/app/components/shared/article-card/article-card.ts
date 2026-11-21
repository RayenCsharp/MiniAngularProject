import { Component, input } from '@angular/core';
import { Article } from '../../../models/article';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';

@Component({
  imports: [RouterLink, DecimalPipe],
  selector: 'app-article-card',
  styleUrl: './article-card.css',
  templateUrl: './article-card.html',
})
export class ArticleCard {
  article = input.required<Article>();
  base = input.required<string>();
}
