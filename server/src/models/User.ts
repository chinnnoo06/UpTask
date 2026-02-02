import mongoose, { Schema } from "mongoose";
import { TUser } from "../types/user.types";

const UserSchema = new Schema<TUser>({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

const User = mongoose.model<TUser>('User', UserSchema, "users")
export default User