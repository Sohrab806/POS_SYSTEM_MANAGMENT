import express from "express"
import authentication from './auth.route'
import userRoute from './user.route'
import productRoute from './product.route'
import inventoryRoute from './inventory.routes'



const router =express.Router()

router.use('/auth',authentication)
router.use('/user',userRoute)
router.use('/product',productRoute)
router.use('/inventory',inventoryRoute)


export default router