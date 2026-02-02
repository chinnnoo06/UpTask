import type { Request, Response } from "express"
import colors from 'colors'
import { TNote } from "../types/note.types";
import Note from "../models/Note";
import { Types } from "mongoose";

type TNoteParams = {
    noteId: Types.ObjectId
}

export class NoteController {

    static createNote = async (req: Request<{}, {}, TNote>, res: Response) => {
        try {
            const { content } = req.body

            const note = new Note()

            note.content = content,
                note.createdBy = req.user._id
            note.task = req.task._id

            req.task.notes.push(note._id)

            await Promise.allSettled([req.task.save(), note.save()])

            return res.status(200).json({ message: "Nota agregada con éxito" });
        } catch (error) {
            console.log(colors.red.bold("Error al crear nota"));
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    static getTaskNotes = async (req: Request, res: Response) => {
        try {
            const notes = await Note.find({ task: req.task._id })

            return res.status(200).json({
                notes
            });
        } catch (error) {
            console.log(colors.red.bold("Error al crear nota"));
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    static deleteNote = async (req: Request<TNoteParams>, res: Response) => {
        try {
            const { noteId } = req.params

            const note = await Note.findById(noteId)

            if (!note) {
                const error = new Error('Nota no encontrada')
                return res.status(404).json({ error: error.message })
            }

            if (note.createdBy.toString() !== req.user._id.toString()) {
                const error = new Error('Acción no valida')
                return res.status(404).json({ error: error.message })
            }

            req.task.notes = req.task.notes.filter( note => note.toString() !== noteId.toString())

            await Promise.allSettled([req.task.save(), note.deleteOne()])

            return res.status(200).json({ message: "Nota eliminada con éxito" });
        } catch (error) {
            console.log(colors.red.bold("Error al crear nota"));
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }
}