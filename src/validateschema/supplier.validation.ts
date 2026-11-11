import {z} from 'zod'

export const supplierSchema= z.object({
     name:z
            .string()
            .trim()
            .min(3,"give a proper lenght category name atlest 3")
            .max(20,"category shouldnt be that long"),

      email:z
              .string()
              .trim()
              .toLowerCase()
              .email("please provide proper email address"),

     phone:z
           .string()
           .trim()
           .min(7, "Phone number is too short")
           .max(20, "Phone number is too long")
           .regex(
            /^[0-9\+\-\s\(\)]+$/, 
            "Please provide a valid phone number (digits, spaces, +, -, and parentheses only)")
         
})

export type supplierBody= z.infer<typeof supplierSchema >