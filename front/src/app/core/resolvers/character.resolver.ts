import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Character } from 'src/app/shared/models/character';
import { CharactersService } from '../services/characters.service';

@Injectable({ providedIn: 'root' })
export class CharacterResolver implements Resolve<Character> {
  constructor(private service: CharactersService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Character> {
    return this.service.getById(+route.paramMap.get('id'));
  }
}
