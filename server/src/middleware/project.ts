import type { NextFunction, Request, Response } from "express"
import Project from "../models/Project"
import { TProject } from "../types/project.types"

declare global {
    namespace Express {
        interface Request {
            project: TProject
        }
    }
}

export const projectExist = async (req: Request, res: Response, next: NextFunction) => {
    const { projectId } = req.params
    try {
        const project = await Project.findById(projectId)

        if (!project) {
            const error = new Error('Proyecto no encontrado')
            return res.status(404).json({ error: error.message })
        }
        
        req.project = project
        next()
    } catch (error) {
        return res.status(500).json({ error: "Hubo un error" })
    }
}