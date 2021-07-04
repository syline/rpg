export const getOpponentQuery = (characterId: number) => {
  return `
    SELECT 
      ID as id,
      NAME as name, 
      HEALTH as health, 
      ATTACK as attack, 
      DEFENSE as defense, 
      MAGIK as magik,
      RANK as rank
    FROM (
      -- characters with min diff rank + nb fights > 0 + free for fighting
      SELECT 
        C2.ID, 
        C2.USERID, 
        C2.NAME, 
        C2.HEALTH, 
        C2.ATTACK, 
        C2.DEFENSE, 
        C2.MAGIK,
        C2.RANK,
        -- calculate diff rank with current character
        C2.RANK - (
          SELECT C.RANK 
          FROM CHARACTER C 
          WHERE C.ID = ${characterId}
        ) AS DIFF_RANK,
        COUNT(*) AS NB_FIGHTS
      FROM CHARACTER C2      
      INNER JOIN FIGHT F ON (F.ATTACKERID = C2.ID OR F.DEFENDERID = C2.ID)
      WHERE C2.ID <> ${characterId} 
      -- get min diff rank
      AND DIFF_RANK = (
        SELECT 
          MIN(C2.RANK - (
            SELECT C.RANK 
            FROM CHARACTER C
            WHERE C.ID = ${characterId})
          )
        FROM CHARACTER C2 
        WHERE C2.ID <> ${characterId}
        AND (C2.NEXTFIGHTTIMEMIN IS NULL OR C2.NEXTFIGHTTIMEMIN <= DATETIME('NOW'))
      )
      AND (C2.NEXTFIGHTTIMEMIN IS NULL OR C2.NEXTFIGHTTIMEMIN <= DATETIME('NOW'))
      GROUP BY C2.ID
    
      UNION

      -- characters with min diff rank + nb fights = 0 + free for fighting
      SELECT 
        C3.ID, 
        C3.USERID, 
        C3.NAME, 
        C3.HEALTH, 
        C3.ATTACK, 
        C3.DEFENSE, 
        C3.MAGIK,
        C3.RANK,
        -- calculate diff rank with current character
        C3.RANK - (
          SELECT C.RANK 
          FROM CHARACTER C 
          WHERE C.ID = ${characterId}
        ) AS DIFF_RANK,
        0 AS NB_FIGHTS
      FROM CHARACTER C3
      WHERE C3.ID <> ${characterId}
      -- no fight
      AND C3.ID NOT IN (
        SELECT C4.ID
        FROM CHARACTER C4
        INNER JOIN FIGHT F ON (F.ATTACKERID = C4.ID OR F.DEFENDERID = C4.ID)
      )
      -- get min diff rank
      AND DIFF_RANK = (
        SELECT 
          MIN(C2.RANK - (
            SELECT C.RANK 
            FROM CHARACTER C
            WHERE C.ID = ${characterId})
          ) 
        FROM CHARACTER C2 
        WHERE C2.ID <> ${characterId}
        AND (C2.NEXTFIGHTTIMEMIN IS NULL OR C2.NEXTFIGHTTIMEMIN <= DATETIME('NOW'))
      )
      AND (C3.NEXTFIGHTTIMEMIN IS NULL or C3.NEXTFIGHTTIMEMIN <= DATETIME('NOW'))
      GROUP BY C3.ID
    ) 
    -- less nb fights
    WHERE NB_FIGHTS = (
      SELECT MIN(NB_FIGHTS) 
      FROM (
        -- characters with min diff rank + nb fights > 0 + free for fighting
        SELECT 
          C2.RANK - (
            SELECT C.RANK 
            FROM CHARACTER C 
            WHERE C.ID = ${characterId}
          ) AS DIFF_RANK,
          COUNT(*) AS NB_FIGHTS
        FROM CHARACTER C2      
        INNER JOIN FIGHT F ON (F.ATTACKERID = C2.ID OR F.DEFENDERID = C2.ID)
        WHERE C2.ID <> ${characterId} 
        -- min diff rank
        AND DIFF_RANK = (
          SELECT 
            MIN(C2.RANK - (
              SELECT C.RANK 
              FROM CHARACTER C
              WHERE C.ID = ${characterId})
            ) 
          FROM CHARACTER C2 
          WHERE C2.ID <> ${characterId}
          AND (C2.NEXTFIGHTTIMEMIN IS NULL OR C2.NEXTFIGHTTIMEMIN <= DATETIME('NOW'))
        )
        AND (C2.NEXTFIGHTTIMEMIN IS NULL or C2.NEXTFIGHTTIMEMIN <= DATETIME('NOW'))
        GROUP BY C2.ID
    
        UNION

        -- characters with min diff rank + nb fights = 0 + free for fighting
        SELECT 
          C3.RANK - (
            SELECT C.RANK 
            FROM CHARACTER C 
            WHERE C.ID = ${characterId}
          ) AS DIFF_RANK,
          0 AS NB_FIGHTS
        FROM CHARACTER C3
        WHERE C3.ID <> ${characterId}
        -- no fight
        AND C3.ID NOT IN (
          SELECT C4.ID
          FROM CHARACTER C4
          INNER JOIN FIGHT F ON F.ATTACKERID = C4.ID OR F.DEFENDERID = C4.ID 
        )
        -- min diff rank
        AND DIFF_RANK = (
          SELECT 
            MIN(C2.RANK - (
              SELECT C.RANK 
              FROM CHARACTER C
              WHERE C.ID = ${characterId})
            ) 
          FROM CHARACTER C2 
          WHERE C2.ID <> ${characterId}
          AND (C2.NEXTFIGHTTIMEMIN IS NULL OR C2.NEXTFIGHTTIMEMIN <= DATETIME('NOW'))
        )
        AND (C3.NEXTFIGHTTIMEMIN IS NULL OR C3.NEXTFIGHTTIMEMIN <= DATETIME('NOW'))
        GROUP BY C3.ID
      )
    )
    -- order randomly
    ORDER BY RANDOM()
    LIMIT 1`;
}