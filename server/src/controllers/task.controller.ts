import type { Request, Response } from "express"
import colors from 'colors'
import Task from "../models/Task"

export class TaskController {

    static createTask = async (req: Request, res: Response) => {
        try {
            const task = new Task(req.body)
            task.project = req.project._id

            req.project.tasks.push(task._id)

            await Promise.allSettled([task.save(), req.project.save()])

            return res.status(200).json({ message: "Tarea agregada con éxito" });
        } catch (error) {
            console.log(colors.red.bold("Error al crear tarea"));
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    static getTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({ project: req.project._id }).populate('project')

            return res.status(200).json({
                tasks
            });
        } catch (error) {
            console.log(colors.red.bold("Error al obtener tareas"));
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        try {
            const task = await Task.findById(req.task._id).populate({
                path: 'completedBy.user',
                select: '_id name email'
            }).populate({
                path: 'notes',
                populate: { path: 'createdBy', select: '_id name email'}
            })

            return res.status(200).json({
                task
            });
        } catch (error) {
            console.log(colors.red.bold("Error al obtener tarea"));
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    static updateTask = async (req: Request, res: Response) => {
        try {
            req.task.name = req.body.name
            req.task.description = req.body.description

            await req.task.save()

            return res.status(200).json({ message: "Tarea actualizada con éxito" });
        } catch (error) {
            console.log(colors.red.bold("Error al actualizar tarea"));
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {
            req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task._id.toString())

            await Promise.allSettled([req.task.deleteOne(), req.project.save()])

            return res.status(200).json({ message: "Tarea eliminada con éxito" });
        } catch (error) {
            console.log(colors.red.bold("Error al obtener tareas"));
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }


    static updateTaskStatus = async (req: Request, res: Response) => {
        const { status } = req.body

        try {
            req.task.status = status

            const data = {
                user: req.user._id,
                status
            }

            req.task.completedBy.push(data)

            await req.task.save()

            return res.status(200).json({ message: "Tarea actualizada con éxito" });
        } catch (error) {
            console.log(colors.red.bold("Error al actualizar estado"));
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }
}