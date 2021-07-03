import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharacterResolver } from 'src/app/core/resolvers/character.resolver';
import { CharactersResolver } from 'src/app/core/resolvers/characters.resolver';
import { CharactersComponent } from './characters.component';
import { UpdateCharacterComponent } from './update-character/update-character.component';

const routes: Routes = [
  {
    path: '',
    component: CharactersComponent,
    resolve: {
      characters: CharactersResolver,
    },
  },
  {
    path: 'update/:id',
    component: UpdateCharacterComponent,
    resolve: {
      character: CharacterResolver,
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CharactersRoutingModule { }
