import { ChallengersDto } from "../dto/fight.dto";
import { Fight } from "../entities/fight.entity";
import { IRound } from "./iround";

export interface IFightsService {
  findAllByCharacterId(id: number): Promise<Fight[]>;

  fights(fight: ChallengersDto): Promise<IRound[]>
}