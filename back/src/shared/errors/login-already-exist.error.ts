export class LoginAlreadyExistError extends Error {
  constructor() {
    super('Le login existe déjà.');
  }
}