import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../entities/user.entity";

export interface IUsersService {
  create(user: CreateUserDto): Promise<User>;

  getByLogin(login: string): Promise<User>;
}