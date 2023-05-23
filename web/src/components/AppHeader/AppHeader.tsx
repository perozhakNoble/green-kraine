import { useContext } from 'react'

import {
  faArrowRightFromBracket,
  faArrowRightToBracket,
  faBars,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'

import { Link, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'
import { useLanguageLocaleStorage } from 'src/hooks/useLanguageLocaleStorage'
import { TranslationKeys } from 'src/i18n'
import { SidebarContext } from 'src/layouts/AppLayout/AppLayout'

const AppHeader = () => {
  const { t } = useTranslation()
  const { setIsOpen: setIsSidebarOpen } = useContext(SidebarContext)

  const { currentUser, logOut } = useAuth()

  const { Select } = useLanguageLocaleStorage()

  return (
    <div className="flex h-12 w-screen justify-between border-b-[1px] border-primary-dark bg-primary-light">
      <button
        className="ml-2 p-3 text-white hover:text-gray-200"
        type="button"
        onClick={() => setIsSidebarOpen(true)}
      >
        <FontAwesomeIcon icon={faBars} className="h-5 w-5 " />
      </button>
      {currentUser && (
        <div className="flex items-center text-gray-50">
          {t(TranslationKeys.welcome) + ', ' + currentUser.name + '!'}
        </div>
      )}
      <div className="flex items-center gap-4">
        <Select />

        {currentUser ? (
          <button
            className="mr-2 flex items-center p-3 text-white hover:text-gray-200"
            type="button"
            onClick={() => logOut()}
          >
            <span className="mr-2 mt-0.5 block ">
              {t(TranslationKeys.logout)}
            </span>
            <FontAwesomeIcon
              icon={faArrowRightFromBracket}
              className="h-5 w-5"
            />
          </button>
        ) : (
          <Link to={routes.login()}>
            <button
              className="mr-2 flex items-center p-3 text-white hover:text-gray-200"
              type="button"
              onClick={() => null}
            >
              <span className="mr-2 mt-0.5 block ">
                {t(TranslationKeys.login)}
              </span>
              <FontAwesomeIcon
                icon={faArrowRightToBracket}
                className="h-5 w-5"
              />
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default AppHeader
