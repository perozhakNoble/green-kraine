import { useRef } from 'react'
import { useEffect } from 'react'

import { capitalize } from 'lodash'
import { useTranslation } from 'react-i18next'

import {
  Form,
  Label,
  PasswordField,
  Submit,
  FieldError,
  EmailField,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import { TranslationKeys } from 'src/i18n'

const LoginPage = () => {
  const { isAuthenticated, logIn } = useAuth()
  const { t } = useTranslation()
  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.userReports())
    }
  }, [isAuthenticated])

  const emailRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    emailRef.current?.focus()
  }, [])

  const onSubmit = async (data: Record<string, string>) => {
    const response = await logIn({
      username: data.email,
      password: data.password,
    })

    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      toast.error(response.error)
    } else {
      toast.success(t(TranslationKeys.welcome) + '!')
    }
  }

  const getRequired = (label: string) =>
    capitalize(label + ' ' + t(TranslationKeys.is_required))

  return (
    <>
      <MetaTags title={t(TranslationKeys.log_in)} />

      <main className="rw-main">
        <div className="rw-scaffold rw-login-container">
          <div className="rw-segment">
            <header className="rw-segment-header">
              <h2 className="rw-heading rw-heading-secondary">
                {t(TranslationKeys.log_in)}
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
                    }}
                  />

                  <div className="rw-forgot-link">
                    <Link
                      to={routes.forgotPassword()}
                      className="rw-forgot-link"
                    >
                      {t(TranslationKeys.forgot_password)}?
                    </Link>
                  </div>

                  <FieldError name="password" className="rw-field-error" />

                  <div className="rw-button-group">
                    <Submit className="rw-button rw-button-blue">
                      {t(TranslationKeys.log_in)}
                    </Submit>
                  </div>
                </Form>
              </div>
            </div>
          </div>
          <div className="rw-login-link">
            <span>{t(TranslationKeys.dont_have_account)}?</span>{' '}
            <Link to={routes.signup()} className="rw-link">
              {t(TranslationKeys.sign_up)}!
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default LoginPage
