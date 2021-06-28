import { Fight } from "../entities/fight.entity";

export interface IFightsService {
  findAllByCharacterId(id: number): Promise<Fight[]>;
}