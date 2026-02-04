import api from "@/lib/axios";
import { isAxiosError } from "axios";
import type { TProject, TTask, TTaskForm } from "../types";
import { TaskSchema } from "../schemas";

type TTaskAPI = {
    formData: TTaskForm,
    projectId: TProject['_id'],
    taskId: TTask['_id'],
    status: TTask['status']
}

export const createTask = async ({ formData, projectId } : Pick<TTaskAPI, 'formData' | 'projectId'>) => {
    try {
        await api.post(`/projects/${projectId}/tasks`, formData)
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const getTaskById = async ({projectId, taskId} : Pick<TTaskAPI, 'projectId' | 'taskId'>) => {
    try {
        const { data } = await api(`/projects/${projectId}/tasks/${taskId}`)

        const response = TaskSchema.safeParse(data.task)

        if (!response.success) {
            throw new Error("Datos de tarea inválidos")
        }

        return response.data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const updateTask = async ({projectId, taskId, formData} : Pick<TTaskAPI, 'projectId' | 'taskId' | 'formData'>) => {
    try {
        await api.put(`/projects/${projectId}/tasks/${taskId}`, formData)
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const deleteTask = async ({projectId, taskId} : Pick<TTaskAPI, 'projectId' | 'taskId'>) => {
    try {
        await api.delete(`/projects/${projectId}/tasks/${taskId}`)
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const updateTaskStatus = async ({projectId, taskId, status} : Pick<TTaskAPI, 'projectId' | 'taskId' | 'status'>) => {
    try {
        await api.post(`/projects/${projectId}/tasks/${taskId}/status`, {status})
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}