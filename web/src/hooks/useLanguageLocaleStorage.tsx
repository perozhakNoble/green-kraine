import CustomPopover from '@ui/Modals/Popover/Popover'
import { useTranslation } from 'react-i18next'

import { useLocalStorage } from 'src/hooks/useLocalStorage'

export const getLanguageLocaleFromLocalStorage = () => {
  return JSON.parse(window.localStorage.getItem('language') || null)
}

export enum Language {
  UA = 'ua',
  EN = 'en',
}

export const useLanguageLocaleStorage = () => {
  const [language, setLanguage] = useLocalStorage<Language>(
    'language',
    Language.EN
  )

  const { i18n } = useTranslation()

  const handleChange = (lang: Language, close) => {
    setLanguage(lang)
    i18n.changeLanguage(lang)
    close()
  }

  return {
    language,
    Select: () => (
      <>
        <div className="flex items-center justify-center">
          <CustomPopover
            withoutPadding
            buttonClassName="outline-none ring-1 ring-gray-50 ring-offset-primary focus:ring-blue-300 focus:ring-offset-2 rounded-full"
            title={
              <div className="flex items-center rounded-full p-[1px]">
                <img
                  className="h-7 w-7 rounded-full object-cover"
                  src={
                    language === Language.UA
                      ? 'https://www.countryflags.com/wp-content/uploads/ukraine-flag-png-large.png'
                      : 'https://www.pngmart.com/files/17/USA-Flag-Transparent-PNG.png'
                  }
                  alt="flag"
                />
              </div>
            }
          >
            {({ close }) => (
              <div className="flex flex-col divide-y">
                <div
                  onClick={() => handleChange(Language.EN, close)}
                  className={`flex cursor-pointer items-center justify-start p-2 ${
                    language === Language.EN && 'bg-blue-100'
                  }`}
                >
                  <div className="rounded-full border border-gray-50 p-[1px]">
                    <img
                      className="h-5 w-5 rounded-full object-cover"
                      src={
                        'https://www.pngmart.com/files/17/USA-Flag-Transparent-PNG.png'
                      }
                      alt="flag"
                    />
                  </div>
                  <span className="ml-3 text-xs font-light">English</span>
                </div>
                <div
                  onClick={() => handleChange(Language.UA, close)}
                  className={`flex cursor-pointer items-center justify-center p-2 ${
                    language === Language.UA && 'bg-blue-100'
                  }`}
                >
                  <div className="rounded-full border border-gray-50 p-[1px]">
                    <img
                      className="h-5 w-5 rounded-full object-cover"
                      src={
                        'https://www.countryflags.com/wp-content/uploads/ukraine-flag-png-large.png'
                      }
                      alt="flag"
                    />
                  </div>
                  <span className="ml-3 text-xs font-light">Українська</span>
                </div>
              </div>
            )}
          </CustomPopover>
        </div>
      </>
    ),
  }
}
