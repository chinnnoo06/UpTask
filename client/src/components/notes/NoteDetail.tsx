import { useAuth } from "@/hooks/useAuth"
import { deleteNote } from "@/services/Note.service"
import type { TNote } from "@/types/index"
import { formateDate } from "@/utils/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { useLocation, useParams } from "react-router-dom"
import { toast } from "react-toastify"

type TNoteDetailProps = {
    note: TNote
}

export const NoteDetail = ({ note }: TNoteDetailProps) => {
    const { data, isLoading } = useAuth()
    const location = useLocation()
    const params = useParams()

    const projectId = params.projectId!

    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get('viewTask')!

    const canDelete = useMemo(() => data?._id === note.createdBy._id, [data])

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: deleteNote,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['task', taskId] })
            toast.success(data)
        }
    })

    if (isLoading) return 'Cargando...'

    return (
        <div className="p-3 flex justify-between items-center">
            <div className="space-y-1 ">
                <p className="text-slate-600">
                    {note.content} por: <span className="font-bold">{note.createdBy.name}</span>
                </p>
                <p className="text-xs text-slate-500">
                    {formateDate(note.createdAt)}
                </p>
            </div>

            {canDelete && (
                <button
                    onClick={() => mutate({
                        projectId,
                        taskId,
                        noteId: note._id
                    })}
                    type="button"
                    className="bg-red-400 hover:bg-red-500 p-2 text-xs text-white font-bold cursor-pointer transition-colors"
                >
                    Eliminar
                </button>
            )}
        </div>
    )
}
