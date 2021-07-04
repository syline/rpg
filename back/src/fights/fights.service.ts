import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Character } from 'src/characters/entities/character.entity';
import { Repository } from 'typeorm';
import { ICharactersService } from '../characters/interfaces/icharacters.service';
import { ICHARACTERS_SERVICE } from '../constants/services.constant';
import { NoFightError } from '../shared/errors/no-fight.error';
import { Fight } from './entities/fight.entity';
import { IChallengers } from './interfaces/ichallengers';
import { IFightResult } from './interfaces/ifight-result';
import { IFightsService } from './interfaces/ifights.service';
import { IRound } from './interfaces/iround';
import { Dice } from './models/dice';

@Injectable()
export class FightsService implements IFightsService {
  constructor(
    @InjectRepository(Fight)
    private fightRepository: Repository<Fight>,
    @Inject(ICHARACTERS_SERVICE) private readonly charactersService: ICharactersService,
  ) { }

  async findAllByCharacterId(id: number): Promise<Fight[]> {
    return await this.fightRepository.find({
      where: [
        { attacker: { id } },
        { defender: { id } }
      ],
      relations: ['attacker', 'defender']
    })
  }

  async fights(attackerId: number, defenderId: number): Promise<IRound[]> {
    const { attacker, defender } = await this.getTwoChallengers(attackerId, defenderId);

    if (attacker.isHarmless() && defender.isHarmless()) {
      throw new NoFightError();
    }

    const rounds = this.launchFight(attacker, defender);

    const fightResults = this.determineWinnerAndLooser(attacker, defender);

    this.upgradeWinner(fightResults.winner);
    this.downgradeLooser(fightResults.looser);

    const fight = new Fight(attacker, defender, fightResults.winner.id);

    await Promise.all([
      this.charactersService.update(attacker.id, attacker),
      this.charactersService.update(defender.id, defender),
      this.fightRepository.save(fight),
    ])

    return rounds;
  }

  private async getTwoChallengers(attackerId: number, defenderId: number): Promise<IChallengers> {
    return {
      attacker: await this.charactersService.findOne(attackerId), 
      defender: await this.charactersService.findOne(defenderId), 
    };
  }

  private launchFight(attacker: Character, defender: Character): IRound[] {
    const rounds: IRound[] = [];
    let nbRound = 1;

    while (attacker.isAlive() && defender.isAlive()) {

      const defenderDamagesReceived = this.attack(attacker, defender);

      if (!defender.isAlive()) {
        rounds.push({ id: nbRound, defenderDamagesReceived, attackerDamagesReceived: 0 });
        break;
      }

      const attackerDamagesReceived = this.attack(defender, attacker);

      rounds.push({ id: nbRound, defenderDamagesReceived, attackerDamagesReceived });

      nbRound++;
    }

    return rounds;
  }

  private attack(attacker: Character, defender: Character): number {
    const attackValue = new Dice(attacker.attack).getValue();

    let damages = this.getAttackDamages(attackValue, defender.defense);

    if (damages === attacker.magik) {
      damages *= 2;
    }
    defender.health -= damages;

    return damages;
  }

  private getAttackDamages(attackValue: number, defenseValue: number): number {
    if (attackValue > defenseValue) {
      return attackValue - defenseValue;
    }
    return 0;
  }

  private determineWinnerAndLooser(attacker: Character, defender: Character): IFightResult {
    const result = {
      winner: attacker,
      looser: defender,
    };

    if (defender.isAlive()) {
      result.winner = defender;
      result.looser = attacker;
    }

    return result;
  }

  private upgradeWinner(winner: Character): void {
    winner.rank++
    winner.skills++;
    winner.health = 12;
  }

  private downgradeLooser(looser: Character): void {
    if (looser.rank > 1) {
      looser.rank--;
    }
    looser.nextFightTimeMin = this.getNextHour();
    looser.health = 12;
  }

  private getNextHour(): Date {
    const nextHour = new Date();
    nextHour.setHours(new Date().getHours() + 1);

    return nextHour;
  }
}
