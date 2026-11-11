import express from 'express'
import { authVerify } from '../middleware/auth.middleware'
import { adjustStocktController, lowstockCheckerController } from '../controller/inventory.controller'
import { createPurchaseOrderController, reciveOrderContoller } from '../controller/inventoryOrder.controller'
const router=express.Router()

router.get('/low-stock',authVerify,lowstockCheckerController)
router.post('/purchase-order',authVerify,createPurchaseOrderController)
router.patch('/adjust',authVerify,adjustStocktController)
router.patch('/adjust/bulk-order',authVerify,reciveOrderContoller)
export default router