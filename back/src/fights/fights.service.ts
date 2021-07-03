import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoFightError } from 'src/shared/errors/no-fight.error';
import { Repository } from 'typeorm';
import { Character } from '../characters/entities/character.entity';
import { ICharactersService } from '../characters/interfaces/icharacters.service';
import { ICHARACTERS_SERVICE } from '../constants/services.constant';
import { ChallengersDto } from './dto/fight.dto';
import { Fight } from './entities/fight.entity';
import { IFightResult } from './interfaces/ifight-result';
import { IFightsService } from './interfaces/ifights.service';
import { IRound } from './interfaces/iround';

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
        { character1: { id } },
        { character2: { id } }
      ],
      relations: ['character1', 'character2']
    })
  }

  async fights(challengersId: ChallengersDto): Promise<IRound[]> {
    const [character1, character2] = await this.getChallengers(challengersId);

    if (character1.attack === 0 && character2.attack === 0) {
      throw new NoFightError();
    }

    const rounds = this.launchFight(character1, character2);

    const fightResults = this.determineWinnerAndLooser(character1, character2);

    this.upgradeWinner(fightResults.winner);
    this.downgradeLooser(fightResults.looser);

    const fight = new Fight(character1.id, character2.id, fightResults.winner.id);

    await Promise.all([
      this.charactersService.update(character1.id, character1),
      this.charactersService.update(character2.id, character2),
      this.fightRepository.save(fight),
    ])

    return rounds;
  }

  private async getChallengers(challengersId: ChallengersDto): Promise<Character[]> {
    return await Promise.all([
      this.charactersService.findOne(challengersId.character1Id),
      this.charactersService.findOne(challengersId.character2Id),
    ])
  }

  private launchFight(character1: Character, character2: Character): IRound[] {
    const rounds: IRound[] = [];
    let nbRound = 1;

    while (character1.health > 0 && character2.health > 0) {
      const character2DamagesReceived = this.attack(character1, character2);

      if (character2.health < 1) {
        rounds.push({ id: nbRound, character2DamagesReceived, character1DamagesReceived: 0 });
        break;
      }

      const character1DamagesReceived = this.attack(character2, character1);
      rounds.push({ id: nbRound, character2DamagesReceived, character1DamagesReceived });

      nbRound++;
    }

    return rounds;
  }

  private attack(attacker: Character, defender: Character): number {
    const attackValue = this.getDiceValue(attacker.attack);

    let damages = this.getAttackDamages(attackValue, defender.defense);

    if (damages === attacker.magik) {
      damages *= 2;
    }
    defender.health -= damages;

    return damages;
  }

  private getDiceValue(max): number {
    if (max === 0) {
      return 0;
    }

    return Math.floor(Math.random() * max + 1);
  }

  private getAttackDamages(attackValue: number, defenseValue: number): number {
    if (attackValue > defenseValue) {
      return attackValue - defenseValue;
    }
    return 0;
  }

  private determineWinnerAndLooser(character1: Character, character2: Character): IFightResult {
    const result = {
      winner: character1,
      looser: character2,
    };

    if (character2.health > 0) {
      result.winner = character2;
      result.looser = character1;
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
