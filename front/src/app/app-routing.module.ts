import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IsAuthenticatedGuard } from './core/guards/is-logged-in.guard';
import { HomepageComponent } from './features/homepage/homepage.component';
import { LoginPasswordModule } from './shared/components/login-password/login-password.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/characters',
    pathMatch: 'full',
  },
  {
    path: 'homepage',
    component: HomepageComponent,
  },
  {
    path: 'characters',
    loadChildren: () => import('./features/characters/characters.module').then(m => m.CharactersModule),
    canLoad: [IsAuthenticatedGuard],
  },
];

@NgModule({
  declarations: [HomepageComponent],
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    LoginPasswordModule,
  ],
  exports: [RouterModule],
  providers: [IsAuthenticatedGuard],
})
export class AppRoutingModule { }
