import { getTaskById } from "@/services/Task.service"
import { useQuery } from "@tanstack/react-query"
import { Navigate, useLocation, useParams } from "react-router-dom"
import EditTaskModal from "./EditTaskModal"

export const EditTaskData = () => {
    const params = useParams()
    const projectId = params.projectId!
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get('editTask')!

    const { data, isLoading, isError } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById({ projectId, taskId }),
        retry: false,
        enabled: !!taskId
    })

    if (isLoading) return 'Cargando...'
    if (isError) return <Navigate to='/404' />
    if (data) return <EditTaskModal data={data} projectId={projectId} taskId={taskId} />
}
