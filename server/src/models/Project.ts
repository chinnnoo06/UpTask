import mongoose, { Schema, Types } from "mongoose";
import { TProject } from "../types/project.types";
import Task from "./Task";
import Note from "./Note";

const ProjectSchema = new Schema<TProject>({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ],
    manager: {
        type: Types.ObjectId,
        ref: 'User'
    },
    team: [
        {
            type: Types.ObjectId,
            ref: 'User'
        },
    ]

}, { timestamps: true })

ProjectSchema.pre('deleteOne', { document: true }, async function () {
    const projectId = this._id

    if (!projectId) return

    const tasks = await Task.find({ project: projectId })

    for (const task of tasks) {
        await Note.deleteMany({ task: task._id })
    }

    await Task.deleteMany({ project: projectId })
})

const Project = mongoose.model<TProject>('Project', ProjectSchema, "projects")
export default Project