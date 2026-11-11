import express from 'express'
import { validation } from '../middleware/validation.middleware'
import { productSchema } from '../validateschema/product.validation.schema'
import { authVerify } from '../middleware/auth.middleware'
import { productAll, productDeleteController, productEntryController, productSearchController, productSingleController, productUpdateController } from '../controller/product.controller'

import categoryRoutes from './category.routes'


const router=express.Router()

router.post('/entry',validation(productSchema),authVerify,productEntryController)

router.get('/all',authVerify,productAll)
router.get('/search',authVerify,productSearchController) 

router.get('/:id',authVerify,productSingleController)
router.patch('/:id',validation(productSchema),productUpdateController)
router.delete('/:id',validation(productSchema),productDeleteController)

router.use('/category',categoryRoutes)


export default router