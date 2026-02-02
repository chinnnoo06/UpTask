import mongoose, { Schema, Types } from "mongoose";
import { TToken } from "../types/token.types";

const TokenSchema = new Schema<TToken>({
    token: {
        type: String,
        required: true,
    },
    user: {
        type: Types.ObjectId,
        ref: 'User'
    },
    expiresAt: {
        type: Date,
        default: Date.now(),
        expires: "10m"
    }
})

const Token = mongoose.model<TToken>('Token', TokenSchema, "tokens")
export default Token