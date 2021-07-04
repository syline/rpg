export class LevelUpError extends Error {
  constructor() {
    super('La mise à jour des compétences n\'est pas conforme aux règles de transfert de compétences');
  }
}