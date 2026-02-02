import mongoose, { Schema, Types } from "mongoose";
import { TNote } from "../types/note.types";

const NoteSchema = new Schema<TNote>({
    content: {
        type: String,
        required: true,
    },
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    task: {
        type: Types.ObjectId,
        ref: 'Task',
        required: true
    }
}, { timestamps: true })

const Note = mongoose.model<TNote>('Note', NoteSchema, "notes")
export default Note