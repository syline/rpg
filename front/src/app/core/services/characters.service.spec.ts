import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CharacterDto } from 'src/app/shared/dto/character.dto';
import { CreateCharacterDto } from 'src/app/shared/dto/create-character.dto';
import { UpdateCharacterDto } from 'src/app/shared/dto/update-character.dto';
import { Character } from 'src/app/shared/models/character';
import { authenticationMockService } from 'src/app/shared/tests/services/authentication.mock.service';
import { httpClientMockService } from 'src/app/shared/tests/services/http-client.mock.service';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './authentication.service';
import { CharactersService } from './characters.service';

describe('Given CharactersService', () => {
  let service: CharactersService;
  let httpClient: HttpClient;
  let authService: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CharactersService,
        {
          provide: AuthenticationService,
          useValue: authenticationMockService,
        },
        {
          provide: HttpClient,
          useValue: httpClientMockService,
        },
      ]
    });
    service = TestBed.inject(CharactersService);
    httpClient = TestBed.inject(HttpClient);
    authService = TestBed.inject(AuthenticationService);
  });

  describe('When service is called', () => {
    it('Then it should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('When find all current user\'s characters', () => {
    const characterDto = new CharacterDto();
    characterDto.id = 1;
    characterDto.name = 'name';
    let response;

    beforeEach(() => {
      authService.getCurrentUserId = jasmine.createSpy('getCurrentUserId').and.returnValue(1);
      httpClient.get = jasmine.createSpy('get').and.returnValue(of([characterDto]));
      service.getAllByUserId().subscribe(res => response = res);
    });

    it('Then a GET is done to /users/:id/characters', () => {
      expect(httpClient.get).toHaveBeenCalledWith(`${environment.apiUrl}/users/${authService.getCurrentUserId()}/characters`);
    });

    it('Then it retrieves characters', () => {
      expect(response).toEqual([new Character(characterDto)]);
    });
  });

  describe('When creating a character', () => {
    const character = new Character(new CharacterDto());
    let response;

    beforeEach(() => {
      httpClient.post = jasmine.createSpy('post').and.returnValue(of(character));
      service.create('name').subscribe(res => response = res);
    });

    it('Then a POST is done to /characters', () => {
      const createCharacterDto = new CreateCharacterDto('name');
      expect(httpClient.post).toHaveBeenCalledWith(`${environment.apiUrl}/characters`, createCharacterDto);
    });

    it('Then it retrieves characters', () => {
      expect(response).toEqual(character);
    });
  });

  describe('When getting character by id (= 1)', () => {
    const characterDto = new CharacterDto();
    characterDto.id = 1;
    characterDto.name = 'name';
    let response;

    beforeEach(() => {
      httpClient.get = jasmine.createSpy('get').and.returnValue(of(characterDto));
      service.getById(1).subscribe(res => response = res);
    });

    it('Then a GET is done to /characters/1', () => {
      expect(httpClient.get).toHaveBeenCalledWith(`${environment.apiUrl}/characters/1`);
    });

    it('Then it retrieves character', () => {
      expect(response).toEqual(new Character(characterDto));
    });
  });

  describe('When updating a character', () => {
    const characterId = 1;
    const updateCharacterDto = new UpdateCharacterDto({ } as Character, { } as Character);

    beforeEach(() => {
      httpClient.patch = jasmine.createSpy('patch').and.returnValue(of(null));

      service.update(1, updateCharacterDto).subscribe();
    });

    it('Then a PATCH is done to /characters/:characterId', () => {
      expect(httpClient.patch).toHaveBeenCalledWith(`${environment.apiUrl}/characters/${characterId}`, updateCharacterDto);
    });
  });


  describe('When deleting a character', () => {
    const characterId = 1;
    beforeEach(() => {
      httpClient.delete = jasmine.createSpy('delete').and.returnValue(of(null));

      service.delete(characterId).subscribe();
    });

    it('Then a PATCH is done to /characters/:characterId', () => {
      expect(httpClient.delete).toHaveBeenCalledWith(`${environment.apiUrl}/characters/${characterId}`);
    });
  });
});
