import { Inject, Injectable } from '@nestjs/common';
import { Character } from '../characters/entities/character.entity';
import { ICharactersService } from '../characters/interfaces/icharacters.service';
import { ICHARACTERS_SERVICE } from '../constants/services.constant';
import { NoFightError } from '../errors/no-fight.error';
import { Fight } from './entities/fight.entity';
import { FightsRepository } from './fights.repository';
import { IChallengers } from './interfaces/ichallengers';
import { IFightsService } from './interfaces/ifights.service';
import { IRound } from './interfaces/iround';
import { FightResults } from './models/fight-result';
import { Fighter } from './models/fighter';

@Injectable()
export class FightsService implements IFightsService {
  constructor(
    private fightRepository: FightsRepository,
    @Inject(ICHARACTERS_SERVICE) private readonly charactersService: ICharactersService,
  ) { }

  async findAllByCharacterId(id: number): Promise<Fight[]> {
    return this.fightRepository.getFightsByCharacterId(id);
  }

  async fight(attackerId: number, defenderId: number): Promise<IRound[]> {
    const { attacker, defender } = await this.getTwoChallengers(attackerId, defenderId);
    
    const fightResults: FightResults = this.launchFight(attacker, defender);
    
    const winner = this.charactersService.getUpdatedWinner(fightResults.winner);
    const looser = this.charactersService.getUpdatedLooser(fightResults.looser);
    const fight = new Fight(fightResults.winner, fightResults.looser, fightResults.winner.id);
    
    await this.fightRepository.saveFightResults(fight, winner, looser);
    
    return fightResults.rounds;
  }

  private async getTwoChallengers(attackerId: number, defenderId: number): Promise<IChallengers> {
    return Promise.all([
      this.charactersService.findOne(attackerId),
      this.charactersService.findOne(defenderId)
    ]).then(([attacker, defender]: [Character, Character]) => {
      return {
        attacker: new Fighter(attacker),
        defender: new Fighter(defender),
      };
    })
  }

  private launchFight(attacker: Fighter, defender: Fighter): FightResults {
    const fightResults = new FightResults();

    if (attacker.isHarmless() && defender.isHarmless()) {
      throw new NoFightError();
    }

    let nbRound = 1;

    while (attacker.isAlive() && defender.isAlive()) {
      const defenderDamagesReceived = attacker.getAttackDamages(defender.defense);
      defender.sufferDamage(defenderDamagesReceived);

      if (!defender.isAlive()) {
        fightResults.rounds.push({ id: nbRound, defenderDamagesReceived, attackerDamagesReceived: 0 });

        fightResults.winner = attacker;
        fightResults.looser = defender;
        break;
      }

      const attackerDamagesReceived = defender.getAttackDamages(attacker.defense);
      attacker.sufferDamage(attackerDamagesReceived);

      fightResults.rounds.push({ id: nbRound, defenderDamagesReceived, attackerDamagesReceived });

      nbRound++;
    }

    fightResults.winner = defender;
    fightResults.looser = attacker;

    return fightResults;
  }
}
