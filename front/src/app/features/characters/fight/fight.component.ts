import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { FightService } from 'src/app/core/services/fight.service';
import { Character } from 'src/app/shared/models/character';
import { FightResults } from 'src/app/shared/models/fight-results';

@Component({
  selector: 'app-fight',
  templateUrl: './fight.component.html',
  styleUrls: ['./fight.component.scss']
})
export class FightComponent implements OnInit {
  attacker: Character;
  defender: Character;
  fightResults: FightResults;

  constructor(
    private fightService: FightService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.pipe(
      mergeMap((data: { attacker: Character, defender: Character }) => {
        this.attacker = data.attacker;
        this.defender = data.defender;

        if (this.defender.id) {
          return this.fightService.fight(this.attacker.id, this.defender.id);
        }
        return EMPTY;
      }),
      tap((fightResults: FightResults) => {
        this.fightResults = fightResults;
      })
    ).subscribe();
  }
}
