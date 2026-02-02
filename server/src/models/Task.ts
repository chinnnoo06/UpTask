import mongoose, { Schema, Types } from "mongoose";
import { taskStatus, TTask } from "../types/task.types";
import Note from "./Note";

const TaskSchema: Schema = new Schema<TTask>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    project: {
        type: Types.ObjectId,
        ref: "Project",
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING
    },
    completedBy: [
        {
            user: {
                type: Types.ObjectId,
                ref: "User",
                default: null
            },
            status: {
                type: String,
                enum: Object.values(taskStatus),
                default: taskStatus.PENDING
            },
        }
    ],
    notes: [
        {
            type: Types.ObjectId,
            ref: 'Note'
        }
    ]
}, { timestamps: true })

TaskSchema.pre('deleteOne', { document: true }, async function () {
    const taskId = this._id

    if (!taskId) return

    await Note.deleteMany({ task: taskId })
})

const Task = mongoose.model<TTask>('Task', TaskSchema, "tasks")
export default Task