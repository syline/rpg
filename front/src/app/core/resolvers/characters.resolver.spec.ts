import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Character } from 'src/app/shared/models/character';
import { charactersMockService } from 'src/app/shared/tests/services/characters.mock.service';
import { CharactersService } from '../services/characters.service';
import { CharactersResolver } from './characters.resolver';

describe('Given CharactersResolver', () => {
  let resolver: CharactersResolver;
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
    resolver = TestBed.inject(CharactersResolver);
    service = TestBed.inject(CharactersService);
  });

  describe('When resolver is called', () => {
    it('Then it should be created', () => {
      expect(resolver).toBeTruthy();
    });
  });

  describe('When resolver is called', () => {
    let response;
    const characters = [new Character({ id: 1, attack: 1, defense: 1, health: 1, name: '', magik: 1 })];

    beforeEach(() => {
      service.getAllByUserId = jasmine.createSpy('getAllByUserId').and.returnValue(of(characters));

      resolver.resolve().subscribe(res => response = res);
    });

    it('Then it should retrieve characters', () => {
      expect(response).toEqual(characters);
    });
  });
});
