import type { AuthSchema, DashborardProjectSchema, NoteSchema, ProjectSchema, TaskProjectSchema, TaskSchema, TaskStatusSchema, TeamMemberSchema, UserSchema } from "schemas";
import type z from "zod";

/* Auth & Users */
export type TAuth = z.infer<typeof AuthSchema>

export type TUserLoginForm = Pick<TAuth, 'email' | 'password'>
export type TUserRegistrationForm = Pick<TAuth, 'name' | 'email' | 'password' | 'password_confirmation'>
export type TRequestConfirmationCodeForm = Pick<TAuth, 'email'>
export type TForgotPasswordForm = Pick<TAuth, 'email'>
export type TNewPasswordForm = Pick<TAuth, 'password' | 'password_confirmation'>
export type TUpdateCurrentPasswordForm = Pick<TAuth, 'current_password' | 'password' | 'password_confirmation'>
export type TCheckPasswordForm = Pick<TAuth, 'password'>
export type TConfirmToken = Pick<TAuth, 'token'>

/* Notes */
export type TNote = z.infer<typeof NoteSchema>
export type TNoteFormData = Pick<TNote, 'content'>

/* Task */
export type TTask = z.infer<typeof TaskSchema>
export type TTaskProject = z.infer<typeof TaskProjectSchema>

export type TTaskForm = Pick<TTask, 'name' | 'description'>

export type TTaskStatus = z.infer<typeof TaskStatusSchema>

/* Project */
export type TProject = z.infer<typeof ProjectSchema>

export type TProjectForm = Pick<TProject, 'projectName' | 'clientName' | 'description'>

export type TDashborardProject = z.infer<typeof DashborardProjectSchema>

/* Users */
export type TUser = z.infer<typeof UserSchema>
export type TUserProfileForm = Pick<TUser, 'name' | 'email'>

/* Team */
export type TTeamMember = z.infer<typeof TeamMemberSchema>

export type TTeamMemberForm = Pick<TTeamMember, 'email'>