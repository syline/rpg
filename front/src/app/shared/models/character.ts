import { CharacterDto } from '../dto/character.dto';
import { CharacteristicEnum } from '../enums/characteristic.enum';
import { User } from './user';

export class Character {
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

  constructor(dto: CharacterDto | Character) {
    Object.assign(this, dto);
  }

  canFight(): boolean {
    return this.nextFightTimeMin === null || this.nextFightTimeMin <= new Date();
  }

  hasSkills(): boolean {
    return this.skills > 0;
  }

  canLevelUpHealth(): boolean {
    return this.skills > 0;
  }

  levelUpHealth(): void {
    if (this.canLevelUpHealth()) {
      this.health++;
      this.skills--;
    }
  }

  getCostToLevelUp(characteristic: CharacteristicEnum): number {
    // let cost: number;
    // switch (characteristic) {
    //   case CharacteristicEnum.attack:
    //     cost = Math.ceil(this.attack / 5);
    //     break;
    //   case CharacteristicEnum.defense:
    //     cost = Math.ceil(this.defense / 5);
    //     break;
    //   case CharacteristicEnum.health:
    //     cost = 1;
    //     break;
    //   case CharacteristicEnum.magik:
    //     cost = Math.ceil(this.magik / 5);
    //     break;
    // }
    // return cost;
    if (characteristic === CharacteristicEnum.health) {
      return 1;
    }

    const cost = Math.ceil(this[characteristic] / 5);
    return cost > 0 ? cost : 1;
  }

  canLevelUp(characteristic: CharacteristicEnum): boolean {
    return this.skills > 0 && this.skills >= this.getCostToLevelUp(characteristic);
  }

  levelUp(characteristic: CharacteristicEnum): void {
    if (!this.canLevelUp(characteristic)) {
      return;
    }

    this.skills -= this.getCostToLevelUp(characteristic);
    this[characteristic]++;
    // switch (characteristic) {
    //   case CharacteristicEnum.attack:
    //     this.attack++;
    //     break;
    //   case CharacteristicEnum.defense:
    //     this.defense++;
    //     break;
    //   case CharacteristicEnum.health:
    //     this.health++;
    //     break;
    //   case CharacteristicEnum.magik:
    //     this.magik++;
    //     break;
    // }
  }

  levelDown(characteristic: CharacteristicEnum): void {
    this[characteristic]--;
    this.skills += this.getCostToLevelUp(characteristic);
  }
}
