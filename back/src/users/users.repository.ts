import { EntityRepository, Repository } from "typeorm";
import { SqliteErrorsEnum } from "../enums/sqlite-errors.enum";
import { CredentialsError } from "../shared/errors/credentials.error";
import { LoginAlreadyExistError } from "../shared/errors/login-already-exist.error";
import { User } from "./entities/user.entity";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async createUser(user: User): Promise<User> {
    return this.save(user)
      .catch((error) => {
        if (error?.code === SqliteErrorsEnum.constraint) {
          throw new LoginAlreadyExistError();
        }
        throw error;
      })
  }

  async getByLogin(login: string): Promise<User> {
    return this.findOneOrFail({ login })
      .catch(() => {
        throw new CredentialsError();
      })
  }

}