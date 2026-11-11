import cors from 'cors'
import morgan from 'morgan'
import  express  from 'express'

const middleware= [cors(), morgan('dev'),express.json()]
 export default middleware
