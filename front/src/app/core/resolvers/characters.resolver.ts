import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Character } from 'src/app/shared/models/character';
import { CharactersService } from '../services/characters.service';

@Injectable({ providedIn: 'root' })
export class CharactersResolver implements Resolve<Character[]> {
  constructor(private service: CharactersService) {}

  resolve(): Observable<Character[]> {
    return this.service.getAllByUserId();
  }
}
