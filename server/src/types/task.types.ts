import { Document, Types } from "mongoose"

export const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed'
} as const

export type TTaskStatus = typeof taskStatus[keyof typeof taskStatus]

export type TTask = Document & {
    name: string
    description: string,
    project: Types.ObjectId,
    status: TTaskStatus,
    completedBy: {
        user: Types.ObjectId,
        status: TTaskStatus,
    }[],
    notes: Types.ObjectId[]
}

