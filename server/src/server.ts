import express from 'express'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'
import { connectDB } from './config/db'

import projectRoutes from './routes/project.routes'
import authRoutes from './routes/auth.routes'
import { corsOptions } from './config/cors'

dotenv.config()
connectDB()

const server = express()
server.use(cors(corsOptions))

server.use(express.json())

server.use(morgan('dev'))

server.use('/api/projects', projectRoutes)
server.use('/api/auth', authRoutes)

export default server