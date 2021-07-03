import { CustomError } from "./custom.error";

export class NoFightError extends CustomError {
  constructor() {
    super('Combat impossible car aucune attaque possible');
  }
}