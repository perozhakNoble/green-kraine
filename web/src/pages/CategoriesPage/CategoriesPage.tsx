import { useState } from 'react'

import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, ConfirmationDialog, Spinner, Table } from '@ui'
import { TableColumn } from '@ui/types'
import {
  CategoriesQuery,
  Category,
  CreateCategory,
  CreateCategoryVariables,
  DeleteCategory,
  UpdateCategory,
  UpdateCategoryVariables,
} from 'types/graphql'

import { MetaTags, useMutation, useQuery } from '@redwoodjs/web'

import CategoryModal, {
  CategoryForm,
} from 'src/components/CategoryModal/CategoryModal'

export const CATEGORIES_QUERY = gql`
  query CategoriesQuery {
    categories {
      id
      name
      problems {
        id
      }
    }
  }
`

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
    }
  }
`

export const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($id: String!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
    }
  }
`

export const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id) {
      id
    }
  }
`

const Categories = ({ categories }: { categories: Array<Category> }) => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<boolean>(false)
  const [categoryForEdit, setCategoryForEdit] = useState<Category>(null)
  const [categoryForDelete, setCategoryForDelete] = useState<Category>(null)

  const handleEdit = (category: Category) => {
    setCategoryForEdit(category)
    setIsCategoryModalOpen(true)
  }

  const handleDelete = (category: Category) => {
    setCategoryForDelete(category)
    setIsConfirmDeleteOpen(true)
  }

  const [createCategory, createCategoryOpts] = useMutation<CreateCategory>(
    CREATE_CATEGORY_MUTATION,
    {
      refetchQueries: [{ query: CATEGORIES_QUERY }],
      awaitRefetchQueries: true,
    }
  )

  const [updateCategory, updateCategoryOpts] = useMutation<UpdateCategory>(
    UPDATE_CATEGORY_MUTATION,
    {
      refetchQueries: [{ query: CATEGORIES_QUERY }],
      awaitRefetchQueries: true,
    }
  )

  const [deleteCategory, deleteCategoryOpts] = useMutation<DeleteCategory>(
    DELETE_CATEGORY_MUTATION,
    {
      refetchQueries: [{ query: CATEGORIES_QUERY }],
      awaitRefetchQueries: true,
    }
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

  const columns: TableColumn<Category>[] = [
    {
      title: "Ім'я",
      accessor: (category) => category.name,
      isMain: true,
      isSortable: true,
    },
    {
      title: 'Кількість використань',
      accessor: (category) => String(category.problems.length),
      isMain: false,
      isSortable: true,
    },
  ]

  return (
    <div className="flex w-full flex-col items-center p-4">
      <div className="w-full">
        <div className="ml-auto mr-1 w-20">
          <Button
            text="New +"
            onClick={() => {
              setCategoryForEdit(null)
              setIsCategoryModalOpen(true)
            }}
          />
        </div>
      </div>
      <Table
        data={categories}
        columns={columns}
        buttons={(c) => (
          <div className="flex gap-x-4">
            <FontAwesomeIcon
              icon={faPencil as IconProp}
              className="cursor-pointer text-blue-500"
              onClick={() => handleEdit(c)}
            />

            <FontAwesomeIcon
              icon={faTrash as IconProp}
              className="cursor-pointer text-red-500"
              onClick={() => handleDelete(c)}
            />
          </div>
        )}
      />
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
        header="Confirm Delete"
        confirm={async () => {
          await deleteCategory({ variables: { id: categoryForDelete.id } })
          setIsConfirmDeleteOpen(false)
        }}
        afterModalClose={() => setCategoryForDelete(null)}
        close={() => setIsConfirmDeleteOpen(false)}
        loading={deleteCategoryOpts?.loading}
        isOpen={isConfirmDeleteOpen}
        type="error"
        submitBtnText="Yes"
        text={`Are you sure you want to delete ${categoryForDelete?.name} category?`}
      />
    </div>
  )
}

const CategoriesPage = () => {
  const {
    data: categoriesData,
    loading,
    error,
  } = useQuery<CategoriesQuery>(CATEGORIES_QUERY)

  return (
    <>
      <MetaTags title="Categories" description="Categories page" />
      {loading ? (
        <div className="flex w-full items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <Categories
          categories={(categoriesData?.categories as Category[]) || []}
        />
      )}
    </>
  )
}

export default CategoriesPage
