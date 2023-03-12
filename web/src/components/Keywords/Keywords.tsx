import { useState } from 'react'

import { Button, ConfirmationDialog } from '@ui'
import useTable, { tableButtons, TableSearch } from '@ui/Table/Table'
import { TableColumn } from '@ui/types'
import { capitalize } from 'lodash'
import { useTranslation } from 'react-i18next'
import {
  KeywordsQuery,
  KeywordsQueryVariables,
  Keyword,
  CreateKeyword,
  CreateKeywordVariables,
  DeleteKeyword,
  UpdateKeyword,
  UpdateKeywordVariables,
} from 'types/graphql'

import { useMutation, useQuery } from '@redwoodjs/web'

import KeywordModal, {
  KeywordForm,
} from 'src/components/Keywords/KeywordModal/KeywordModal'
import {
  KeywordsSortBy,
  KEYWORDS_PAGINATION_ITEMS,
} from 'src/components/Keywords/Keywords.constants'
import {
  KEYWORDS_QUERY,
  CREATE_KEYWORD_MUTATION,
  DELETE_KEYWORD_MUTATION,
  UPDATE_KEYWORD_MUTATION,
} from 'src/components/Keywords/Keywords.graphql'
import { useAfterMountEffect } from 'src/hooks/useAfterMountEffect'
import { TranslationKeys } from 'src/i18n'

const Keywords = () => {
  const { t } = useTranslation()

  const {
    data: keywordsData,
    loading,
    error,
    refetch,
  } = useQuery<KeywordsQuery>(KEYWORDS_QUERY, {
    variables: {
      pagination: {
        skip: 0,
        take: KEYWORDS_PAGINATION_ITEMS,
      },
      search: '',
    } as KeywordsQueryVariables,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-and-network',
  })

  const [isKeywordModalOpen, setIsKeywordModalOpen] = useState<boolean>(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<boolean>(false)
  const [keywordForEdit, setKeywordForEdit] = useState<Keyword>(null)
  const [keywordForDelete, setKeywordForDelete] = useState<Keyword>(null)
  const [keywords, setKeywords] = useState<Partial<Keyword>[]>([])
  const [search, setSearch] = useState('')

  useAfterMountEffect(() => {
    if (!loading) {
      setKeywords((keywordsData?.keywordsList?.items as Keyword[]) || [])
    }
  }, [keywordsData, loading])

  const handleEdit = (keyword: Keyword) => {
    setKeywordForEdit(keyword)
    setIsKeywordModalOpen(true)
  }

  const handleDelete = (keyword: Keyword) => {
    setKeywordForDelete(keyword)
    setIsConfirmDeleteOpen(true)
  }

  const columns: TableColumn<Keyword>[] = [
    {
      title: t(TranslationKeys.title),
      accessor: (keyword) => keyword.title,
      isMain: true,
      sortable: KeywordsSortBy.title,
    },
    {
      title: t(TranslationKeys.count_of_usage),
      accessor: (keyword) => String(keyword.problems.length),
      isMain: false,
      sortable: KeywordsSortBy.usage_count,
    },
  ]

  const { Table, paginationVariables, gotoPrevPageIfCurrentRedundant } =
    useTable({
      data: keywords,
      refetch,
      loading,
      search,
      error,
      total: keywordsData?.keywordsList?.total,
      columns,
      buttons: (c) =>
        tableButtons({
          edit: () => handleEdit(c),
          remove: () => handleDelete(c),
        }),
    })

  const refetchVariables: KeywordsQueryVariables = {
    pagination: paginationVariables,
    search,
  }

  const defaultRefetchOptions = {
    refetchQueries: [
      {
        query: KEYWORDS_QUERY,
        variables: refetchVariables,
      },
    ],
    awaitRefetchQueries: true,
  }

  const [createKeyword, createKeywordOpts] = useMutation<CreateKeyword>(
    CREATE_KEYWORD_MUTATION,
    defaultRefetchOptions
  )

  const [updateKeyword, updateKeywordOpts] = useMutation<UpdateKeyword>(
    UPDATE_KEYWORD_MUTATION,
    defaultRefetchOptions
  )

  const [deleteKeyword, deleteKeywordOpts] = useMutation<DeleteKeyword>(
    DELETE_KEYWORD_MUTATION,
    defaultRefetchOptions
  )

  const onSubmit = async (values: KeywordForm) => {
    const isEdit = !!keywordForEdit

    if (isEdit) {
      await updateKeyword({
        variables: {
          id: keywordForEdit.id,
          input: values,
        } as UpdateKeywordVariables,
      })
    } else {
      await createKeyword({
        variables: {
          input: values,
        } as CreateKeywordVariables,
      })
    }

    setIsKeywordModalOpen(false)
  }

  const reset = () => {
    setKeywordForEdit(null)
    createKeywordOpts.reset()
    updateKeywordOpts.reset()
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
              setKeywordForEdit(null)
              setIsKeywordModalOpen(true)
            }}
          />
        </div>
      </div>
      <Table />
      <KeywordModal
        isOpen={isKeywordModalOpen}
        setIsOpen={setIsKeywordModalOpen}
        afterModalClose={() => setKeywordForEdit(null)}
        keyword={keywordForEdit}
        onSubmit={onSubmit}
        isLoading={createKeywordOpts?.loading || updateKeywordOpts?.loading}
        error={createKeywordOpts?.error || updateKeywordOpts?.error}
        reset={reset}
      />
      <ConfirmationDialog
        header={t(TranslationKeys.confirm_delete)}
        confirm={async () => {
          await deleteKeyword({ variables: { id: keywordForDelete.id } })
          gotoPrevPageIfCurrentRedundant()
          setIsConfirmDeleteOpen(false)
        }}
        afterModalClose={() => setKeywordForDelete(null)}
        close={() => setIsConfirmDeleteOpen(false)}
        loading={deleteKeywordOpts?.loading}
        isOpen={isConfirmDeleteOpen}
        type="error"
        submitBtnText={t(TranslationKeys.yes)}
        text={`${t(TranslationKeys.are_u_sure_to_delete)} ${
          keywordForDelete?.title
        }?`}
      />
    </div>
  )
}

export default Keywords
