import type { Request, Response } from "express"
import colors from 'colors'
import User from "../models/User"
import Project from "../models/Project"

export class TeamController {

    static getMembers = async (req: Request, res: Response) => {
        try {
            const project = await Project.findById(req.project._id).populate({
                path: 'team',
                select: 'id email name'
            })

            return res.status(200).json({
                project: project.team
            });
        } catch (error) {
            console.log(colors.red.bold("Error al obtener miembro del proyecto"));
            return res.status(500).json({
                status: "error",
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    static findMemberByEmail = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            const user = await User.findOne({ email }).select('_id email name')

            if (!user || user.email === req.user.email) {
                const error = new Error('Usuario no encontrado')
                return res.status(404).json({ error: error.message })
            }

            return res.status(200).json({
                user
            });
        } catch (error) {
            console.log(colors.red.bold("Error al obtener miembro del proyecto"));
            return res.status(500).json({
                status: "error",
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    static addMemberById = async (req: Request, res: Response) => {
        try {
            const { id } = req.body

            const user = await User.findById(id)

            if (!user) {
                const error = new Error('Usuario no encontrado')
                return res.status(404).json({ error: error.message })
            }

            if (req.project.team.some(team => team._id.toString() === user._id.toString())) {
                const error = new Error('Usuario ya esta en el equipo')
                return res.status(404).json({ error: error.message })
            }

            req.project.team.push(user._id)

            await req.project.save()

            return res.status(200).json({ message: "Usuario agregado al equipo con exito" });
        } catch (error) {
            console.log(colors.red.bold("Error al obtener miembro del proyecto"));
            return res.status(500).json({
                status: "error",
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    static removeMemberById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params

            if (!req.project.team.some(team => team._id.toString() === id)) {
                const error = new Error('Usuario no existe en el equipo')
                return res.status(404).json({ error: error.message })
            }

            req.project.team = req.project.team.filter(team => team._id.toString() !== id)

            await req.project.save()

            return res.status(200).json({ message: "Usuario eliminado del equipo con exito" });
        } catch (error) {
            console.log(colors.red.bold("Error al obtener miembro del proyecto"));
            return res.status(500).json({
                status: "error",
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }


}