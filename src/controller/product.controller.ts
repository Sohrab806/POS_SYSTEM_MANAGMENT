import { RequestHandler } from "express";
import { pool } from "../db/db";
import { ProductBody } from "../validateschema/product.validation.schema";

import ApiResponse from "../util/apiResponse.service";
import { registry } from "zod/v4/core";




export const productEntryController: RequestHandler<
  {},
  { success: boolean; message: string; product?: object },
  ProductBody
> = async (req, res, next) => {

  try {
    const {
      product_name,
      product_details,
      sku,
      barcode,
      product_price,
      selling_price,
      stock_quantity,
      low_stock_threshold,
      image_url
    } = req.body;

    const result = await pool.query(
      `INSERT INTO products (
        product_name,
        product_details,
        sku,
        barcode,
        product_price,
        selling_price,
        stock_quantity,
        low_stock_threshold,
        image_url
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        product_name,
        product_details || null,
        sku || null,
        barcode || null,
        product_price,
        selling_price,
        stock_quantity,
        low_stock_threshold,
        image_url || null
      ]
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: result.rows[0]
    });

  } catch (error) {
    next(error);
  }
};


export const productAll:RequestHandler=async(_req,res,next)=>{

try {
    const products= await pool.query(`SELECT * FROM products `)
     if(products.rows.length===0){
        res.status(404).json(new ApiResponse(404,{},"couldn't found any data"))
     }
    
     res.status(200).json(new ApiResponse(200,products,"product recieved successfull"))
} catch (error) {
     next(error)
}

}

export const productSingleController:RequestHandler<{id:string}>=async(req,res,next)=>{
    
     try {
         const {id}=req.params

         const product=await pool.query(`SELECT * FROM products WHERE id =$1 `,[id]) 
         if(product.rows.length===0){
            return res.status(4004).json(new ApiResponse(404,{},"no product was found give proper id"))
         }
         return res.status(200).json(new ApiResponse(200,product,"product fetch was successfull"))

     } catch (error) {
        next(error)
     }
}


export const productUpdateController: RequestHandler<{ id: string }> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const allowedFields = [
      "product_name",
      "product_details",
      "category_id",
      "sku",
      "barcode",
      "product_price",
      "selling_price",
      "stock_quantity",
      "low_stock_threshold",
      "image_url",
      "is_active",
    ];


    const fieldsToUpdate: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

   for(const fields of allowedFields){

    if(updates[fields]!==undefined){
        fieldsToUpdate.push(`${fields}=$${paramIndex}`)
        values.push(updates[fields])
        paramIndex++
    }
   }

if(fieldsToUpdate.length===0){
   return res.status(404).json(new ApiResponse(404,{},"give proepr field")) 
}


    values.push(id);

    const query = `
      UPDATE products
      SET ${fieldsToUpdate.join(", ")}, updated_at = NOW()
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Product not found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, result.rows[0], "Product updated successfully")
    );

  } catch (error) {
    next(error);
  }
};

export const productDeleteController:RequestHandler<{id:string}>=async(req,res,next)=>{

    try {
        const {id}=req.params
    
        const product= await pool.query(`UPDATE products SET is_active = false
            updated_at =NOW()
            WHERE id =$1 AND is_active =true 
            RETURNING id,product_name `,[id])
    
            if(product.rows.length ===0){
                return res.status(404).json(new ApiResponse(404,{},"no product found"))
            }

            return res.status(200).json(new ApiResponse(200,product,"update success"))
    } catch (error) {
        next(error)
    }

}


export const productSearchController: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const search = req.query.q;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    if (typeof search !== "string" || !search.trim()) {
      return res.status(400).json(
        new ApiResponse(400, {}, "Search query is required")
      );
    }

    const searchTerm = search.trim();
    const keyword = `%${searchTerm}%`;


    const query = `
      SELECT *,
        CASE 
          WHEN barcode = $1 THEN 1
          WHEN sku = $1 THEN 2
          ELSE 3
        END as match_priority
      FROM products
      WHERE is_active = true
      AND (
        barcode = $1
        OR sku = $1
        OR product_name ILIKE $2
        OR product_details ILIKE $2
      )
      ORDER BY match_priority ASC, product_name ASC
      LIMIT $3 OFFSET $4
    `;

    const result = await pool.query(query, [searchTerm, keyword, limit, offset]);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          page,
          limit,
          results: result.rows,
        },
        "Product search completed successfully"
      )
    );

  } catch (error) {
    next(error);
  }
};