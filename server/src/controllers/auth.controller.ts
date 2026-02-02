import type { Request, Response } from "express"
import colors from 'colors'
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {

    static createAccount = async (req: Request, res: Response) => {
        try {
            const { password, email } = req.body

            const userExist = await User.findOne({ email })

            if (userExist) {
                const error = new Error('El usuario ya esta registrado')
                return res.status(401).json({ error: error.message })
            }

            const user = new User(req.body)

            user.password = await hashPassword(password)

            const token = new Token()
            token.token = generateToken()

            token.user = user._id

            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])

            return res.status(200).json({ message: "Cuenta creada con éxito, revisa tu correo para verificarla" });
        } catch (error) {
            console.log(colors.red.bold("Error al crear cuenta"));
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            const tokenExist = await Token.findOne({ token })

            if (!tokenExist) {
                const error = new Error('Token invalido o expirado')
                return res.status(404).json({ error: error.message })
            }

            const user = await User.findById(tokenExist.user)

            user.confirmed = true

            await Promise.allSettled([user.save(), tokenExist.deleteOne()])


            return res.status(200).json({ message: "Cuenta verificada con éxito" });
        } catch (error) {
            console.log(colors.red.bold("Error al crear cuenta"));
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    static login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body

            const user = await User.findOne({ email })

            if (!user) {
                const error = new Error('Usuario no encontrado')
                return res.status(404).json({ error: error.message })
            }

            if (!user.confirmed) {
                const token = new Token()

                token.user = user._id
                token.token = generateToken()

                await token.save()

                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('La cuenta no ha sido confirmada, hemos reenviado un email de confirmación')
                return res.status(401).json({ error: error.message })
            }

            const isPasswordCorrect = await checkPassword(password, user.password)

            if (!isPasswordCorrect) {
                const error = new Error('Contraseña incorrecta')
                return res.status(404).json({ error: error.message })
            }

            const token = generateJWT({ id: user._id })

            return res.status(200).json({ token });
        } catch (error) {
            console.log(colors.red.bold("Error al iniciar sesión"));
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    static requestConfirmationCode = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            const user = await User.findOne({ email })

            if (!user) {
                const error = new Error('Usuario no encontrado')
                return res.status(404).json({ error: error.message })
            }

            if (user.confirmed) {
                const error = new Error('Usuario ya confirmado')
                return res.status(403).json({ error: error.message })
            }

            const token = new Token()
            token.token = generateToken()

            token.user = user._id

            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await token.save()

            return res.status(200).json({ message: "Token enviado con éxito, revisa tu correo para verificar tu cuenta" });
        } catch (error) {
            console.log(colors.red.bold("Error reenviar token"));
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        try {
            const { email } = req.body

            const user = await User.findOne({ email })

            if (!user) {
                const error = new Error('Usuario no encontrado')
                return res.status(404).json({ error: error.message })
            }

            const token = new Token()
            token.token = generateToken()

            token.user = user._id

            await token.save()

            AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })

            return res.status(200).json({ message: "Revisa tu email para instrucciones" });
        } catch (error) {
            console.log(colors.red.bold("Error enviar token para restablecer contraseña"));
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.body

            const tokenExist = await Token.findOne({ token })

            if (!tokenExist) {
                const error = new Error('Token invalido o expirado')
                return res.status(404).json({ error: error.message })
            }

            return res.status(200).json({ message: "Token validado con éxito, define tu nueva contraseña" });
        } catch (error) {
            console.log(colors.red.bold("Error al validar token para restablecer contraseña"));
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const { token } = req.params
            const { password } = req.body

            const tokenExist = await Token.findOne({ token })

            if (!tokenExist) {
                const error = new Error('Token invalido o expirado')
                return res.status(404).json({ error: error.message })
            }

            const user = await User.findById(tokenExist.user)
            user.password = await hashPassword(password)

            await Promise.allSettled([user.save(), tokenExist.deleteOne()])

            return res.status(200).json({ message: "Contraseña restablecida correctamente" });
        } catch (error) {
            console.log(colors.red.bold("Error al validar token para restablecer contraseña"));
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    static user = async (req: Request, res: Response) => {
        return res.status(200).json({ user: req.user });
    }

    static updateProfile = async (req: Request, res: Response) => {
        try {
            const { name, email } = req.body

            const userExist = await User.findOne({ email })

            if (userExist && userExist._id.toString() !== req.user._id.toString()) {
                const error = new Error('Ese correo ya esta registrado')
                return res.status(409).json({ error: error.message })
            }

            req.user.name = name
            req.user.email = email

            await req.user.save()

            return res.status(200).json({ message: "Usuario actualizado correctamente" });
        } catch (error) {
            console.log(colors.red.bold("Error al actualizar perfil"));
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    static updateCurrentUserPassword = async (req: Request, res: Response) => {
        try {
            const { current_password, password } = req.body
            
            const user = await User.findById(req.user._id)

            const isPasswordCorrect = await checkPassword(current_password, user.password)

            if (!isPasswordCorrect) {
                const error = new Error('Contraseña incorrecta')
                return res.status(401).json({ error: error.message })
            }

            user.password = await hashPassword(password)

            await user.save()

            return res.status(200).json({ message: "Contraseña actualizadaa correctamente" });
        } catch (error) {
            console.log(colors.red.bold("Error al actualizar contraseña"), error);
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }

    static checkPassword = async (req: Request, res: Response) => {
        try {
            const { password } = req.body
            
            const user = await User.findById(req.user._id)

            const isPasswordCorrect = await checkPassword(password, user.password)

            if (!isPasswordCorrect) {
                const error = new Error('Contraseña incorrecta')
                return res.status(401).json({ error: error.message })
            }
    
            return res.status(200).json({ message: "Contraseña Correcta" });
        } catch (error) {
            console.log(colors.red.bold("Error al verificar contraseña"), error);
            return res.status(500).json({
                error: error instanceof Error ? error.message : "Error desconocido"
            });
        }
    }
}