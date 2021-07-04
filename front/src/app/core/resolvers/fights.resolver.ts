import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Fight } from 'src/app/shared/models/fight';
import { FightService } from '../services/fight.service';

@Injectable({ providedIn: 'root' })
export class FightsResolver implements Resolve<Fight[]> {
  constructor(private service: FightService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Fight[]> {
    return this.service.getFightsByCharacterId(+route.paramMap.get('id'));
  }
}
