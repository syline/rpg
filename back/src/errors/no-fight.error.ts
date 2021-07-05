export class NoFightError extends Error {
  constructor() {
    super('Combat impossible car aucune attaque possible');
  }
}