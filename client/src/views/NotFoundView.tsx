import { Link } from "react-router-dom"

export const NotFoundView = () => {
  return (
    <>
      <h1 className="font-black text-center text-4xl text-white">Página No Encontrada</h1>

      <p className="mt-10 text-center text-white font-semibold">
        Tal vez quieras volver a {' '}
        <Link className="text-fuchsia-500 hover:text-fuchsia-600 transition-colors" to={'/'}>Proyectos</Link>
      </p>
    </>
  )
}
