import { CreateUserDto } from "../../users/dto/create-user.dto";
import { User } from "../../users/entities/user.entity";
import { UserDto } from "../dto/user.dto";

export interface IAuthenticationService {
  register(createUserData: CreateUserDto): Promise<User>;

  getAuthenticatedUser(login: string, plainTextPassword: string): Promise<User>;

  login(user: User): Promise<UserDto>;
}