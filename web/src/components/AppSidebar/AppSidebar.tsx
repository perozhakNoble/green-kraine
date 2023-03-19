import { faSun } from '@fortawesome/free-regular-svg-icons'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  ChartBarIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  FlagIcon,
  MapPinIcon,
  RectangleGroupIcon,
  TagIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/24/outline'
import { H4 } from '@ui/Typography'
import { useTranslation } from 'react-i18next'

import { NavLink, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import { UserRole } from 'src/constants'
import { TranslationKeys } from 'src/i18n'

type AppSidebarProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AppSidebar = ({ isOpen, setIsOpen }: AppSidebarProps) => {
  const { currentUser } = useAuth()

  const isAnalyst = currentUser && currentUser.roles === UserRole.ANALYST
  const isAdmin = currentUser && currentUser.roles === UserRole.ADMIN

  const { t } = useTranslation()

  const links = [
    {
      label: t(TranslationKeys.all_markers),
      isAvailable: true,
      to: routes.home(),
      icon: MapPinIcon,
    },
    {
      label: t(TranslationKeys.profile),
      isAvailable: !!currentUser,
      to: routes.profile(),
      icon: UserIcon,
    },
    {
      label: t(TranslationKeys.my_markers),
      isAvailable: !!currentUser,
      to: routes.userReports(),
      icon: FlagIcon,
    },
    {
      label: t(TranslationKeys.new_eco_problem),
      isAvailable: !!currentUser,
      to: routes.informNewProblem(),
      icon: ExclamationTriangleIcon,
    },
    {
      label: t(TranslationKeys.statistics),
      isAvailable: isAdmin || isAnalyst,
      to: routes.stats(),
      icon: ChartBarIcon,
    },
    {
      label: t(TranslationKeys.categories),
      isAvailable: isAdmin,
      to: routes.categories(),
      icon: RectangleGroupIcon,
    },
    {
      label: t(TranslationKeys.key_words),
      isAvailable: isAdmin,
      to: routes.keywords(),
      icon: TagIcon,
    },
    {
      label: t(TranslationKeys.users),
      isAvailable: isAdmin,
      to: routes.users(),
      icon: UsersIcon,
    },
    {
      label: t(TranslationKeys.eco_problems),
      isAvailable: isAdmin,
      to: routes.problems(),
      icon: ExclamationCircleIcon,
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
          <div className="mt-16 w-full text-sm">
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
                      <div className="flex">
                        <route.icon className="mr-2 !w-6" />
                        <div className="w-36">{route.label}</div>
                      </div>
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
