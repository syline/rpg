export class Dice {
  max: number;

  constructor(max: number) {
    this.max = max;
  }

  getValue(): number {
    if (this.max === 0) {
      return 0;
    }

    return Math.floor(Math.random() * this.max + 1);
  }
}