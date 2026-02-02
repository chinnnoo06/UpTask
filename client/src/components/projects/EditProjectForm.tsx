import { Link, useNavigate } from "react-router-dom"
import ProjectForm from "./ProjectForm"
import type { TProject, TProjectForm } from "@/types/index"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProject } from "@/services/Project.service"

type TEditProjectFormProps = {
    data: TProjectForm,
    projectId: TProject['_id']
}

export const EditProjectForm = ({ data, projectId }: TEditProjectFormProps) => {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            projectName: data.projectName,
            clientName: data.clientName,
            description: data.description
        }
    })

    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: updateProject,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] })
            queryClient.invalidateQueries({ queryKey: ['editProject', projectId] })
            toast.success("Proyecto actualizado correctamente")
            navigate('/')
        }
    })

    const handleForm = (formData: TProjectForm) => {
        const data = {
            formData,
            projectId
        }

        mutate(data)
    }

    return (
        <>
            <div className="max-w-3xl mx-auto">
                <h1 className="text-5xl font-black">Editar Proyecto</h1>
                <p className="text-2xl font-light text-gray-500 mt-5">LLena el siguiente formulario para editar el proyecto</p>

                <nav className="my-5">
                    <Link to='/'>
                        <button
                            type="button"
                            className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
                        >
                            Volver a Proyectos
                        </button>
                    </Link>
                </nav>

                <form className="mt-10 bg-white shadow-lg p-10 rounded-lg"
                    onSubmit={handleSubmit(handleForm)} noValidate
                >

                    <ProjectForm register={register} errors={errors} />

                    <input
                        disabled={isPending}
                        type="submit"
                        value="Guardar Cambios"
                        className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-color disabled:opacity-65" />

                </form>
            </div>
        </>
    )
}
