import { Fight } from "../entities/fight.entity";
import { IRound } from "./iround";

export interface IFightsService {
  findAllByCharacterId(id: number): Promise<Fight[]>;

  fight(attackerId: number, defenderId: number): Promise<IRound[]>
}