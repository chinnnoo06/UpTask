import api from "@/lib/axios";
import { isAxiosError } from "axios";
import type { TNote, TNoteFormData, TProject, TTask } from "../types";

type TNoteAPI = {
    formData: TNoteFormData,
    projectId: TProject['_id'],
    taskId: TTask['_id'],
    noteId: TNote['_id']
}

export const createNote = async ({ formData, projectId, taskId }: Pick<TNoteAPI, 'formData' | 'projectId' | 'taskId'>) => {
    try {
        const { data } = await api.post(`/projects/${projectId}/tasks/${taskId}/notes/add`, formData)
        return data.message
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const deleteNote = async ({ projectId, taskId, noteId}: Pick<TNoteAPI, 'projectId' | 'taskId' | 'noteId'>) => {
    try {
        const { data } = await api.delete(`/projects/${projectId}/tasks/${taskId}/notes/delete/${noteId}`)
        return data.message
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
