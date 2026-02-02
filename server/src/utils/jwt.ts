import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

type TUserPayload = {
    id: Types.ObjectId
}

export const generateJWT = (payload: TUserPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '180d'
    })
    return token
}