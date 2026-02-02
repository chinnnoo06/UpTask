import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { Bars3Icon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'
import type { TUser } from '../types'
import { useQueryClient } from '@tanstack/react-query'

type TNavMenuProps = {
  name: TUser['name']
}

export default function NavMenu({ name }: TNavMenuProps) {

  const queryClient = useQueryClient()

  const logout = () => {
    localStorage.removeItem('AUTH_UPTASK')
    queryClient.invalidateQueries({ queryKey: ['user'] })
  }

  return (
    <Popover className="relative">
      <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 p-1 rounded-lg bg-purple-400">
        <Bars3Icon className='w-7 h-7 text-white ' />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen sm:max-w-min -translate-x-1/2 sm:-translate-x-48">
          <div className="w-full sm:w-56 shrink rounded-xl bg-white p-4 text-sm font-semibold leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5">
            <p className='text-center'>Hola: {name}</p>
            <Link
              to='/profile'
              className='block p-2 hover:text-purple-950'
            >Mi Perfil</Link>
            <Link
              to='/'
              className='block p-2 hover:text-purple-950'
            >Mis Proyectos</Link>
            <button
              className='block p-2 hover:text-purple-950'
              type='button'
              onClick={logout}
            >
              Cerrar Sesión
            </button>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}