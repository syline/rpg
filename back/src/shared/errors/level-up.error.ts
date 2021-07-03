import { CustomError } from "./custom.error";

export class LevelUpError extends CustomError {
  constructor() {
    super('La mise à jour des compétences n\'est pas conforme aux règles de transfert de compétences');
  }
}