import { Document, Types } from "mongoose"

export type TToken = Document & {
    token: string,
    user: Types.ObjectId,
    expiresAt: Date
}