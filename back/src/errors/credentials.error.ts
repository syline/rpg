export class CredentialsError extends Error {
  constructor() {
    super('Login et/ou mot de passe invalide');
  }
}