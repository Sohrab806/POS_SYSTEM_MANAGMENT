import { NextFunction, RequestHandler } from "express";
import ApiResponse from "../util/apiResponse.service";


export const requireRole=(allowedRole:string[]):RequestHandler=>{
    return (req, res ,next)=>{
          
        const user=(req as any).user

        if(!user || !user.role){
            return res.status(401).json(new ApiResponse(404,{},"unauthorised:no user role found"))
        }
          
        if (!allowedRole.includes(user.role)) {
      return res.status(403).json(
        new ApiResponse(
          403, 
          {}, 
          "Forbidden: You do not have the required permissions to perform this action"
        )
      );
    }

        next()
    }
}