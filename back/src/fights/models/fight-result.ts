import { IRound } from "../interfaces/iround";
import { Fighter } from "./fighter";

export class FightResults {
  winner: Fighter;
  looser: Fighter;
  rounds: IRound[];
}