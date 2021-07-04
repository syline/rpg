import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Character } from 'src/app/shared/models/character';
import { FightService } from '../services/fight.service';

@Injectable({ providedIn: 'root' })
export class OpponentResolver implements Resolve<Character> {
  constructor(private service: FightService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Character> {
    return this.service.getOpponent(+route.paramMap.get('id'));
  }
}
