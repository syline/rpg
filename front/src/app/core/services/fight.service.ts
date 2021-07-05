import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CharacterDto } from 'src/app/shared/dto/character.dto';
import { FightResultsDto } from 'src/app/shared/dto/fight-results.dto';
import { FightDto } from 'src/app/shared/dto/fight.dto';
import { OppponentsDto } from 'src/app/shared/dto/opponents.dto';
import { Character } from 'src/app/shared/models/character';
import { Fight } from 'src/app/shared/models/fight';
import { FightResults } from 'src/app/shared/models/fight-results';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FightService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  getOpponent(characterId: number): Observable<Character> {
    return this.httpClient.get<CharacterDto>(`${environment.apiUrl}/characters/${characterId}/opponent`).pipe(
      map((character: CharacterDto) => new Character(character)),
    );
  }

  fight(attackerId: number, defenderId: number): Observable<FightResults> {
    const opponentsDto = new OppponentsDto(attackerId, defenderId);
    return this.httpClient.post<FightResultsDto>(`${environment.apiUrl}/fights`, opponentsDto).pipe(
      map((fightResultsDto: FightResultsDto) => new FightResults(fightResultsDto)),
    );
  }

  getFightsByCharacterId(characterId: number): Observable<Fight[]> {
    return this.httpClient.get<FightDto[]>(`${environment.apiUrl}/characters/${characterId}/fights`).pipe(
      map((fights: FightDto[]) => fights.map((fight: FightDto) => new Fight(fight))),
    );
  }
}
