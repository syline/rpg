import { Fight } from "../entities/fight.entity";
import { IRound } from "./iround";

export interface IFightsService {
  findAllByCharacterId(id: number): Promise<Fight[]>;

  fights(attackerId: number, defenderId: number): Promise<IRound[]>
}