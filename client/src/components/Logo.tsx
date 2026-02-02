import { Link } from "react-router-dom"

type TLogoProps = {
  login?: boolean
}

export const Logo = ({login = false} : TLogoProps) => {
  return (
    <div className="logo transition-transform duration-300 hover:scale-105 flex justify-center items-center">
      <Link to="/" className="no-underline">
        <img
          src="/logo.png"
          alt="Logo"
          className={`${login ? 'h-22' : 'h-11'} object-contain`}
        />
      </Link>
    </div>

  )
}
