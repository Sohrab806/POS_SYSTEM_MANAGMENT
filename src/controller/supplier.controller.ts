import { RequestHandler } from "express";
import { pool } from "../db/db";
import ApiResponse from "../util/apiResponse.service";

 

 export const supplierEntry:RequestHandler=async(req,res,next)=>{
    const {name,contact_email,phone}=req.body
    
    const supplier= await pool.query(`
        INSERT INTO suppliers (name,contact_email, phone)
        VALUES($1,$2,$3)
        RETURN name,contact_email
        `,[name,contact_email,phone])

   if(supplier.rows[0]===0){
     return res.status(404).json(new ApiResponse(404,{},"inserting supplier failed"))
   }

   return res.status(200).json(    new ApiResponse(200, supplier,"Insert complete"))
 }

 export const updateSupplier:RequestHandler=async(req,res,next)=>{
  
    const {id}=req.params
    const uploaditems=req.body

    const supplierField=[
        "name",
        "contact_email",
        "phone"
    ]
      

    const   fieldtoUpload : string[]=[]
    const values:any[]=[]
    let paramindex=1
    for( const fields of supplierField){

        if(uploaditems[fields]!==undefined){
           fieldtoUpload.push(`${fields}=$${paramindex}`)
           values.push(uploaditems[fields])
           paramindex++;

        }

        if(fieldtoUpload.length===0){
             
            return res.status(404).json(new ApiResponse(404,{},"no field to upload"))
        }

        values.push(id)

        const result=await pool.query(`UPDATE supplier SET ${fieldtoUpload.join(",")}
        WHERE id=$${paramindex}
        RETURN *
        `,[values])
       
        if(result.rows[0].length===0){
             return res.status(404).json(new ApiResponse(404,{},"update field was failed"))
        }

        return res.status(202).json(new ApiResponse(202,result,"update was success"))
    }
 }