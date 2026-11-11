import { Result } from "pg"
import { pool } from "../db/db"

export const userfindOne=async(email:string)=>{
     const  user=await pool.query(
        `SELECT id ,name,email,password 
        FROM users
        WHERE email=$1
        LIMIT 1`,[email]
     )

     if(user.rows.length===0){
        return null
     }

     return user.rows[0]
}