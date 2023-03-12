import { useState } from 'react'

import { Button, ConfirmationDialog } from '@ui'
import useTable, { tableButtons, TableSearch } from '@ui/Table/Table'
import { TableColumn } from '@ui/types'
import { capitalize } from 'lodash'
import { useTranslation } from 'react-i18next'
import {
  CategoriesQuery,
  CategoriesQueryVariables,
  Category,
  CreateCategory,
  CreateCategoryVariables,
  DeleteCategory,
  UpdateCategory,
  UpdateCategoryVariables,
} from 'types/graphql'

import { useMutation, useQuery } from '@redwoodjs/web'

import {
  CategoriesSortBy,
  CATEGORIES_PAGINATION_ITEMS,
} from 'src/components/Categories/Categories.constants'
import {
  CATEGORIES_QUERY,
  CREATE_CATEGORY_MUTATION,
  DELETE_CATEGORY_MUTATION,
  UPDATE_CATEGORY_MUTATION,
} from 'src/components/Categories/Categories.graphql'
import CategoryModal, {
  CategoryForm,
} from 'src/components/Categories/CategoryModal/CategoryModal'
import { useAfterMountEffect } from 'src/hooks/useAfterMountEffect'
import { TranslationKeys } from 'src/i18n'

const Categories = () => {
  const { t } = useTranslation()

  const {
    data: categoriesData,
    loading,
    error,
    refetch,
  } = useQuery<CategoriesQuery>(CATEGORIES_QUERY, {
    variables: {
      pagination: {
        skip: 0,
        take: CATEGORIES_PAGINATION_ITEMS,
      },
      search: '',
    } as CategoriesQueryVariables,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-and-network',
  })

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<boolean>(false)
  const [categoryForEdit, setCategoryForEdit] = useState<Category>(null)
  const [categoryForDelete, setCategoryForDelete] = useState<Category>(null)
  const [categories, setCategories] = useState<Partial<Category>[]>([])
  const [search, setSearch] = useState('')

  useAfterMountEffect(() => {
    if (!loading) {
      setCategories((categoriesData?.categoriesList?.items as Category[]) || [])
    }
  }, [categoriesData, loading])

  const handleEdit = (category: Category) => {
    setCategoryForEdit(category)
    setIsCategoryModalOpen(true)
  }

  const handleDelete = (category: Category) => {
    setCategoryForDelete(category)
    setIsConfirmDeleteOpen(true)
  }

  const columns: TableColumn<Category>[] = [
    {
      title: t(TranslationKeys.name),
      accessor: (category) => category.name,
      isMain: true,
      sortable: CategoriesSortBy.name,
    },
    {
      title: t(TranslationKeys.count_of_usage),
      accessor: (category) => String(category.problems.length),
      isMain: false,
      sortable: CategoriesSortBy.usage_count,
    },
  ]

  const { Table, paginationVariables, gotoPrevPageIfCurrentRedundant } =
    useTable({
      data: categories,
      refetch,
      loading,
      search,
      error,
      total: categoriesData?.categoriesList?.total,
      columns,
      buttons: (c) =>
        tableButtons({
          edit: () => handleEdit(c),
          remove: () => handleDelete(c),
        }),
    })

  const refetchVariables: CategoriesQueryVariables = {
    pagination: paginationVariables,
    search,
  }

  const defaultRefetchOptions = {
    refetchQueries: [
      {
        query: CATEGORIES_QUERY,
        variables: refetchVariables,
      },
    ],
    awaitRefetchQueries: true,
  }

  const [createCategory, createCategoryOpts] = useMutation<CreateCategory>(
    CREATE_CATEGORY_MUTATION,
    defaultRefetchOptions
  )

  const [updateCategory, updateCategoryOpts] = useMutation<UpdateCategory>(
    UPDATE_CATEGORY_MUTATION,
    defaultRefetchOptions
  )

  const [deleteCategory, deleteCategoryOpts] = useMutation<DeleteCategory>(
    DELETE_CATEGORY_MUTATION,
    defaultRefetchOptions
  )

  const onSubmit = async (values: CategoryForm) => {
    const isEdit = !!categoryForEdit

    if (isEdit) {
      await updateCategory({
        variables: {
          id: categoryForEdit.id,
          input: values,
        } as UpdateCategoryVariables,
      })
    } else {
      await createCategory({
        variables: {
          input: values,
        } as CreateCategoryVariables,
      })
    }

    setIsCategoryModalOpen(false)
  }

  const reset = () => {
    setCategoryForEdit(null)
    createCategoryOpts.reset()
    updateCategoryOpts.reset()
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
              setCategoryForEdit(null)
              setIsCategoryModalOpen(true)
            }}
          />
        </div>
      </div>
      <Table />
      <CategoryModal
        isOpen={isCategoryModalOpen}
        setIsOpen={setIsCategoryModalOpen}
        afterModalClose={() => setCategoryForEdit(null)}
        category={categoryForEdit}
        onSubmit={onSubmit}
        isLoading={createCategoryOpts?.loading || updateCategoryOpts?.loading}
        error={createCategoryOpts?.error || updateCategoryOpts?.error}
        reset={reset}
      />
      <ConfirmationDialog
        header={t(TranslationKeys.confirm_delete)}
        confirm={async () => {
          await deleteCategory({ variables: { id: categoryForDelete.id } })
          gotoPrevPageIfCurrentRedundant()
          setIsConfirmDeleteOpen(false)
        }}
        afterModalClose={() => setCategoryForDelete(null)}
        close={() => setIsConfirmDeleteOpen(false)}
        loading={deleteCategoryOpts?.loading}
        isOpen={isConfirmDeleteOpen}
        type="error"
        submitBtnText={t(TranslationKeys.yes)}
        text={`${t(TranslationKeys.are_u_sure_to_delete)} ${
          categoryForDelete?.name
        }?`}
      />
    </div>
  )
}

export default Categories
