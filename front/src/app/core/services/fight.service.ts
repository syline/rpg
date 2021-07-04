import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CharacterDto } from 'src/app/shared/dto/character.dto';
import { OppponentsDto } from 'src/app/shared/dto/opponents.dto';
import { RoundDto } from 'src/app/shared/dto/round.dto';
import { Character } from 'src/app/shared/models/character';
import { Round } from 'src/app/shared/models/round';
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

  fight(attackerId: number, defenderId: number): Observable<any> {
    const opponentsDto = new OppponentsDto(attackerId, defenderId);
    return this.httpClient.post(`${environment.apiUrl}/fights`, opponentsDto).pipe(
      map((rounds: RoundDto[]) => rounds.map((round: RoundDto) => new Round(round))),
    );
  }
}
