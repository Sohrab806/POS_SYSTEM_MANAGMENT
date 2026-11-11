import http from 'http'

import app from './app/app'
import {pool} from './db/db'
import { promises } from 'dns'
import { error } from 'console'

const server=http.createServer(app)
const PORT=process.env.PORT || 8082

const serverstarter=async():Promise<void>=>{

    try{

        await pool.query("SELECT 1")
        console.log("database is connected")

        server.listen(PORT,()=>{
    
        console.log("server is running at :",PORT)
    })
    }catch(error){
      console.error("server setup failed",error)
         await pool.end();
         process.exitCode = 1;
    }
    
}

serverstarter()