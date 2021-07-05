import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({
    message: 'Le login doit être une chaîne de caractères'
  })
  @IsNotEmpty({
    message: 'Le login est obligatoire'
  })
  login: string;

  @IsString({
    message: 'Le mot de passe doit être une chaîne de caractères'
  })
  @IsNotEmpty({
    message: 'Le mot de passe est obligatoire'
  })
  password: string;
}