import jwt from "jsonwebtoken";

interface tokenPayload{
    id:string
}

const accessTokenSecret=process.env.ACEESSTOKEN_SECRET_KEY
const refreshTokenTokenSecret=process.env.REFRESHTOKEN_SECRET_KEY

if(!accessTokenSecret || !refreshTokenTokenSecret){
    throw new Error("jwt secret-key missing")
}
export const generateAccessToken=(payload:{sub:string,role:string})=>{
   
  return jwt.sign(payload,accessTokenSecret!,{
    expiresIn:"15m"
  })

}
export const generateRefreshToken=(payload:{sub:string,type:string,role:string})=>{
   
  return jwt.sign(payload,refreshTokenTokenSecret!,{
    expiresIn:"7d"
  })

}