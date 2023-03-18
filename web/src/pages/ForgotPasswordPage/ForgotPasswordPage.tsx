import { useEffect, useRef } from 'react'

import { capitalize } from 'lodash'
import { useTranslation } from 'react-i18next'

import { Form, Label, Submit, FieldError, EmailField } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import { TranslationKeys } from 'src/i18n'

const ForgotPasswordPage = () => {
  const { isAuthenticated, forgotPassword } = useAuth()

  const { t } = useTranslation()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.userReports())
    }
  }, [isAuthenticated])

  const emailRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    emailRef?.current?.focus()
  }, [])

  const onSubmit = async (data: { email: string }) => {
    const response = await forgotPassword(data.email)

    if (response.error) {
      toast.error(response.error)
    } else {
      // The function `forgotPassword.handler` in api/src/functions/auth.js has
      // been invoked, let the user know how to get the link to reset their
      // password (sent in email, perhaps?)
      toast.success(
        t(TranslationKeys.link_to_reset_password_sent_to) + response.email
      )
      navigate(routes.login())
    }
  }

  const getRequired = (label: string) =>
    capitalize(label + ' ' + t(TranslationKeys.is_required))

  return (
    <>
      <MetaTags title={t(TranslationKeys.forgot_password)} />

      <main className="rw-main">
        <div className="rw-scaffold rw-login-container">
          <div className="rw-segment">
            <header className="rw-segment-header">
              <h2 className="rw-heading rw-heading-secondary">
                {t(TranslationKeys.forgot_password)}
              </h2>
            </header>

            <div className="rw-segment-main">
              <div className="rw-form-wrapper">
                <Form onSubmit={onSubmit} className="rw-form-wrapper">
                  <div className="text-left">
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
                  </div>

                  <div className="rw-button-group">
                    <Submit className="rw-button rw-button-blue">
                      {t(TranslationKeys.send)}
                    </Submit>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default ForgotPasswordPage
