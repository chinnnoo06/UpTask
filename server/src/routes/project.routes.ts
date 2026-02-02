import express from 'express';
import { ProjectController } from '../controllers/project.controller';
import { body, param } from 'express-validator';
import { handleInputErrors } from '../middleware/validation';
import { projectExist } from '../middleware/project';
import { TaskController } from '../controllers/task.controller';
import { hasAuthorization, taskBelongToProject, taskExist } from '../middleware/task';
import { authenticate } from '../middleware/auth';
import { TeamController } from '../controllers/team.controller';
import { NoteController } from '../controllers/note.controller';

const router = express.Router();

router.use(authenticate)

router.get("/get", ProjectController.getAllProjects);

router.get("/get/:id",
    param('id').isMongoId().withMessage('Id no valido'),
    handleInputErrors,
    ProjectController.getProjectById
);

router.post("/create",
    body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripción del proyecto es obligatoria'),
    handleInputErrors,
    ProjectController.createProject
);


router.param('projectId', projectExist)

router.put("/update/:projectId",
    hasAuthorization,
    param('projectId').isMongoId().withMessage('Id no valido'),
    body('projectName').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
    body('clientName').notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description').notEmpty().withMessage('La descripción del proyecto es obligatoria'),
    handleInputErrors,
    ProjectController.updateProject
);

router.delete("/delete/:projectId",
    hasAuthorization,
    param('projectId').isMongoId().withMessage('Id no valido'),
    handleInputErrors,
    ProjectController.deleteProject
);


/** Routes for tasks */
router.param('taskId', taskExist)
router.param('taskId', taskBelongToProject)

router.post('/:projectId/tasks/add',
    hasAuthorization,
    param('projectId').isMongoId().withMessage('Id del proyecto no valido'),
    body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks/get',
    param('projectId').isMongoId().withMessage('Id del proyecto no valido'),
    TaskController.getTasks
)

router.get('/:projectId/tasks/get/:taskId',
    param('projectId').isMongoId().withMessage('Id del proyecto no valido'),
    param('taskId').isMongoId().withMessage('Id de la tarea no valido'),
    handleInputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/update/:taskId',
    hasAuthorization,
    param('projectId').isMongoId().withMessage('Id del proyecto no valido'),
    param('taskId').isMongoId().withMessage('Id de la tarea no valido'),
    body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description').notEmpty().withMessage('La descripción de la tarea es obligatoria'),
    handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/delete/:taskId',
    hasAuthorization,
    param('projectId').isMongoId().withMessage('Id del proyecto no valido'),
    param('taskId').isMongoId().withMessage('Id de la tarea no valido'),
    handleInputErrors,
    TaskController.deleteTask
)


router.post('/:projectId/tasks/status/:taskId',
    param('projectId').isMongoId().withMessage('Id del proyecto no valido'),
    param('taskId').isMongoId().withMessage('Id de la tarea no valido'),
    body('status').notEmpty().withMessage('El estado es obligatorio'),
    handleInputErrors,
    TaskController.updateTaskStatus
)

/* Routes for teams */
router.get('/:projectId/team/get',
    param('projectId').isMongoId().withMessage('Id del proyecto no valido'),
    TeamController.getMembers
)

router.post('/:projectId/team/find',
    param('projectId').isMongoId().withMessage('Id del proyecto no valido'),
    body('email').isEmail().toLowerCase().withMessage('Email invalido'),
    handleInputErrors,
    TeamController.findMemberByEmail
)

router.post('/:projectId/team/add',
    param('projectId').isMongoId().withMessage('Id del proyecto no valido'),
    body('id').isMongoId().withMessage('Id no valido'),
    handleInputErrors,
    TeamController.addMemberById
)

router.delete('/:projectId/team/remove/:id',
    param('projectId').isMongoId().withMessage('Id del proyecto no valido'),
    param('id').isMongoId().withMessage('Id no valido'),
    handleInputErrors,
    TeamController.removeMemberById
)

/*Routes for notes*/
router.post('/:projectId/tasks/:taskId/notes/add',
    param('projectId').isMongoId().withMessage('Id del proyecto no valido'),
    param('taskId').isMongoId().withMessage('Id de la tarea no valido'),
    body('content').notEmpty().withMessage('Contenido obligatorio'),
    handleInputErrors,
    NoteController.createNote
)

router.get('/:projectId/tasks/:taskId/notes/get',
    param('projectId').isMongoId().withMessage('Id del proyecto no valido'),
    param('taskId').isMongoId().withMessage('Id de la tarea no valido'),
    NoteController.getTaskNotes
)

router.delete('/:projectId/tasks/:taskId/notes/delete/:noteId',
    param('projectId').isMongoId().withMessage('Id del proyecto no valido'),
    param('taskId').isMongoId().withMessage('Id de la tarea no valido'),
    param('noteId').isMongoId().withMessage('Id de la nota no valido'),
    NoteController.deleteNote
)
export default router;