import {z} from 'zod'

import { RequestHandler } from 'express'


export  const validation=(schema:z.ZodType):RequestHandler=>(req,res,next)=>{

    const result=schema.safeParse(req.body)


 

    if(!result.success){
        res.status(404).json({succes:"failed",error:result.error?.issues,message:"please give proper data"})
        return;
    }
      
    
    req.body=result.data
    next()


}