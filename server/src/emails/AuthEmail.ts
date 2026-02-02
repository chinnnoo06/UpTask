import { transporter } from "../config/nodemailer"
import { TUser } from "../types/user.types"

type TEmail = {
    email: TUser['email'],
    name: TUser['name'],
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: TEmail) => {
        await transporter.sendMail({
            from: 'UpTask <adming@uptask.com>',
            to: user.email,
            subject: 'UpTask - Confirma tu cuenta',
            text: 'Uptask - Confirma tu cuenta',
            html: `<p>Hola: ${user.name}, has creado tu cuenta en UpTask, ya casi esta todo listo,
            solo debes confirmar tu cuenta</p>
            
            <p>Visita el siguiente enlace: </p>
            <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
            <p>E Ingresa el código: <b>${user.token}</b></p>
            <p>Este token expira en 10 minutos</p>
            `
        })
    }

    static sendPasswordResetToken = async (user: TEmail) => {
        await transporter.sendMail({
            from: 'UpTask <adming@uptask.com>',
            to: user.email,
            subject: 'UpTask - Restablece tu contraseña',
            text: 'Uptask - Restablece tu contraseña',
            html: `<p>Hola: ${user.name}, has solicitado restablecer tu contraseña.</p>
            
            <p>Visita el siguiente enlace: </p>
            <a href="${process.env.FRONTEND_URL}/auth/new-password">Restablecer Contraseña</a>
            <p>E Ingresa el código: <b>${user.token}</b></p>
            <p>Este token expira en 10 minutos</p>
            `
        })
    }
}