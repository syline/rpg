export class CreateCharacterDto {
  userId: number;
  name: string;

  constructor(name: string, userId: number) {
    this.userId = userId;
    this.name = name;
  }
}
