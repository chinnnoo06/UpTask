import api from "@/lib/axios";
import { isAxiosError } from "axios";
import type { TUpdateCurrentPasswordForm, TUserProfileForm } from "../types";

export const updateProfile = async (formData: TUserProfileForm) => {
    try {
        const { data } = await api.put('/auth/profile', formData)
        return data.message
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const updateCurrentPassword = async (formData: TUpdateCurrentPasswordForm) => {
    try {
        const { data } = await api.post('/auth/update-password', formData)
        return data.message
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}