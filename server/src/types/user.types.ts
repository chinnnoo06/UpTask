import { Document } from "mongoose"

export type TUser = Document & {
    email: string
    password: string
    name: string
    confirmed: boolean
}