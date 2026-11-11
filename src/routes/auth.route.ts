import express from 'express'
import {logoutController, signinController, signupController} from '../controller/auth.controller'
import { validation } from '../middleware/validation.middleware'
import { signupSchema , loginSchema } from '../validateschema/validate.schema'

const router=express.Router()

router.post('/sign_up',validation(signupSchema),signupController)
router.post('/sign_in',validation(loginSchema),signinController)
router.post('/logout',logoutController)

export default router