import { useEffect, useRef, useState } from 'react'

import { capitalize } from 'lodash'
import { useTranslation } from 'react-i18next'

import {
  Form,
  Label,
  PasswordField,
  Submit,
  FieldError,
} from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import { TranslationKeys } from 'src/i18n'

const ResetPasswordPage = ({ resetToken }: { resetToken: string }) => {
  const { isAuthenticated, reauthenticate, validateResetToken, resetPassword } =
    useAuth()
  const [enabled, setEnabled] = useState(true)

  const { t } = useTranslation()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.userReports())
    }
  }, [isAuthenticated])

  useEffect(() => {
    const validateToken = async () => {
      const response = await validateResetToken(resetToken)
      if (response.error) {
        setEnabled(false)
        toast.error(response.error)
      } else {
        setEnabled(true)
      }
    }
    validateToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const passwordRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    passwordRef.current?.focus()
  }, [])

  const onSubmit = async (data: Record<string, string>) => {
    const response = await resetPassword({
      resetToken,
      password: data.password,
    })

    if (response.error) {
      toast.error(response.error)
    } else {
      toast.success(t(TranslationKeys.password_changed) + '!')
      await reauthenticate()
      navigate(routes.login())
    }
  }

  const getRequired = (label: string) =>
    capitalize(label + ' ' + t(TranslationKeys.is_required))

  return (
    <>
      <MetaTags title={t(TranslationKeys.reset_password)} />

      <main className="rw-main">
        <div className="rw-scaffold rw-login-container">
          <div className="rw-segment">
            <header className="rw-segment-header">
              <h2 className="rw-heading rw-heading-secondary">
                {t(TranslationKeys.reset_password)}
              </h2>
            </header>

            <div className="rw-segment-main">
              <div className="rw-form-wrapper">
                <Form onSubmit={onSubmit} className="rw-form-wrapper">
                  <div className="text-left">
                    <Label
                      name="password"
                      className="rw-label"
                      errorClassName="rw-label rw-label-error"
                    >
                      {t(TranslationKeys.new_password)}
                    </Label>
                    <PasswordField
                      name="password"
                      autoComplete="new-password"
                      className="rw-input"
                      errorClassName="rw-input rw-input-error"
                      disabled={!enabled}
                      ref={passwordRef}
                      validation={{
                        required: {
                          value: true,
                          message: getRequired(t(TranslationKeys.new_password)),
                        },
                      }}
                    />

                    <FieldError name="password" className="rw-field-error" />
                  </div>

                  <div className="rw-button-group">
                    <Submit
                      className="rw-button rw-button-blue"
                      disabled={!enabled}
                    >
                      {t(TranslationKeys.save)}
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

export default ResetPasswordPage
