import { Request,Response,NextFunction } from "express"


const Errornotfound=(_req:Request,_res:Response,next:NextFunction)=>{
    const error= Object.assign(
        new Error("server side error "),{statusCode:404}
)
     next(error)
    
}
const ErrorFound=(err:Error & {statusCode?:number},_req:Request,res:Response,_next:NextFunction)=>{

    const statusCode= err.statusCode ?? 500;

    res.status(statusCode).json({
        success:false,
        message:err.message || "internal server error"
    })
  
      
}

export  {ErrorFound , Errornotfound}