import { User } from "../entities/user.entity";

export interface IUsersService {
  create(user: User): Promise<User>;

  getByLogin(login: string): Promise<User>;
}