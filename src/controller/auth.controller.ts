
import { RequestHandler } from "express"
import { SigninBody, Signupbody } from "../validateschema/validate.schema"
import bcrypt from "bcrypt"
import { userExistservice } from "../util/userexist.service"
import { pool } from "../db/db"
import { userfindOne } from "../util/userfindOne.service"
import jwt from 'jsonwebtoken'
import { generateAccessToken, generateRefreshToken } from "../util/generateToken"
import { saveRefreshToken } from "../util/saverefreshToken"
import { success } from "zod"




export const  signupController:RequestHandler<{},{ success: boolean; message: string; user?: {id:number, name: string; email: string } },Signupbody>=async(req,res,next)=>{
                
    const {name,email,password}=req.body
    const salt= Number(process.env.SALT)
    try{
        
        let user= await userExistservice(email)
       
        if (user){
          return res.status(400).json({success:false,message:"User already exist"})
        }
        const hash=await bcrypt.hash(password,salt)
        console.log(hash)

        const result= await pool.query(`INSERT INTO users (name,email,password) 
        VALUES ($1 ,$2, $3)
        RETURNING id , name ,email`,
        [name,email,hash]
    );
         console.log(result)
        const newUser =result.rows[0]
        console.log(newUser)
        return res.status(201).json({success:true,message:"user did not exist",user:newUser,})
           

    }catch(error){
        next(error)
    }
}

export const signinController:RequestHandler<{},{success?:boolean;message:string;payload?:{id:string},user?:{id:string,name:string,email:string},accessToken?:string},SigninBody>=async(req,res,next)=>{
      
    const {email,password}=req.body
    let user=await userfindOne(email)
   
    if(!user){
        return res.status(404).json({success:false,message:"user does not exist"})
    }

    try{
   const hashpassword=user.password
    
    const hash=await bcrypt.compare(password,hashpassword)
    
    if(!hash){

        return res.status(401).json({success:false,message:"incorrect password try again"})
    }
  
    const payload={
        id:user.id, 
        role:user.role 
    }
   
if(!process.env.ACEESSTOKEN_SECRET_KEY){
    res.status(404).json({success:false,message:"secret-key is missing"})
}

 const accesspayload={sub:user.id ,role:user.role }
 const refreshpayload={sub:user.id,type:"refresh",role:user.role}
 const accessToken=generateAccessToken(accesspayload)
 const refreshToken=generateRefreshToken(refreshpayload )

 await saveRefreshToken(user.id , refreshToken)

    res.cookie('resfreshtoken',refreshToken,{
         httpOnly:true,
         secure:true,
         sameSite:'lax',
         maxAge:24*60*60*100
    })
    res.status(200).json({success:true,message:"it was a success",accessToken,
    payload

    })

    

    }catch(error){

       next(error)
    }

}


export const refreshTokenController:RequestHandler=(req,res,next)=>{
    
    const token=req.cookies?.refreshToken

    if(!token){
        return res.status(404).json({success:false,message:"token is missing"})
    }

    
    try{

        const decode=jwt.verify(token,process.env.REFRESHTOKEN_SECRET_KEY!) as {
            sub:string;
            role:string;
            type?:string
        }

        if(!decode?.type){
            return res.status(400).json({success:false,message:"invalid token type"})
        }

        const accesspayload={sub:decode.sub,role:decode.role}
        const newAccesToken=generateAccessToken(accesspayload)

        return res.status(200).json({success:true,accessToken:newAccesToken})
        
        

    }catch(error){
        next(error)

    }


}

export const logoutController: RequestHandler = async (_req, res) => {
  

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  return res.status(200).json({ success: true, message: "Logged out" });
};


