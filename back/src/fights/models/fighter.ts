import { User } from "../../users/entities/user.entity";
import { Character } from "../../characters/entities/character.entity";
import { Dice } from "../../fights/models/dice";

export class Fighter {
  id: number;
  name: string;
  skills: number;
  health: number;
  attack: number;
  defense: number;
  magik: number;
  rank: number;
  nextFightTimeMin?: Date;
  user: User;

  constructor(character: Character) {
    Object.assign(this, character);
  }

  isHarmless(): boolean {
    return this.attack === 0;
  }

  isAlive(): boolean {
    return this.health > 0;
  }

  getAttackDamages(defense: number): number {
    const dice = new Dice(this.attack);
    const attack = dice.getValue();
    let damages = 0;

    if (attack > defense) {
      damages = attack - defense;

      if (damages === this.magik) {
        damages *= 2;
      }
    }

    return damages;
  }

  sufferDamage(damages: number): void {
    this.health -= damages;
  }

  levelUp(): void {
    this.rank++
    this.skills++;
  }

  levelDown(): void {
    if (this.rank > 1) {
      this.rank--;
    }
    this.nextFightTimeMin = this.getNextHour();
  }
 
  private getNextHour(): Date {
    const nextHour = new Date();
    nextHour.setHours(new Date().getHours() + 1);

    return nextHour;
  }

  heal(): void {
    this.health = 12;
  }
}