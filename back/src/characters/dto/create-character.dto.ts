import { IsNotEmpty, IsString } from "class-validator";

export class CreateCharacterDto {
  @IsString({
    message: 'Le nom doit être une chaîne de caractères'
  })
  @IsNotEmpty({
    message: 'Le nom est obligatoire'
  })
  name: string;
}
