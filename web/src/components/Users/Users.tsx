import { useState } from 'react'

import { faFilter, faLockOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, ConfirmationDialog } from '@ui'
import { FieldType } from '@ui/enums'
import useTable, {
  ITableFilters,
  tableButtons,
  TableFilters,
  TableSearch,
} from '@ui/Table/Table'
import { TableColumn } from '@ui/types'
import { capitalize, omit } from 'lodash'
import { useTranslation } from 'react-i18next'
import {
  UsersQuery,
  UsersQueryVariables,
  User,
  CreateUser,
  CreateUserVariables,
  DeleteUser,
  UpdateUser,
  UpdateUserVariables,
  ResetUserPassword,
  ResetUserPasswordVariables,
} from 'types/graphql'

import { useMutation, useQuery } from '@redwoodjs/web'

import UserModal, { UserForm } from 'src/components/Users/UserModal/UserModal'
import UserResetPasswordModal, {
  UserResetPassForm,
} from 'src/components/Users/UserResetPasswordModal/UserResetPasswordModal'
import {
  UsersSortBy,
  USERS_PAGINATION_ITEMS,
} from 'src/components/Users/Users.constants'
import {
  USERS_QUERY,
  CREATE_USER_MUTATION,
  DELETE_USER_MUTATION,
  UPDATE_USER_MUTATION,
  RESET_USER_PASSWORD_MUTATION,
} from 'src/components/Users/Users.graphql'
import { UserRole } from 'src/constants'
import { useAfterMountEffect } from 'src/hooks/useAfterMountEffect'
import { TranslationKeys } from 'src/i18n'

const Users = () => {
  const { t } = useTranslation()

  const {
    data: usersData,
    loading,
    error,
    refetch,
  } = useQuery<UsersQuery>(USERS_QUERY, {
    variables: {
      pagination: {
        skip: 0,
        take: USERS_PAGINATION_ITEMS,
      },
      search: '',
    } as UsersQueryVariables,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-and-network',
  })

  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false)
  const [isPasswordResetModalOpen, setIsPasswordModalOpen] =
    useState<boolean>(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<boolean>(false)
  const [userForResetPassword, setUserForResetPassword] = useState<User>(null)
  const [userForEdit, setUserForEdit] = useState<User>(null)
  const [userForDelete, setUserForDelete] = useState<User>(null)
  const [users, setUsers] = useState<Partial<User>[]>([])
  const [search, setSearch] = useState('')

  useAfterMountEffect(() => {
    if (!loading) {
      setUsers((usersData?.usersList?.items as User[]) || [])
    }
  }, [usersData, loading])

  const handleEdit = (user: User) => {
    setUserForEdit(user)
    setIsUserModalOpen(true)
  }

  const handleDelete = (user: User) => {
    setUserForDelete(user)
    setIsConfirmDeleteOpen(true)
  }

  const handleResetPasswordClick = (user: User) => {
    setUserForResetPassword(user)
    setIsPasswordModalOpen(true)
  }

  const columns: TableColumn<User>[] = [
    {
      title: t(TranslationKeys.name),
      accessor: (user) => user.name,
      isMain: true,
      sortable: UsersSortBy.name,
    },
    {
      title: t(TranslationKeys.email),
      accessor: (user) => user.email,
      isMain: false,
      sortable: UsersSortBy.email,
    },
    {
      title: t(TranslationKeys.role),
      accessor: (user) => t(user.roles),
      isMain: false,
      sortable: UsersSortBy.role,
    },
    {
      title: t(TranslationKeys.problems_commented),
      accessor: (user) => String(user.comments.length),
      isMain: false,
      sortable: UsersSortBy.problems_commented,
    },
    {
      title: t(TranslationKeys.problems_reported),
      accessor: (user) => String(user.problems.length),
      isMain: false,
      sortable: UsersSortBy.problems_reported,
    },
  ]

  const { Table, paginationVariables, gotoPrevPageIfCurrentRedundant } =
    useTable({
      data: users,
      refetch,
      loading,
      search,
      error,
      total: usersData?.usersList?.total,
      columns,
      buttons: (c) =>
        tableButtons({
          edit: () => handleEdit(c),
          remove: () => handleDelete(c),
          customBtns: () => (
            <>
              <FontAwesomeIcon
                icon={faLockOpen}
                className="cursor-pointer text-blue-500"
                onClick={() => handleResetPasswordClick(c)}
              />
            </>
          ),
        }),
    })

  const refetchVariables: UsersQueryVariables = {
    pagination: paginationVariables,
    search,
  }

  const defaultRefetchOptions = {
    refetchQueries: [
      {
        query: USERS_QUERY,
        variables: refetchVariables,
      },
    ],
    awaitRefetchQueries: true,
  }

  const [createUser, createUserOpts] = useMutation<CreateUser>(
    CREATE_USER_MUTATION,
    defaultRefetchOptions
  )

  const [updateUser, updateUserOpts] = useMutation<UpdateUser>(
    UPDATE_USER_MUTATION,
    defaultRefetchOptions
  )

  const [deleteUser, deleteUserOpts] = useMutation<DeleteUser>(
    DELETE_USER_MUTATION,
    defaultRefetchOptions
  )

  const [resetPassword, resetPasswordOpts] = useMutation<ResetUserPassword>(
    RESET_USER_PASSWORD_MUTATION,
    defaultRefetchOptions
  )

  const onSubmit = async (values: UserForm) => {
    const isEdit = !!userForEdit

    if (isEdit) {
      await updateUser({
        variables: {
          id: userForEdit.id,
          input: omit(values, ['password']),
        } as UpdateUserVariables,
      })
    } else {
      await createUser({
        variables: {
          input: values,
        } as CreateUserVariables,
      })
    }

    setIsUserModalOpen(false)
  }

  const submitResetPassword = async (values: UserResetPassForm) => {
    await resetPassword({
      variables: {
        id: userForResetPassword.id,
        password: values.password,
      } as ResetUserPasswordVariables,
    })

    setIsPasswordModalOpen(false)
  }

  const reset = () => {
    createUserOpts.reset()
    updateUserOpts.reset()
  }

  const roleOptions = Object.values(UserRole)
    .filter((r) => r !== 'ADMIN')
    .map((r) => ({
      value: r,
      label: t(r),
    }))

  const tableFilters: ITableFilters = [
    {
      name: 'role',
      label: t(TranslationKeys.role),
      options: roleOptions,
      type: FieldType.select,
      placeholder: t(TranslationKeys.role),
    },
  ]

  const refetchWithFilters = (filters: any) => {
    refetch({
      pagination: {
        skip: 0,
        take: USERS_PAGINATION_ITEMS,
      },
      search,
      filters: {
        role: filters.role,
      },
    } as UsersQueryVariables)
  }

  const refetchWithoutFilters = () => {
    refetch({
      pagination: {
        skip: 0,
        take: USERS_PAGINATION_ITEMS,
      },
      search,
      filters: undefined,
    } as UsersQueryVariables)
  }

  const [isOpenFilters, setIsOpenFilters] = useState(false)

  return (
    <div className="flex w-full flex-col items-center p-4">
      <div className="mb-2 flex w-full">
        <div className="flex items-center gap-5">
          <TableSearch search={search} setSearch={setSearch} />
          <FontAwesomeIcon
            icon={faFilter}
            className="block cursor-pointer text-gray-500"
            onClick={() => setIsOpenFilters(true)}
          />
        </div>

        <div className="ml-auto mr-1 min-w-max">
          <Button
            nonBreakingWords
            text={capitalize(t(TranslationKeys.add_new)) + ' +'}
            onClick={() => {
              setUserForEdit(null)
              setIsUserModalOpen(true)
            }}
          />
        </div>
      </div>
      <TableFilters
        filters={tableFilters}
        refetchWithFilters={refetchWithFilters}
        refetchWithoutFilters={refetchWithoutFilters}
        isOpen={isOpenFilters}
        setIsOpen={setIsOpenFilters}
      />
      <Table />
      <UserResetPasswordModal
        isOpen={isPasswordResetModalOpen}
        setIsOpen={setIsPasswordModalOpen}
        afterModalClose={() => setUserForResetPassword(null)}
        onSubmit={submitResetPassword}
        isLoading={resetPasswordOpts?.loading}
        error={resetPasswordOpts?.error}
        reset={resetPasswordOpts?.reset}
      />
      <UserModal
        isOpen={isUserModalOpen}
        setIsOpen={setIsUserModalOpen}
        afterModalClose={() => setUserForEdit(null)}
        user={userForEdit}
        onSubmit={onSubmit}
        isLoading={createUserOpts?.loading || updateUserOpts?.loading}
        error={createUserOpts?.error || updateUserOpts?.error}
        reset={reset}
      />
      <ConfirmationDialog
        header={t(TranslationKeys.confirm_delete)}
        confirm={async () => {
          await deleteUser({ variables: { id: userForDelete.id } })
          gotoPrevPageIfCurrentRedundant()
          setIsConfirmDeleteOpen(false)
        }}
        afterModalClose={() => setUserForDelete(null)}
        close={() => setIsConfirmDeleteOpen(false)}
        loading={deleteUserOpts?.loading}
        isOpen={isConfirmDeleteOpen}
        type="error"
        submitBtnText={t(TranslationKeys.yes)}
        text={`${t(TranslationKeys.are_u_sure_to_delete)} ${
          userForDelete?.name
        }?`}
      />
    </div>
  )
}

export default Users
