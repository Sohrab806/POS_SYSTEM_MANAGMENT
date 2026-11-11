import {z} from 'zod'

export const categorySchema= z.object({
    category_name:z
            .string()
            .trim()
            .min(3,"give a proper lenght category name atlest 3")
            .max(20,"category shouldnt be that long"),

    description:z
              .string()
              .trim()
              .min(6 ,"atlest give 6 cherecter discription")
              .max(255,"limite the desription under 100 character")        


})

export type CategoryBody= z.infer<typeof categorySchema>