export class MaxNbCharacterError extends Error {
  constructor() {
    super('Vous ne pouvez pas avoir plus de 10 personnages');
  }
}