import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CharacterDto } from 'src/app/shared/dto/character.dto';
import { CreateCharacterDto } from 'src/app/shared/dto/create-character.dto';
import { Character } from 'src/app/shared/models/character';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {

  constructor(
    private httpClient: HttpClient,
    private authService: AuthenticationService,
  ) { }

  getAllByUserId(): Observable<Character[]> {
    return this.httpClient.get<CharacterDto[]>(`${environment.apiUrl}/users/${this.authService.getCurrentUserId()}/characters`).pipe(
      map((characters: CharacterDto[]) => characters.map(character => new Character(character))),
    );
  }

  create(name: string): Observable<Character> {
    const character = new CreateCharacterDto(name, +this.authService.getCurrentUserId());
    return this.httpClient.post<Character>(`${environment.apiUrl}/characters`, character);
  }
}
