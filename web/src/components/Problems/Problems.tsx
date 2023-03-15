import { useState } from 'react'

import { faFilter } from '@fortawesome/free-solid-svg-icons'
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
import { capitalize } from 'lodash'
import { DateTime } from 'luxon'
import { useTranslation } from 'react-i18next'
import {
  ProblemsQuery,
  ProblemsQueryVariables,
  Problem,
  CreateProblem,
  CreateProblemVariables,
  DeleteProblem,
  UpdateProblem,
  UpdateProblemVariables,
} from 'types/graphql'

import { useMutation, useQuery } from '@redwoodjs/web'

import ProblemModal, {
  ProblemForm,
} from 'src/components/Problems/ProblemModal/ProblemModal'
import {
  ProblemsSortBy,
  PROBLEMS_PAGINATION_ITEMS,
} from 'src/components/Problems/Problems.constants'
import {
  PROBLEMS_QUERY,
  CREATE_PROBLEM_MUTATION,
  DELETE_PROBLEM_MUTATION,
  UPDATE_PROBLEM_MUTATION,
} from 'src/components/Problems/Problems.graphql'
import { ProblemStatus } from 'src/constants/problem'
import { useAfterMountEffect } from 'src/hooks/useAfterMountEffect'
import { getLanguageLocaleFromLocalStorage } from 'src/hooks/useLanguageLocaleStorage'
import { TranslationKeys } from 'src/i18n'

const Problems = () => {
  const { t } = useTranslation()

  const {
    data: problemsData,
    loading,
    error,
    refetch,
  } = useQuery<ProblemsQuery>(PROBLEMS_QUERY, {
    variables: {
      pagination: {
        skip: 0,
        take: PROBLEMS_PAGINATION_ITEMS,
      },
      search: '',
    } as ProblemsQueryVariables,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-and-network',
  })

  const locale = getLanguageLocaleFromLocalStorage()
  const [isProblemModalOpen, setIsProblemModalOpen] = useState<boolean>(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<boolean>(false)
  const [problemForEdit, setProblemForEdit] = useState<Problem>(null)
  const [problemForDelete, setProblemForDelete] = useState<Problem>(null)
  const [problems, setProblems] = useState<Partial<Problem>[]>([])
  const [search, setSearch] = useState('')

  useAfterMountEffect(() => {
    if (!loading) {
      setProblems((problemsData?.problemsList?.items as Problem[]) || [])
    }
  }, [problemsData, loading])

  const handleEdit = (problem: Problem) => {
    setProblemForEdit(problem)
    setIsProblemModalOpen(true)
  }

  const handleDelete = (problem: Problem) => {
    setProblemForDelete(problem)
    setIsConfirmDeleteOpen(true)
  }

  const columns: TableColumn<Problem>[] = [
    {
      title: t(TranslationKeys.title),
      accessor: (problem) => problem.title,
      isMain: true,
      sortable: ProblemsSortBy.title,
    },
    {
      title: t(TranslationKeys.description),
      accessor: (problem) => problem.description,
      isMain: false,
      sortable: ProblemsSortBy.description,
    },
    {
      title: t(TranslationKeys.severity),
      accessor: (problem) => String(problem.severity),
      isMain: false,
      sortable: ProblemsSortBy.severity,
    },
    {
      title: t(TranslationKeys.category),
      accessor: (problem) => problem.category?.name,
      isMain: false,
      sortable: ProblemsSortBy.category,
    },
    {
      title: t(TranslationKeys.key_words),
      accessor: (problem) => problem.keywords?.map((k) => k.title)?.join(', '),
      isMain: false,
    },
    {
      title: t(TranslationKeys.status),
      accessor: (problem) => t(problem.status),
      isMain: false,
      sortable: ProblemsSortBy.status,
    },
    {
      title: t(TranslationKeys.votes_count),
      accessor: (problem) => String(problem.votes.length),
      isMain: false,
      sortable: ProblemsSortBy.votes_count,
    },
    {
      title: t(TranslationKeys.comments_count),
      accessor: (problem) => String(problem.comments.length),
      isMain: false,
      sortable: ProblemsSortBy.comments_count,
    },
    {
      title: t(TranslationKeys.created_at),
      accessor: (problem) =>
        DateTime.fromISO(problem.createdAt)
          .setLocale(locale)
          .toFormat('HH:mm, dd LLL, yyyy'),
      isMain: false,
      sortable: ProblemsSortBy.created_at,
    },
    {
      title: t(TranslationKeys.last_update_at),
      accessor: (problem) =>
        DateTime.fromISO(problem.updatedAt)
          .setLocale(locale)
          .toFormat('HH:mm, dd LLL, yyyy'),
      isMain: false,
      sortable: ProblemsSortBy.updated_at,
    },
  ]

  const { Table, paginationVariables, gotoPrevPageIfCurrentRedundant } =
    useTable({
      data: problems,
      refetch,
      loading,
      search,
      error,
      total: problemsData?.problemsList?.total,
      columns,
      buttons: (c) =>
        tableButtons({
          edit: () => handleEdit(c),
          remove: () => handleDelete(c),
        }),
    })

  const refetchVariables: ProblemsQueryVariables = {
    pagination: paginationVariables,
    search,
  }

  const defaultRefetchOptions = {
    refetchQueries: [
      {
        query: PROBLEMS_QUERY,
        variables: refetchVariables,
      },
    ],
    awaitRefetchQueries: true,
  }

  const [createProblem, createProblemOpts] = useMutation<CreateProblem>(
    CREATE_PROBLEM_MUTATION,
    defaultRefetchOptions
  )

  const [updateProblem, updateProblemOpts] = useMutation<UpdateProblem>(
    UPDATE_PROBLEM_MUTATION,
    defaultRefetchOptions
  )

  const [deleteProblem, deleteProblemOpts] = useMutation<DeleteProblem>(
    DELETE_PROBLEM_MUTATION,
    defaultRefetchOptions
  )

  const onSubmit = async (values: ProblemForm) => {
    const isEdit = !!problemForEdit

    if (isEdit) {
      await updateProblem({
        variables: {
          id: problemForEdit.id,
          input: values,
        } as UpdateProblemVariables,
      })
    } else {
      await createProblem({
        variables: {
          input: values,
        } as CreateProblemVariables,
      })
    }

    setIsProblemModalOpen(false)
  }

  const reset = () => {
    createProblemOpts.reset()
    updateProblemOpts.reset()
  }

  const statusOptions = Object.values(ProblemStatus).map((ps) => ({
    value: ps,
    label: t(TranslationKeys[ps]),
  }))

  const tableFilters: ITableFilters = [
    {
      name: 'status',
      label: t(TranslationKeys.status),
      options: statusOptions,
      type: FieldType.select,
      placeholder: t(TranslationKeys.status),
    },
  ]

  const refetchWithFilters = (filters: any) => {
    refetch({
      pagination: {
        skip: 0,
        take: PROBLEMS_PAGINATION_ITEMS,
      },
      search,
      filters: {
        status: filters.status,
      },
    } as ProblemsQueryVariables)
  }

  const refetchWithoutFilters = () => {
    refetch({
      pagination: {
        skip: 0,
        take: PROBLEMS_PAGINATION_ITEMS,
      },
      search,
      filters: undefined,
    } as ProblemsQueryVariables)
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
              setProblemForEdit(null)
              setIsProblemModalOpen(true)
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
      <ProblemModal
        isOpen={isProblemModalOpen}
        setIsOpen={setIsProblemModalOpen}
        afterModalClose={() => setProblemForEdit(null)}
        problem={problemForEdit}
        onSubmit={onSubmit}
        isLoading={createProblemOpts?.loading || updateProblemOpts?.loading}
        error={createProblemOpts?.error || updateProblemOpts?.error}
        reset={reset}
      />
      <ConfirmationDialog
        header={t(TranslationKeys.confirm_delete)}
        confirm={async () => {
          await deleteProblem({ variables: { id: problemForDelete.id } })
          gotoPrevPageIfCurrentRedundant()
          setIsConfirmDeleteOpen(false)
        }}
        afterModalClose={() => setProblemForDelete(null)}
        close={() => setIsConfirmDeleteOpen(false)}
        loading={deleteProblemOpts?.loading}
        isOpen={isConfirmDeleteOpen}
        type="error"
        submitBtnText={t(TranslationKeys.yes)}
        text={`${t(TranslationKeys.are_u_sure_to_delete)} ${
          problemForDelete?.title
        }?`}
      />
    </div>
  )
}

export default Problems
