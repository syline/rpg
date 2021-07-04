import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { CharacterDto } from 'src/app/shared/dto/character.dto';
import { Fight } from 'src/app/shared/models/fight';
import { fightsMockService } from 'src/app/shared/tests/services/fights.mock.service';
import { FightService } from '../services/fight.service';
import { FightsResolver } from './fights.resolver';

describe('Given FightsResolver', () => {
  let resolver: FightsResolver;
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
    resolver = TestBed.inject(FightsResolver);
    service = TestBed.inject(FightService);

  });

  describe('When resolver is called', () => {
    it('Then it should be created', () => {
      expect(resolver).toBeTruthy();
    });
  });

  describe('When resolver is called with characterId = 1', () => {
    let response;
    const fights = [new Fight({ attacker: new CharacterDto(), defender: new CharacterDto(), id: 1, winnerId: 1 })];

    beforeEach(() => {
      service.getFightsByCharacterId = jasmine.createSpy('getFightsByCharacterId').and.returnValue(of(fights));

      const route = new ActivatedRouteSnapshot();
      route.params = { id: 1 };
      resolver.resolve(route).subscribe(res => response = res);
    });

    it('Then it should retrieve fights', () => {
      expect(response).toEqual(fights);
    });
  });
});
