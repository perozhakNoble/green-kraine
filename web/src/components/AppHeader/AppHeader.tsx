import { useContext } from 'react'

import {
  faArrowRightFromBracket,
  faArrowRightToBracket,
  faBars,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Link, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import { SidebarContext } from 'src/layouts/AppLayout/AppLayout'

const AppHeader = () => {
  const { setIsOpen: setIsSidebarOpen } = useContext(SidebarContext)

  const { currentUser, logOut } = useAuth()

  return (
    <div className="flex h-12 w-screen justify-between border-b-[1px] border-primary-dark bg-primary-light">
      <button
        className="ml-2 p-3 text-white hover:text-gray-200"
        type="button"
        onClick={() => setIsSidebarOpen(true)}
      >
        <FontAwesomeIcon icon={faBars} className="h-5 w-5 " />
      </button>

      {currentUser ? (
        <button
          className="mr-2 flex items-center p-3 text-white hover:text-gray-200"
          type="button"
          onClick={() => logOut()}
        >
          <span className="mr-2 mt-0.5 block ">Вийти</span>
          <FontAwesomeIcon icon={faArrowRightFromBracket} className="h-5 w-5" />
        </button>
      ) : (
        <Link to={routes.login()}>
          <button
            className="mr-2 flex items-center p-3 text-white hover:text-gray-200"
            type="button"
            onClick={() => null}
          >
            <span className="mr-2 mt-0.5 block ">Увійти</span>
            <FontAwesomeIcon icon={faArrowRightToBracket} className="h-5 w-5" />
          </button>
        </Link>
      )}
    </div>
  )
}

export default AppHeader
