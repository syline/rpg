import { Fight } from "../entities/fight.entity";
import { FightResults } from "../models/fight-result";

export interface IFightsService {
  findAllByCharacterId(id: number): Promise<Fight[]>;

  fight(attackerId: number, defenderId: number): Promise<FightResults>
}