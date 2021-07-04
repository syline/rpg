export class OppponentsDto {
  attackerId: number;
  defenderId: number;

  constructor(attackerId: number, defenderId: number) {
    this.attackerId = attackerId;
    this.defenderId = defenderId;
  }
}
