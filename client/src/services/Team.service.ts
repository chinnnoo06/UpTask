import api from "@/lib/axios";
import { isAxiosError } from "axios";
import type { TProject, TTeamMember, TTeamMemberForm } from "../types";
import { TeamMembersSchema } from "../schemas";

export const findUserByEmail = async ({ projectId, formData }: { projectId: TProject['_id'], formData: TTeamMemberForm }) => {
    try {
        const { data } = await api.post(`/projects/${projectId}/team/find`, formData)
        return data.user
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const addMemberById = async ({ projectId, id }: { projectId: TProject['_id'], id: TTeamMember['_id'] }) => {
    try {
        const { data } = await api.post(`/projects/${projectId}/team/add`, { id })
        return data.message
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const getProjectTeam = async (projectId: TProject['_id']) => {
    try {
        const { data } = await api.get(`/projects/${projectId}/team/get`)

        const response = TeamMembersSchema.safeParse(data.project)

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

export const removeMemberById = async ({ projectId, id }: { projectId: TProject['_id'], id: TTeamMember['_id'] }) => {
    try {
        const { data } = await api.delete(`/projects/${projectId}/team/remove/${id}`)
        return data.message
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}