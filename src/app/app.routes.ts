import { Routes } from '@angular/router';
// -- User Components
import { UserLayout } from './components/user/user-layout/user-layout';
import { ArticleList } from './components/user/article-list/article-list';
import { ArticleDetail } from './components/user/article-detail/article-detail';
import { Login } from './components/user/login/login';
import { About } from './components/user/about/about';

// -- Admin Components
import { AdminLayout } from './components/admin/admin-layout/admin-layout';
import { ArticleList as AdminArticleList } from './components/admin/article-list/article-list';
import { ArticleForm } from './components/admin/article-form/article-form';
import { ArticleEdit } from './components/admin/article-edit/article-edit';
import { ChangePassword } from './components/admin/change-password/change-password';

// -- Error Component
import { Error } from './components/shared/error/error';

export const routes: Routes = [
  { path: '', component: UserLayout, children: [
    { path: '', redirectTo: 'articles', pathMatch: 'full' },
    { path: 'articles', title: 'Articles', component: ArticleList, data: { baseUrl: '/articles' } },
    { path: 'articles/:id', title: 'Article Details', component: ArticleDetail },
    { path: 'login', title: 'Login', component: Login },
    { path: 'about', title: 'About', component: About },
  ] },
  { path: 'admin', component: AdminLayout, children: [
    { path: '', redirectTo: 'articles', pathMatch: 'full' },
    { path: 'articles', title: 'Articles', component: AdminArticleList, data: { baseUrl: '/admin/articles' } },
    { path: 'articles/new', title: 'New Article', component: ArticleForm },
    { path: 'articles/:id/edit', title: 'Edit Article', component: ArticleEdit },
    { path: 'change-password', title: 'Change Password', component: ChangePassword },
  ] },
  { path: '**', title: 'error', component: Error },
];
