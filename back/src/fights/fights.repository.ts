import { CharactersRepository } from "../characters/characters.repository";
import { Character } from "../characters/entities/character.entity";
import { EntityRepository, getConnection, QueryRunner, Repository } from "typeorm";
import { Fight } from "./entities/fight.entity";

@EntityRepository(Fight)
export class FightsRepository extends Repository<Fight> {

  async getFightsByCharacterId(id: number): Promise<Fight[]> {
    return this.find({
      where: [
        { attacker: { id } },
        { defender: { id } },
      ],
      relations: ['attacker', 'defender'],
    })
  }

  async saveFightResults(fight: Fight, winner: Character, looser: Character): Promise<void> {
    let queryRunner: QueryRunner;
    try {
      const connection = getConnection();
      queryRunner = connection.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      await queryRunner.manager.save<Fight>(fight);
      await queryRunner.manager.getCustomRepository(CharactersRepository).save<Character>(winner);
      await queryRunner.manager.getCustomRepository(CharactersRepository).save<Character>(looser);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}