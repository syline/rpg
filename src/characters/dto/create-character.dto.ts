import { User } from "../../users/entities/user.entity";

export class CreateCharacterDto {
  name: string;
  skills: number;
  health: number;
  attack: number;
  defense: number;
  magik: number;
  rank: number;
  user: User;
}
