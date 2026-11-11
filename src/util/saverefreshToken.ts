import { pool } from "../db/db"


const MAX_SESSIONS = 3;
export const saveRefreshToken=async(userId:string,token:string)=>{
     
    const result=await pool.query(
        `INSERT INTO refresh_tokens (user_id , refresh_token, expires_at)
        VALUES ($1 , $2 ,NOW()+ INTERVAL '7 days')
        RETURNING id, user_id ,Expires_at`,
        [userId,token]
    )

    await pool.query(
    `
    DELETE FROM refresh_tokens
    WHERE id IN (
      SELECT id FROM refresh_tokens
      WHERE user_id = $1
      ORDER BY created_at DESC
      OFFSET $2
    )
    `,
    [userId, MAX_SESSIONS]
  );

    return result.rows[0]

}