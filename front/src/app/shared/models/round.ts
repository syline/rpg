import { RoundDto } from '../dto/round.dto';

export class Round {
  id: number;
  attackerDamagesReceived: number;
  defenderDamagesReceived: number;

  constructor(dto: RoundDto) {
    Object.assign(this, dto);
  }
}
