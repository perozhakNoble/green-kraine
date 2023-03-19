import { H4 } from '@ui/Typography'
import { useTranslation } from 'react-i18next'

import { MetaTags } from '@redwoodjs/web'

import Users from 'src/components/Users/Users'
import { TranslationKeys } from 'src/i18n'

const UsersPage = () => {
  const { t } = useTranslation()
  return (
    <>
      <MetaTags title={t(TranslationKeys.users)} description="Users page" />
      <H4 className="mx-6 mt-4">{t(TranslationKeys.users)}</H4>
      <Users />
    </>
  )
}

export default UsersPage
