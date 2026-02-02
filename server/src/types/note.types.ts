import { Document, Types } from "mongoose"

export type TNote = Document & {
    content: string,
    createdBy: Types.ObjectId,
    task: Types.ObjectId,
}