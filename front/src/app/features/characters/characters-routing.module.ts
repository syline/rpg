import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharactersResolver } from 'src/app/core/resolvers/characters.resolver';
import { CharactersComponent } from './characters.component';

const routes: Routes = [
  {
    path: '',
    component: CharactersComponent,
    resolve: {
      characters: CharactersResolver,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CharactersRoutingModule { }
