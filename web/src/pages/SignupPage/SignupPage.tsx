import { useRef } from 'react'
import { useEffect } from 'react'

import { capitalize } from 'lodash'
import { useTranslation } from 'react-i18next'

import {
  Form,
  Label,
  TextField,
  PasswordField,
  FieldError,
  Submit,
  EmailField,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import { useLanguageLocaleStorage } from 'src/hooks/useLanguageLocaleStorage'
import { TranslationKeys } from 'src/i18n'

const SignupPage = () => {
  const { isAuthenticated, signUp } = useAuth()
  const { t } = useTranslation()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.userReports())
    }
  }, [isAuthenticated])

  // focus on email box on page load
  const emailRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const onSubmit = async (data: Record<string, string>) => {
    const response = await signUp({
      username: data.email,
      name: data.name,
      password: data.password,
    })

    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      toast.error(response.error)
    } else {
      // user is signed in automatically
      toast.success(t(TranslationKeys.welcome) + '!')
    }
  }

  const getRequired = (label: string) =>
    capitalize(label + ' ' + t(TranslationKeys.is_required))

  const { Select } = useLanguageLocaleStorage()

  return (
    <>
      <MetaTags title={t(TranslationKeys.sign_up)} />

      <div className="flex h-12 w-screen justify-between border-b-[1px] border-primary-dark bg-primary-light">
        <div className="flex w-full items-center justify-end pr-24">
          <Select />
        </div>
      </div>
      <main className="rw-main">
        <div className="rw-scaffold rw-login-container">
          <div className="rw-segment">
            <header className="rw-segment-header">
              <h2 className="rw-heading rw-heading-secondary">
                {t(TranslationKeys.sign_up)}
              </h2>
            </header>

            <div className="rw-segment-main">
              <div className="rw-form-wrapper">
                <Form onSubmit={onSubmit} className="rw-form-wrapper">
                  <Label
                    name="email"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    {t(TranslationKeys.email)}
                  </Label>
                  <EmailField
                    name="email"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    ref={emailRef}
                    validation={{
                      required: {
                        value: true,
                        message: getRequired(t(TranslationKeys.email)),
                      },
                    }}
                  />
                  <FieldError name="email" className="rw-field-error" />

                  <Label
                    name="name"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    {t(TranslationKeys.name)}
                  </Label>
                  <TextField
                    name="name"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    validation={{
                      required: {
                        value: true,
                        message: getRequired(t(TranslationKeys.name)),
                      },
                    }}
                  />
                  <FieldError name="name" className="rw-field-error" />

                  <Label
                    name="password"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    {t(TranslationKeys.password)}
                  </Label>
                  <PasswordField
                    name="password"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    autoComplete="current-password"
                    validation={{
                      required: {
                        value: true,
                        message: getRequired(t(TranslationKeys.password)),
                      },
                      minLength: {
                        value: 8,
                        message: t(TranslationKeys.min_length) + ' - ' + 8,
                      },
                    }}
                  />
                  <FieldError name="password" className="rw-field-error" />

                  <div className="rw-button-group">
                    <Submit className="rw-button rw-button-blue">
                      {t(TranslationKeys.sign_up)}
                    </Submit>
                  </div>
                </Form>
              </div>
            </div>
          </div>
          <div className="rw-login-link">
            <span>{t(TranslationKeys.already_have_an_account)}?</span>{' '}
            <Link to={routes.login()} className="rw-link">
              {t(TranslationKeys.log_in)}!
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default SignupPage
