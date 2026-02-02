import type { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
import User from "../models/User"
import { TUser } from "../types/user.types"

declare global {
    namespace Express {
        interface Request {
            user?: TUser
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization

    if (!bearer) {
        const error = new Error('No Autorizado')
        return res.status(401).json({ error: error.message })
    }

    const [, token] = bearer.split(' ')

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)

        if (typeof decode === 'object' && decode.id) {
            const user = await User.findById(decode.id).select('_id name email')

            if (user) {
                req.user = user

                next()
            } else {
                res.status(500).json({ error: 'Token No Valido' })
            }
        }

    } catch (error) {
        res.status(500).json({ error: 'Token No Valido' })
    }
}