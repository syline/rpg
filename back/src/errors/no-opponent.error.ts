export class NoOpponentError extends Error {
  constructor() {
    super('Aucun opposant disponible');
  }
}