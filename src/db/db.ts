import {Pool} from "pg";
import dotenv from 'dotenv'

dotenv.config()

export const pool= new Pool({
   host:process.env.HOST,
   port:Number(process.env.DB_PORT),
   user:process.env.USER,
   password:process.env.PASSWORD,
   database:process.env.DB_NAME

}) 