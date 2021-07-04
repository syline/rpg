import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { Character } from 'src/app/shared/models/character';
import { fightsMockService } from 'src/app/shared/tests/services/fights.mock.service';
import { FightService } from '../services/fight.service';
import { OpponentResolver } from './opponent.resolver';

describe('Given OpponentResolver', () => {
  let resolver: OpponentResolver;
  let service: FightService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: FightService,
          useValue: fightsMockService,
        },
      ]
    });
    resolver = TestBed.inject(OpponentResolver);
    service = TestBed.inject(FightService);

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
      service.getOpponent = jasmine.createSpy('getOpponent').and.returnValue(of(character));

      const route = new ActivatedRouteSnapshot();
      route.params = { id: 1 };
      resolver.resolve(route).subscribe(res => response = res);
    });

    it('Then it should retrieve opponent', () => {
      expect(response).toEqual(character);
    });
  });
});
