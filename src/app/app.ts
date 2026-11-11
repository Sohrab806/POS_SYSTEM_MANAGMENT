import dotenv from "dotenv"
dotenv.config()
import cookieParser from 'cookie-parser'
import middleware from "./middleware"
import { ErrorFound, Errornotfound } from './error';
import express ,{request,response} from "express"
import router from "../routes/index.route";
import healthRouter from './health'

const app=express()
app.use(cookieParser())
app.use(middleware)
app.use(healthRouter)
app.use(router)

app.use(Errornotfound)
app.use(ErrorFound)

export default app 