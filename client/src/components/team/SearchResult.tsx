import { addMemberById } from "@/services/Team.service"
import type { TTeamMember } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"

type TSearchResultProps = {
    user: TTeamMember,
    resetData: () => void
}

export const SearchResult = ({ user, resetData }: TSearchResultProps) => {
    const params = useParams()
    const projectId = params.projectId!

    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: addMemberById,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['projectTeam', projectId] })
            toast.success(data)
            resetData()
        }
    })

    const handleAddUserToProject = () => {
        const data = {
            projectId,
            id: user._id
        }
        mutate(data)
    }

    return (
        <>
            <p className="mt-10 text-center font-bold">Resultado:</p>
            <div className="flex justify-between items-center">
                <p>{user.name}</p>
                <button
                onClick={handleAddUserToProject}
                    disabled={isPending}
                    className="text-purple-600 hover:bg-purple-100 px-10 py-3 font-bold cursor-pointer disabled:opacity-65">
                    Agregar al Proyecto
                </button>
            </div>
        </>
    )
}
