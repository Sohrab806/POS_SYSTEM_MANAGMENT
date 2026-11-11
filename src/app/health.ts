import express from 'express'
import { RequestHandler } from 'express'
import { success } from 'zod'

const router=express.Router()

router.get("/health",(req,res)=>{
    console.log("router is working")
    res.status(202).json({success:true,message:"health router is working"})
})

export default router