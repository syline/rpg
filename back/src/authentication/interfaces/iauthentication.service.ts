import { User } from "../../users/entities/user.entity";
import { UserTokenDto } from "../dto/user-token.dto";

export interface IAuthenticationService {
  register(login: string, password: string): Promise<User>;

  checkLoginPassword(login: string, plainTextPassword: string): Promise<User>;

  getAccessToken(user: User): Promise<UserTokenDto>;
}