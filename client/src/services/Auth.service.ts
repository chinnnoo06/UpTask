import api from "@/lib/axios";
import { isAxiosError } from "axios";
import type { TCheckPasswordForm, TConfirmToken, TForgotPasswordForm, TNewPasswordForm, TRequestConfirmationCodeForm, TUserLoginForm, TUserRegistrationForm } from "../types";
import { UserSchema } from "../schemas";


export const createAccount = async (formData: TUserRegistrationForm) => {
    try {
        const { data } = await api.post('/auth/create-account', formData)
        return data.message
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const confirmAccount = async (formData: TConfirmToken) => {
    try {
        const { data } = await api.post('/auth/confirm-account', formData)
        return data.message
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const requestConfirmationCode = async (formData: TRequestConfirmationCodeForm) => {
    try {
        const { data } = await api.post('/auth/request-code', formData)
        return data.message
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const login = async (formData: TUserLoginForm) => {
    try {
        const { data } = await api.post('/auth/login', formData)

        localStorage.setItem('AUTH_UPTASK', data.token)

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const forgotPassword = async (formData: TForgotPasswordForm) => {
    try {
        const { data } = await api.post('/auth/forgot-password', formData)
        return data.message
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const validateToken = async (formData: TConfirmToken) => {
    try {
        const { data } = await api.post('/auth/validate-token', formData)
        return data.message
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const updatePasswordWithToken = async ({ formData, token }: { formData: TNewPasswordForm, token: TConfirmToken['token'] }) => {
    try {
        const { data } = await api.post(`/auth/update-password/${token}`, formData)
        return data.message
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const getUser = async () => {
    try {
        const { data } = await api.get('/auth/user')

        const response = UserSchema.safeParse(data.user)

        if (!response.success) {
            throw new Error("Datos de usuario inválidos")
        }

        return response.data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const checkPassword = async (formData: TCheckPasswordForm) => {
    try {
        const { data } = await api.post('/auth/profile/check-password', formData)
        
        return data.message
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}