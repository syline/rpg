import { User } from "../../users/entities/user.entity";

export class UserTokenDto {
  id: number;
  login: string;
  accessToken: string;

  constructor(user: User, accessToken: string) {
    this.id = user.id;
    this.login = user.login;
    this.accessToken = accessToken;
  }
}