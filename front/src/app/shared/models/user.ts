import { IUser } from '../interfaces/iuser';

export class User implements IUser {
  accessToken: string;
  id: number;
  login: string;
}
