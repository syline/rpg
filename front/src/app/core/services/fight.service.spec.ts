import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CharacterDto } from 'src/app/shared/dto/character.dto';
import { FightResultsDto } from 'src/app/shared/dto/fight-results.dto';
import { FightDto } from 'src/app/shared/dto/fight.dto';
import { OppponentsDto } from 'src/app/shared/dto/opponents.dto';
import { RoundDto } from 'src/app/shared/dto/round.dto';
import { Character } from 'src/app/shared/models/character';
import { Fight } from 'src/app/shared/models/fight';
import { FightResults } from 'src/app/shared/models/fight-results';
import { Round } from 'src/app/shared/models/round';
import { httpClientMockService } from 'src/app/shared/tests/services/http-client.mock.service';
import { environment } from 'src/environments/environment';
import { FightService } from './fight.service';

describe('Given FightService', () => {
  let service: FightService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FightService,
        {
          provide: HttpClient,
          useValue: httpClientMockService,
        },
      ]
    });
    service = TestBed.inject(FightService);
    httpClient = TestBed.inject(HttpClient);
  });

  describe('When service is called', () => {
    it('Then it should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('When searching an opponent', () => {
    const characterId = 1;
    const characterDto = new CharacterDto();
    characterDto.id = 1;
    characterDto.name = 'name';
    let response;

    beforeEach(() => {
      httpClient.get = jasmine.createSpy('get').and.returnValue(of(characterDto));
      service.getOpponent(characterId).subscribe(res => response = res);
    });

    it('Then a GET is done to /characters/:id/opponent', () => {
      expect(httpClient.get).toHaveBeenCalledWith(`${environment.apiUrl}/characters/${characterId}/opponent`);
    });

    it('Then it retrieves opponent', () => {
      expect(response).toEqual(new Character(characterDto));
    });
  });

  describe('When fighting', () => {
    const attackerId = 1;
    const defenderId = 2;
    const fightResultsDto = new FightResultsDto();
    let response;

    beforeEach(() => {
      httpClient.post = jasmine.createSpy('post').and.returnValue(of(fightResultsDto));
      service.fight(attackerId, defenderId).subscribe(res => response = res);
    });

    it('Then a POST is done to /fights', () => {
      const opponentsDto = new OppponentsDto(attackerId, defenderId);
      expect(httpClient.post).toHaveBeenCalledWith(`${environment.apiUrl}/fights`, opponentsDto);
    });

    it('Then it retrieves fight results', () => {
      expect(response).toEqual(new FightResults(fightResultsDto));
    });
  });

  describe('When getting fights by character\'s id', () => {
    const characterId = 1;
    const fightDto = new FightDto();
    fightDto.attacker = new CharacterDto();
    fightDto.attacker.id = 1;
    fightDto.defender = new CharacterDto();
    fightDto.defender.id = 2;
    fightDto.id = 1;
    fightDto.winnerId = 1;
    const fightsDto = [fightDto];
    let response;

    beforeEach(() => {
      httpClient.get = jasmine.createSpy('get').and.returnValue(of(fightsDto));
      service.getFightsByCharacterId(characterId).subscribe(res => response = res);
    });

    it('Then a GET is done to /characters/:characterId/fights', () => {
      expect(httpClient.get).toHaveBeenCalledWith(`${environment.apiUrl}/characters/${characterId}/fights`);
    });

    it('Then it retrieves fight', () => {
      expect(response).toEqual([new Fight(fightDto)]);
    });
  });
});
