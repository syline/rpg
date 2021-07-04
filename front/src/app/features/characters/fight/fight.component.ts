import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EMPTY } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { FightService } from 'src/app/core/services/fight.service';
import { Character } from 'src/app/shared/models/character';
import { Round } from 'src/app/shared/models/round';

@Component({
  selector: 'app-fight',
  templateUrl: './fight.component.html',
  styleUrls: ['./fight.component.scss']
})
export class FightComponent implements OnInit {
  attacker: Character;
  defender: Character;
  rounds: Round[];
  winner: number;

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
      tap((rounds: Round[]) => {
        this.rounds = rounds;
        this.playRounds();
        this.determineWinner();
      })
    ).subscribe();
  }

  private playRounds(): void {
    this.rounds.forEach((round: Round) => {
      this.attacker.health -= round.attackerDamagesReceived;
      this.defender.health -= round.defenderDamagesReceived;
    });
  }

  private determineWinner(): void {
    this.winner = this.attacker.isAlive() ? this.attacker.id : this.defender.id;
  }
}
