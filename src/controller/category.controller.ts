import { RequestHandler } from "express";
import { pool } from "../db/db";
import ApiResponse from "../util/apiResponse.service";




export const categoriesEntryController:RequestHandler=async(req,res,next)=>{
      
    try {
        const {category_name,description}=req.body

        const is_active=true;
    
        let category= await pool.query(`SELECT category_name 
            FROM categories 
            WHERE category_name=$1
            `,[category_name])
    
            if(category.rows.length>0){
                return res.status(400).json(new ApiResponse(400,{},"no category found"))
            }
            category=await pool.query(`INSERT INTO categories(category_name ,description,is_active) VALUES($1,$2,$3) RETURNING* `,[category_name,description,is_active]) 
    
            return res.status(200).json(new ApiResponse(200,{},"fetching was a success"))
    } catch (error) {
        next(error)
    }
}


export const categoryAll:RequestHandler=async(req,res,next)=>{

      const category=await pool.query(`
           SELECT * FROM categories
        `)
    if(category.rows.length===0){
        return res.status(404).json(new ApiResponse(404,{},"no category found"))
    }

    return res.status(200).json(new ApiResponse(200,category,"fetching category was success"))
} 



export const productBycategoryController:RequestHandler<{categoryId:string}>=async(req,res,next)=>{
    try {
        const {categoryId}=req.params
        const product=await pool.query(`
            SELECT 
            FROM products p
            INNER JOIN categories c
            ON p.category_id =c.id
            WHERE p.cat$egory_id=$1
            AND p.is_active = true 
            ORDER BY p.product_name ASC
            `,[categoryId])
    
            return res.status(200).json(new ApiResponse(200,product.rows,"success"))
    } catch (error) {
        next(error)
    }
}