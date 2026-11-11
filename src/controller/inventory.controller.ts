import { RequestHandler } from "express";
import { pool } from "../db/db";
import ApiResponse from "../util/apiResponse.service";



export const lowstockCheckerController:RequestHandler=async(_req,res,next)=>{
   
try {
    const result=await pool.query(`SELECT product_name , product_details, product_price , sku,barcode 
        FROM products 
        WHERE stock_quantity <=low_stock_threshold
        AND is_active=true
        ORDER BY (stock_quantity-low_stock_threshold)ASC `)
    
        if((result).rows.length===0){
           return res.status(404).json(new ApiResponse(404,{},"no stock found"))
        }
        return res.status(200).json(new ApiResponse(200,result,"fetchin was success"))
} catch (error) {
    next(error)
}



}

export const adjustStocktController:RequestHandler=async(req,res,next)=>{
  try {
     const productId=req.params
     const stock_quantity=req.body

     if(!productId || typeof stock_quantity!=="number" || stock_quantity <0  ){
            return res.status(404).json(new ApiResponse(404,{},"invalid input : please procide proper input(provide valid productId and stock_quantity amount)"))
     }
  
     const adjust=await pool.query(`
      UPDATE products 
      SET stock_quantity=GREATEST(0,stock_quantity+$1),
      update_at=NOW()
      WHERE id=$2 AND is_active=true 
      RETURNING id, Product_name , stock_quantity
      `,[stock_quantity,productId])

      if(adjust.rows.length===0){
        return res.status(404).json(new ApiResponse(404,{},"no product was found"))
      }

      return res.status(200).json(new ApiResponse(200,adjust,"Update was a success"))
  } catch (error) {
    next(error)
  }
}