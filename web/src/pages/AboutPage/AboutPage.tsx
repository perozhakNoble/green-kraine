import { H4 } from '@ui/Typography'
import { useTranslation } from 'react-i18next'

import { MetaTags } from '@redwoodjs/web'

import { TranslationKeys } from 'src/i18n'

const TelegramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Telegram"
    viewBox="0 0 512 512"
    id="telegram"
  >
    <rect width="512" height="512" fill="#37aee2" rx="15%"></rect>
    <path fill="#c8daea" d="M199 404c-11 0-10-4-13-14l-32-105 245-144"></path>
    <path fill="#a9c9dd" d="M199 404c7 0 11-4 16-8l45-43-56-34"></path>
    <path
      fill="#f6fbfe"
      d="M204 319l135 99c14 9 26 4 30-14l55-258c5-22-9-32-24-25L79 245c-21 8-21 21-4 26l83 26 190-121c9-5 17-3 11 4"
    ></path>
  </svg>
)

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" id="gmail">
    <path fill="#ECEFF1" d="M2 2h12v12H2z"></path>
    <path fill="#CFD8DC" d="M8 9.262 14 14V4.646z"></path>
    <path
      fill="#F44336"
      d="M14.5 2H14L8 6.738 2 2h-.5A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14H2V4.646l6 4.615 6-4.616V14h.5a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"
    ></path>
  </svg>
)

const AboutPage = () => {
  const { t } = useTranslation()

  return (
    <>
      <MetaTags
        title={t(TranslationKeys.info_about)}
        description="About page"
      />

      <div className=" flex flex-col items-center">
        <H4 className="mx-6 mt-4">{t(TranslationKeys.info_about)}</H4>

        <div className="mt-4 px-4">
          <span>{t(TranslationKeys.info_about_text)}</span>
          <span>
            <br />
            <br />
            {t(TranslationKeys.info_about_author)}
          </span>

          <br />
          <br />
          <br />
          <br />
          <br />
          <span className="mt-8 mb-5">{t(TranslationKeys.contacts)}</span>
          <ul className="flex items-center gap-4">
            <li className="h-10 w-10">
              <a
                href="https://t.me/vtlllk"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TelegramIcon />
              </a>
            </li>
            <li className="h-12 w-12">
              <a
                href="mailto: vitalii.perozhak.pz.2019@lpnu.ua"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MailIcon />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default AboutPage
