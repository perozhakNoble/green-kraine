import { useState } from 'react'

import { Button, ConfirmationDialog } from '@ui'
import useTable, { tableButtons, TableSearch } from '@ui/Table/Table'
import { TableColumn } from '@ui/types'
import { capitalize } from 'lodash'
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
import { useAfterMountEffect } from 'src/hooks/useAfterMountEffect'
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
    // {
    //   title: t(TranslationKeys.count_of_usage),
    //   accessor: (problem) => String(problem.problems.length),
    //   isMain: false,
    //   sortable: ProblemsSortBy.usage_count,
    // },
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

  return (
    <div className="flex w-full flex-col items-center p-4">
      <div className="mb-2 flex w-full">
        <TableSearch search={search} setSearch={setSearch} />
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
