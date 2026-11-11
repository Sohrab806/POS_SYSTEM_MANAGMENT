import { RequestHandler } from "express";
import { pool } from "../db/db";
import { userExistExistId } from "../util/userexist.service";
import ApiResponse from "../util/apiResponse.service";


export const createPurchaseOrderController:RequestHandler=async(req,res,next)=>{
   try {
     const userId=req.user?.id
     const {supplier_id,items }=req.body
     const userexist= await userExistExistId(userId)
     if(!userexist){
         return res.status(404).json(new ApiResponse(404,{},"user does not exist"))
     }
     if(!supplier_id || !Array.isArray(items) || items.length===0){
         return res.status(404).json(new ApiResponse(404,{},"give valid input for item and supplier Id"))
     } 
 
    await pool.query(`BEGIN`)
    
    const proPurchaseOrder=await pool.query(`INSERT INTO purchase_orders (supplier_id ,created_by,status)
     VALUES($1 ,$2 ,$3)
     RETURNING id, supplier_id ,status ,created_at
     `,[supplier_id, userId,"pending"] )
 
     const newPurchaseOrder= proPurchaseOrder.rows[0]
     const purchaseorderId= newPurchaseOrder.id
 
     for (const item of items){
         const {product_id,quantity,product_price}=item
 
         if(!product_id || !quantity ||quantity<=0 ||product_price===undefined){
             await pool.query(`ROLLBACK`)
             return res.status(404).json(new ApiResponse(404,{},"invalid item value"))
         }
 
         await pool.query(`INSERT INTO purchase_order_items
             (purchase_order_id ,product_id,quantity,cost_price)
             VALUES ($1,$2,$3,$4)`,[purchaseorderId,product_id,quantity,product_price])
 
         await pool.query(`COMMIT`)

         return res.status(201).json(
      new ApiResponse(201, { ...newPurchaseOrder, itemsCount: items.length }, "Purchase order created successfully")
    )
    
    
     }
 
   } catch (error) {
      next(error)
   }

}

export const reciveOrderContoller:RequestHandler=async(req,res,next)=>{
      
   try {
     const purchaseOrderId=req.params
     
     await pool.query(`BEGIN`)
 
     const purchaseOrder=await pool.query(`SELECT status FROM purchase_orders
         WHERE id=$1`,[purchaseOrderId])
 
 
      if(purchaseOrder.rows.length===0){
         await pool.query(`ROLLBACK`)
         return res.status(404).json(new ApiResponse(404,{},"purchase order was not found"))
      }   
 
      if(purchaseOrder.rows[0].status==="received"){
         await pool.query(`ROLLBACK`)
         return res.status(404).json(new ApiResponse(404,{},"order already received "))
      }
 
     
     const itemsResult=await pool.query(`SELECT id ,quantity FROM purchase_order_items 
     WHERE purcahse_order_id = $1`,[purchaseOrderId])
 
     const items=itemsResult.rows
 
     if(items.length===0){
         await pool.query(`ROLLBACK`)
         return res.status(404).json(new ApiResponse(404,{},"items were not found"))
     }
 
     for(const item of items){
         
         await pool.query(`UPDATE products 
             SET stock_quantity=stock_quantity + $1
             WHERE id =$2 `,[item.quantity,item.id])
     }
     await pool.query(
       `UPDATE purchase_orders SET status = 'received' WHERE id = $1`,
       [purchaseOrderId]
     )
 
     await pool.query(`COMMIT`)
     return res.status(200).json(new ApiResponse(200,{},"updating was success"))
   } catch (error) {
      next(error)
   }
}