import express from 'express'
import { authVerify } from '../middleware/auth.middleware'
import { categoriesEntryController, categoryAll, productBycategoryController } from '../controller/category.controller'
import { validation } from '../middleware/validation.middleware'
import { categorySchema } from '../validateschema/category.validation.schema'

const router=express.Router()


router.post('/entry',validation(categorySchema),authVerify,categoriesEntryController)
router.get('/all',authVerify,categoryAll)

router.get('/:categoryId',authVerify,productBycategoryController)


export default router