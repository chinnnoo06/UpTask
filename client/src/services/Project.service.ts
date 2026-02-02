import api from "@/lib/axios";
import type { TProject, TProjectForm } from "../types";
import { isAxiosError } from "axios";
import { DashborardProjectSchema, EditProjectSchema, ProjectSchema } from "../schemas";

export const createProject = async (formData: TProjectForm) => {
    try {
        await api.post('/projects/create', formData)
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const getProjects = async () => {
    try {
        const { data } = await api('/projects/get')

        const response = DashborardProjectSchema.safeParse(data.projects)

        if (!response.success) {
            throw new Error("Datos de proyectos inválidos")
        }

        return response.data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const getProjectById = async (projectId: TProject['_id']) => {
    try {
        const { data } = await api(`/projects/get/${projectId}`)

        const response = EditProjectSchema.safeParse(data.project)

        if (!response.success) {
            throw new Error("Datos de proyecto inválidos")
        }

        return response.data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const getFullProjectById = async (projectId: TProject['_id']) => {
    try {
        const { data } = await api(`/projects/get/${projectId}`)

        const response = ProjectSchema.safeParse(data.project)

        if (!response.success) {
            throw new Error("Datos de proyecto inválidos")
        }

        return response.data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

type TProjectAPI = {
    formData: TProjectForm,
    projectId: TProject['_id']
}

export const updateProject = async ({ formData, projectId }: TProjectAPI) => {
    try {
        await api.put(`/projects/update/${projectId}`, formData)
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const deleteProject = async (projectId: TProject['_id']) => {
    try {
        await api.delete(`/projects/delete/${projectId}`)
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}