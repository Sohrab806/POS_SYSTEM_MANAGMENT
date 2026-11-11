
import { pool } from "../db/db"

export const userExistservice=async(email:string): Promise<boolean>=>{
     const user= await pool.query(
        `SELECT id FROM users WHERE email = $1`,
        [email]
     )

     return user.rows.length > 0 ;
}

export const userExistExistId=async(id:string|undefined)=>{

    if(!id) return false
    
    const user = await pool.query(
        `SELECT name FROM users WHERE id=$1`,[id]
    )
    return user.rows.length>0

}

