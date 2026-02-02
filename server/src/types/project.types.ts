import { Document, PopulatedDoc } from "mongoose"
import { TTask } from "./task.types"
import { TUser } from "./user.types"

export type TProject = Document & {
    projectName: string
    clientName: string
    description: string
    tasks: PopulatedDoc<TTask & Document>[]
    manager: PopulatedDoc<TUser & Document>
    team: PopulatedDoc<TUser & Document>[]
}