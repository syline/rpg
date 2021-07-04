import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { Character } from 'src/app/shared/models/character';
import { charactersMockService } from 'src/app/shared/tests/services/characters.mock.service';
import { CharactersService } from '../services/characters.service';
import { CharacterResolver } from './character.resolver';

describe('Given CharacterResolver', () => {
  let resolver: CharacterResolver;
  let service: CharactersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CharactersService,
          useValue: charactersMockService,
        },
      ]
    });
    resolver = TestBed.inject(CharacterResolver);
    service = TestBed.inject(CharactersService);

  });

  describe('When resolver is called', () => {
    it('Then it should be created', () => {
      expect(resolver).toBeTruthy();
    });
  });

  describe('When resolver is called with characterId = 1', () => {
    let response;
    const character = new Character({ id: 1, attack: 1, defense: 1, health: 1, name: '', magik: 1 });

    beforeEach(() => {
      service.getById = jasmine.createSpy('getById').and.returnValue(of(character));

      const route = new ActivatedRouteSnapshot();
      route.params = { id: 1 };
      resolver.resolve(route).subscribe(res => response = res);
    });

    it('Then it should retrieve character', () => {
      expect(response).toEqual(character);
    });
  });
});
