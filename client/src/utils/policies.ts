import type { TProject, TTeamMember } from "../types";

export const isManager = (managerId: TProject['manager'], userId: TTeamMember['_id']) => managerId === userId