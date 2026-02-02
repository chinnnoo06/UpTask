import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getTaskById, updateTaskStatus } from '@/services/Task.service';
import { formateDate } from '@/utils/utils';
import { statusTranslations } from '@/locales/es';
import { toast } from 'react-toastify';
import type { TTaskStatus } from '@/types/index';
import { NotesPanel } from '../notes/NotesPanel';


export default function TaskModalDetails() {
    const navigate = useNavigate()
    const location = useLocation()
    const params = useParams()

    const projectId = params.projectId!

    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get('viewTask')!
    const show = taskId ? true : false

    const { data, isLoading, isError } = useQuery({
        queryKey: ['task', taskId],
        queryFn: () => getTaskById({ projectId, taskId }),
        retry: false,
        enabled: !!taskId
    })

    const queryClient = useQueryClient()

    const { mutate } = useMutation({
        mutationFn: updateTaskStatus,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['project', projectId] })
            queryClient.invalidateQueries({ queryKey: ['task', taskId] })
            toast.success("Estado actualizado correctamente")
            navigate(location.pathname, { replace: true })
        }
    })

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const status = e.target.value as TTaskStatus

        const data = {
            projectId, taskId, status
        }

        mutate(data)
    }

    if (isLoading) return 'Cargando...'
    if (isError) return <Navigate to='/404' />

    if (data) return (
        <>
            <Transition appear show={show} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, { replace: true })}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-10">
                                    <p className='text-sm text-slate-400'>Agregada el: {formateDate(data.createdAt)} </p>
                                    <p className='text-sm text-slate-400'>Última actualización: {formateDate(data.updatedAt)}</p>
                                    <Dialog.Title
                                        as="h3"
                                        className="font-black text-4xl text-slate-600 my-5"
                                    >{data.name}
                                    </Dialog.Title>
                                    <p className='text-lg text-slate-500 mb-2'>{data.description}</p>

                                    {data.completedBy.length && (
                                        <>
                                            <p className='font-bold text-2xl text-gray-600 my-5'>Historial de Cambios</p>

                                            <ul className='list-decimal pl-4'>
                                                {data.completedBy.map((activityLog) => (
                                                    <li key={activityLog._id}>
                                                        <span className='font-bold text-slate-600'>
                                                            {statusTranslations[activityLog.status]}
                                                        </span>
                                                        {' '}
                                                        por:
                                                        {' '}
                                                        {activityLog.user.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    )}

                                    <div className='my-5 space-y-3'>
                                        <label className='font-bold'>Estado Actual:</label>

                                        <select
                                            onChange={handleStatusChange}
                                            className='mt-3 w-full p-3 bg-white border border-gray-300' defaultValue={data.status}>
                                            {Object.entries(statusTranslations).map(([key, value]) => (
                                                <option key={key} value={key}>{value}</option>
                                            ))}
                                        </select>

                                    </div>

                                    <NotesPanel notes={data.notes}/>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}