import type { NextFunction, Request, Response } from "express"
import { TTask } from "../types/task.types"
import Task from "../models/Task"

declare global {
    namespace Express {
        interface Request {
            task?: TTask
        }
    }
}

export const taskExist = async (req: Request, res: Response, next: NextFunction) => {
    const { taskId } = req.params
    try {
        const task = await Task.findById(taskId)

        if (!task) {
            const error = new Error('Tarea no encontrada')
            return res.status(404).json({ error: error.message })
        }

        req.task = task
        next()
    } catch (error) {
        return res.status(500).json({ error: "Hubo un error" })
    }
}

export const taskBelongToProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.task.project.equals(req.project._id)) {
            const error = new Error('acción invalida')
            return res.status(404).json({ error: error.message })
        }

        next()
    } catch (error) {
        return res.status(500).json({ error: "Hubo un error" })
    }
}

export const hasAuthorization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user._id.toString()!== req.project.manager.toString()) {
            const error = new Error('acción invalida')
            return res.status(404).json({ error: error.message })
        }

        next()
    } catch (error) {
        return res.status(500).json({ error: "Hubo un error" })
    }
}