import z from "zod";

/*Auth & Users */
export const AuthSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    current_password: z.string(),
    password: z.string(),
    password_confirmation: z.string(),
    token: z.string()
})

/* Users */
export const UserSchema = AuthSchema.pick({
    name: true,
    email: true
}).extend({
    _id: z.string()
})

/* Notes */
export const NoteSchema = z.object({
    _id: z.string(),
    content: z.string(),
    createdBy: UserSchema,
    task: z.string(),
    createdAt: z.string(),
})

/* Task */
export const TaskStatusSchema = z.enum(["pending", "onHold", "inProgress", "underReview", "completed"])

export const TaskSchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    project: z.string(),
    status: TaskStatusSchema,
    completedBy: z.array(z.object({
        _id: z.string(),
        user: UserSchema,
        status: TaskStatusSchema
    })),
    notes: z.array(NoteSchema),
    createdAt: z.string(),
    updatedAt: z.string()
})

export const TaskProjectSchema = TaskSchema.pick({
    _id: true,
    name: true,
    description: true,
    status: true
})

/* Team */
export const TeamMemberSchema = UserSchema.pick({
    name: true,
    email: true,
    _id: true
})

/* Project */
export const ProjectSchema = z.object({
    _id: z.string(),
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
    tasks: z.array(TaskProjectSchema),
    team: z.array(z.string()),
    manager: z.string()
})

export const DashborardProjectSchema = z.array(
    ProjectSchema.pick({
        _id: true,
        projectName: true,
        clientName: true,
        description: true,
        manager: true
    })
)

export const EditProjectSchema = ProjectSchema.pick({
    projectName: true,
    clientName: true,
    description: true
})



export const TeamMembersSchema = z.array(TeamMemberSchema)

