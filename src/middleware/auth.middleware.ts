import { RequestHandler } from "express";
import  jwt  from "jsonwebtoken";
import ApiResponse from "../util/apiResponse.service";


interface JwtPayload {
  sub: string;
}

export const authVerify:RequestHandler=(req,res,next)=>{
   
    const autheader=req.headers.authorization
   

  try {
      if(!autheader || !autheader.startsWith("Bearer ")){
          return res.status(401).json(new ApiResponse(401,null,"no valid token"))
      }
      let token=autheader.split(" ")[1]
      const decodetoken=jwt.verify(token,process.env.ACEESSTOKEN_SECRET_KEY!)  as JwtPayload

     req.user={id:decodetoken.sub}
      next()

  } catch (error) {
    next(error)
  }

  

}