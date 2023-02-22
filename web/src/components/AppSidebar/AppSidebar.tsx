import { faSun } from '@fortawesome/free-regular-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { H4 } from '@ui/Typography'

import { NavLink, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'

type AppSidebarProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AppSidebar = ({ isOpen, setIsOpen }: AppSidebarProps) => {
  const { currentUser } = useAuth()

  const links = [
    {
      label: 'Всі мітки',
      isAvailable: true,
      to: routes.home(),
    },
    {
      label: 'Мої мітки',
      isAvailable: !!currentUser,
      to: routes.userReports(),
    },
    {
      label: 'Нова еко-проблема',
      isAvailable: !!currentUser,
      to: routes.informNewProblem(),
    },
  ]

  return (
    <>
      <div
        className={`absolute top-0 z-10 h-full w-64 border-r-[1px] border-primary-dark bg-gradient-to-tr from-primary-light to-teal-500  transition-all
        ${isOpen ? 'left-0' : '-left-64 opacity-0'}
      `}
      >
        <div className="relative p-4">
          <div className="flex">
            <H4 className="w-32 text-gray-100">Green Kraine</H4>{' '}
            <FontAwesomeIcon
              icon={faSun}
              className="mt-4 block h-8 w-8 text-gray-100"
            />
          </div>
          <div className="w-fulls mt-16 text-sm">
            <nav>
              <ul>
                {links.map((route, idx) => (
                  <li key={idx}>
                    <NavLink
                      className={`${
                        route.isAvailable ? 'block' : 'hidden'
                      } w-52 p-4 text-gray-200`}
                      activeClassName="text-white  bg-primary rounded-xl"
                      to={route.to}
                      onClick={() => setIsOpen(false)}
                    >
                      {route.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <button
            className="absolute top-2 right-2 h-8 w-8 rounded-xl bg-primary p-1.5"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="h-5 w-5 cursor-pointer text-gray-100"
            />
          </button>
        </div>
      </div>
    </>
  )
}

export default AppSidebar
