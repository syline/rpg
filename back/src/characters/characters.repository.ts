import { NoOpponentError } from "../errors/no-opponent.error";
import { EntityRepository, Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { Character } from "./entities/character.entity";

@EntityRepository(Character)
export class CharactersRepository extends Repository<Character> {

  async getByUserId(id: number): Promise<Character[]> {
    const user = new User({ id });
    return this.find({ user, deleted: false });
  }

  async getById(id: number): Promise<Character> {
    return this.findOne({ id, deleted: false });
  }

  async getOpponent(id: number): Promise<Character> {
    return this.query(`
      WITH user_rank as (
        SELECT C2.RANK FROM CHARACTER C2 WHERE C2.ID = ${id}
      )
        
      SELECT 
        C.ID,
        C.USERID,
        C.NAME,
        C.SKILLS,
        C.HEALTH,
        C.ATTACK,
        C.DEFENSE,
        C.MAGIK,
        C.RANK,
        ABS(C.RANK - UR.RANK) as DIFF_RANK, 
        COUNT(F.ID) as NB_FIGHT, 
        RANDOM() as RAND
      FROM CHARACTER C, user_rank UR
      LEFT OUTER JOIN FIGHT F ON F.ATTACKERID = C.ID OR F.DEFENDERID = C.ID
      WHERE (C.NEXTFIGHTTIMEMIN IS NULL OR C.NEXTFIGHTTIMEMIN <= DATETIME('NOW'))
      AND C.ID <> ${id}
      AND C.DELETED = 0
      GROUP BY C.ID
      ORDER BY DIFF_RANK, NB_FIGHT, RAND
      LIMIT 1
    `)
      .then((characters: Character[]) => {
        if (characters.length === 0) {
          throw new NoOpponentError();
        }
        const characterTmp = characters[0];
        const character = new Character();

        character.id = characterTmp.id;
        character.attack = characterTmp.attack;
        character.defense = characterTmp.defense;
        character.health = characterTmp.health;
        character.magik = characterTmp.magik;
        character.name = characterTmp.name;
        character.rank = characterTmp.rank;
        character.skills = characterTmp.skills;

        return character;
      });
  }
}