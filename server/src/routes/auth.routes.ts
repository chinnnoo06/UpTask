import express from 'express';
import { body, param } from 'express-validator';
import { handleInputErrors } from '../middleware/validation';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/create-account',
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('password').isLength({ min: 8 }).withMessage('Mínimo 8 caracteres'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Las contraseñas no son iguales')
        }
        return true
    }),
    body('email').isEmail().toLowerCase().withMessage('Email invalido'),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token').notEmpty().withMessage('El token es obligatorio'),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email').isEmail().toLowerCase().withMessage('Email invalido'),
    body('password').notEmpty().withMessage('El password es obligatorio'),
    handleInputErrors,
    AuthController.login
)

router.post('/request-code',
    body('email').isEmail().toLowerCase().withMessage('Email invalido'),
    handleInputErrors,
    AuthController.requestConfirmationCode
)

router.post('/forgot-password',
    body('email').isEmail().toLowerCase().withMessage('Email invalido'),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token').notEmpty().withMessage('El token es obligatorio'),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/update-password/:token',
    param('token').isNumeric().withMessage('Token invalido'),
    body('password').isLength({ min: 8 }).withMessage('Mínimo 8 caracteres'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Las contraseñas no son iguales')
        }
        return true
    }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
)

router.get('/user',
    authenticate,
    AuthController.user
)

/* Profile */
router.put('/profile',
    authenticate,
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().toLowerCase().withMessage('Email invalido'),
    handleInputErrors,
    AuthController.updateProfile
)

router.post('/update-password',
    authenticate,
    body('current_password').isLength({ min: 8 }).withMessage('La contraseña actual no puede ir vacio'),
    body('password').isLength({ min: 8 }).withMessage('Mínimo 8 caracteres'),
    body('password_confirmation').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Las contraseñas no son iguales')
        }
        return true
    }),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
)

router.post('/check-password',
    authenticate,
    body('password').notEmpty().withMessage('La contraseña no puede ir vacia'),
    handleInputErrors,
    AuthController.checkPassword
)


export default router;