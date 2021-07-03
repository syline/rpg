import { CustomError } from "./custom.error";

export class MaxNbCharacterError extends CustomError {
  constructor() {
    super('Vous ne pouvez pas avoir plus de 10 personnages');
  }
}