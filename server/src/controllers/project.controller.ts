import type { Request, Response } from "express"
import colors from 'colors'
import Project from "../models/Project"

export class ProjectController {

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [
                    { manager: { $in: req.user._id } },
                    { team: { $in: [req.user._id] } }
                ]
            })

            return res.status(200).json({
                projects
            });
        } catch (error) {
            console.log(colors.red.bold("Error al obtener proyectos"));
            return res.status(500).json({
                status: "error",
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    static createProject = async (req: Request, res: Response) => {
        try {
            const project = new Project(req.body)

            project.manager = req.user._id

            await project.save()

            return res.status(200).json({
                project
            });
        } catch (error) {
            console.log(colors.red.bold("Error al crear proyecto"));
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params
        try {
            const project = await Project.findById(id).populate('tasks')

            if (!project) {
                const error = new Error('Proyecto no encontrado')
                return res.status(404).json({ error: error.message })
            }

            if (project.manager.toString() !== req.user._id.toString() && !project.team.includes(req.user._id)) {
                const error = new Error('Acción no valida')
                return res.status(404).json({ error: error.message })
            }

            return res.status(200).json({
                project
            });
        } catch (error) {
            console.log(colors.red.bold("Error al obtener proyecto"));
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    static updateProject = async (req: Request, res: Response) => {

        try {
            req.project.projectName = req.body.projectName
            req.project.clientName = req.body.clientName
            req.project.description = req.body.description

            await req.project.save()

            return res.status(200).json({ message: "Proyecto actualizado con exito" });
        } catch (error) {
            console.log(colors.red.bold("Error al actualizar proyecto"));
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        try {
            await req.project.deleteOne()

            return res.status(200).json({ message: "Proyecto eliminado con exito" });
        } catch (error) {
            console.log(colors.red.bold("Error al eliminar proyecto"));
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }
}