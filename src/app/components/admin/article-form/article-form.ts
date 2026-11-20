import { Component, signal, inject } from '@angular/core';
import { ArticleServices } from '../../../services/article-services';
import { Article } from '../../../models/article';
import {
  form,
  FormField,
  FormRoot,
  maxLength,
  minLength,
  min,
  required,
  pattern,
  minDate,
} from '@angular/forms/signals';

@Component({
  imports: [ FormField, FormRoot],
  selector: 'app-article-form',
  styleUrl: './article-form.css',
  templateUrl: './article-form.html',
})
export class ArticleForm {
  private readonly articleServices = inject(ArticleServices);
  readonly articleModel = signal<Article>({
    id: Math.random().toString(36).substring(2, 15),
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
    minDate(path.deadline, () => new Date(), { message: 'Deadline must be a future date' });
    required(path.description, { message: 'Description is required' });
    minLength(path.description, 30, { message: 'Description must be at least 30 characters' });
    maxLength(path.description, 500, {
      message: 'Description must be less than or equal to 500 characters',
    });
  });

  successMessage = signal<boolean>(false);

  onSubmit() {
    if (this.articleForm().invalid()) return;

    console.log('Article submitted:', this.articleModel());
    const success = this.articleServices.addArticle({
      ...this.articleModel(),
      datePublication: new Date(),
    });
    if (success) {
      this.successMessage.set(true);
      setTimeout(() => {
        this.successMessage.set(false);
      }, 3000);
    }
    this.resetForm();
  }

  resetForm() {
    this.articleForm().reset();
    this.articleModel.set({
      id: Math.random().toString(36).substring(2, 15),
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
  }
}
