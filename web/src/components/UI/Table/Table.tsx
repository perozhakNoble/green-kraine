import { Fragment, ReactNode, useEffect, useState } from 'react'

import {
  faPencil,
  faSort,
  faSortDown,
  faSortUp,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Form } from '@ui'
import { FieldType } from '@ui/enums'
import { SlideModal } from '@ui/Modals'
import Spinner from '@ui/Spinner'
import ToastContent from '@ui/ToastContent'
import { OptionType } from '@ui/types'
import { useTranslation } from 'react-i18next'

import { FormError, RWGqlError } from '@redwoodjs/forms'
import { useForm } from '@redwoodjs/forms'
import { toast } from '@redwoodjs/web/dist/toast'

import usePagination from 'src/hooks/usePagination'
import { TranslationKeys } from 'src/i18n'

export type TableColumn<T> = {
  title: string
  sortable?: string
  accessor: (row: T) => string
  isMain?: boolean
}

export type TableProps<T> = {
  buttons?: (row: T) => ReactNode
  data: any[]
  columns: TableColumn<T>[]
  refetch: (a: any) => any
  search: string
  total: number
  error?: RWGqlError
  loading: boolean
}

export const tableButtons = ({
  edit,
  remove,
  customBtns,
}: {
  edit?: (row) => void
  remove?: (row) => void
  customBtns?: () => ReactNode
}) => {
  return (
    <div className="flex items-center justify-center gap-x-4">
      {edit && (
        <FontAwesomeIcon
          icon={faPencil}
          className="cursor-pointer text-blue-500"
          onClick={edit}
        />
      )}

      {remove && (
        <FontAwesomeIcon
          icon={faTrash}
          className="cursor-pointer text-red-500"
          onClick={remove}
        />
      )}

      {customBtns?.()}
    </div>
  )
}

export const TableSearch = ({ search, setSearch }) => {
  const { t } = useTranslation()
  return (
    <div>
      <div className="border-secondary_light w-full max-w-3xl rounded-xl border py-0.5">
        <span>
          <input
            aria-label="input"
            value={search || ''}
            onChange={(e) => {
              setSearch(e.target.value)
            }}
            placeholder={`${t(TranslationKeys.search)}...`}
            className="border-secondary_light block w-full rounded-xl py-2 pr-12 pl-7 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </span>
      </div>
    </div>
  )
}

const useTable = <T,>({
  buttons,
  columns,
  data,
  loading,
  refetch,
  error,
  search,
  total,
}: TableProps<T>) => {
  const {
    sortColumn,
    sortOrder,
    canNextPage,
    canPreviousPage,
    paginationVariables,
    nextPage,
    previousPage,
    currentPage,
    pageSize,
    setPageSize,
    pageCount,
    gotoPage,
    handleSort,
  } = usePagination({
    defaultSortColumn: '',
    refetch,
    search,
    total,
  })

  useEffect(() => {
    if (error) {
      toast.error(
        <ToastContent type="error" text={<FormError error={error} />} />
      )
    }
  }, [error])

  const { t } = useTranslation()

  return {
    paginationVariables,
    gotoPrevPageIfCurrentRedundant: () => {
      if (currentPage === pageCount - 1 && data?.length === 1) {
        previousPage()
      }
    },
    Table: () => (
      <div className="relative w-full overflow-x-auto pb-20">
        <div
          className={`absolute left-0 right-0 top-0 bottom-0 flex h-full flex-col items-center justify-center bg-white ${
            !loading
              ? 'scale-0 bg-opacity-0 opacity-0'
              : 'scale-100 bg-opacity-50  opacity-100'
          } transition-all `}
        >
          <div className="mb-2">{t(TranslationKeys.loading)}..</div>
          <Spinner size="lg" />
        </div>

        <table className="w-full text-left text-sm text-gray-500 ">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 ">
            <tr>
              {columns.map((header, idx) => (
                <th scope="col" className="px-6 py-3" key={'header' + idx}>
                  <div className="flex items-center ">
                    {header.title}
                    {header.sortable && (
                      <FontAwesomeIcon
                        className="ml-2 h-3 w-3 cursor-pointer"
                        icon={
                          sortColumn === header.sortable
                            ? sortOrder === 'asc'
                              ? faSortDown
                              : faSortUp
                            : faSort
                        }
                        onClick={() => handleSort(header.sortable)}
                      />
                    )}
                  </div>
                </th>
              ))}

              {buttons && (
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Buttons</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr className="border-b bg-white " key={'row' + idx}>
                {columns.map((column, cIdx) => (
                  <td
                    key={'column' + idx + '-' + cIdx}
                    className={` px-6 py-4 font-medium ${
                      column.isMain && 'whitespace-nowrap text-gray-900'
                    } `}
                  >
                    {column.accessor(row)}
                  </td>
                ))}

                {buttons && (
                  <td className="px-6 py-4 text-right">{buttons(row)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <div
          className=" bottom-0 flex w-full items-center justify-between p-3"
          aria-label="Pagination"
        >
          <div className="flex gap-4">
            <div className="flex justify-around divide-x rounded-xl border border-stone-200 bg-white">
              <button
                className="px-4 py-2 text-secondary hover:cursor-pointer hover:bg-stone-50 hover:text-stone-700"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                {'<<'}
              </button>{' '}
              <button
                className="px-4 py-2 text-secondary hover:cursor-pointer hover:bg-stone-50 hover:text-stone-700"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                {'<'}
              </button>{' '}
              <button
                className="px-4 py-2 text-secondary hover:cursor-pointer hover:bg-stone-50 hover:text-stone-700"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                {'>'}
              </button>{' '}
              <button
                className="px-4 py-2 text-secondary hover:cursor-pointer hover:bg-stone-50 hover:text-stone-700"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                {'>>'}
              </button>{' '}
            </div>
            <select
              className="h-10 w-40 cursor-pointer appearance-none rounded-xl border border-stone-200 px-4 pl-6 text-secondary focus:outline-none focus:ring-2 focus:ring-primary sm:h-auto sm:text-sm"
              value={pageSize}
              onBlur={(e) => {
                setPageSize(Number(e.target.value))
              }}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option
                  key={pageSize}
                  value={pageSize}
                  className="px-4 text-secondary sm:text-sm"
                >
                  {t(TranslationKeys.show)} {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="text-md  text-secondary sm:text-sm">
            {t(TranslationKeys.page)} <strong>{currentPage + 1}</strong>{' '}
            {t(TranslationKeys.of)} {pageCount || 1}
          </div>{' '}
        </div>
      </div>
    ),
  }
}

export default useTable

export type ITableFilters = Array<{
  name: string
  label: string
  placeholder: string
  type: FieldType
  options?: OptionType[]
  loading?: boolean
  min?: {
    value: number
    message: string
  }
  max?: {
    value: number
    message: string
  }
  isMulti?: boolean
}>

export const TableFilters = ({
  filters,
  isOpen,
  setIsOpen,
  refetchWithFilters,
  refetchWithoutFilters,
}: {
  isOpen: boolean
  setIsOpen: (boolean) => void
  filters: ITableFilters
  refetchWithFilters: (filters: any) => void
  refetchWithoutFilters: () => void
}) => {
  const formMethods = useForm()

  const { t } = useTranslation()

  const [inputKey, setInputKey] = useState(Date.now())

  const updateInputKey = () => {
    setInputKey(Date.now())
  }

  return (
    <SlideModal
      open={isOpen}
      setClosed={() => setIsOpen(false)}
      title={t(TranslationKeys.filters)}
      afterModalClose={() => {
        setIsOpen(false)
      }}
    >
      <Form.Wrapper
        formMethods={formMethods}
        submitBtnText={t(TranslationKeys.apply)}
        onSubmit={async (values) => {
          refetchWithFilters(values)
          setIsOpen(false)
        }}
        reset={() => {
          refetchWithoutFilters()
          setIsOpen(false)
          formMethods.reset()
          updateInputKey()
        }}
        cancelBtnText={t(TranslationKeys.clear)}
      >
        {filters.map((filter, key) => {
          return (
            <Fragment key={key}>
              {/*@ts-ignore*/}
              <Form.Field<any>
                key={key + inputKey}
                name={filter.name}
                label={filter.label}
                placeholder={filter.placeholder}
                type={filter.type}
                validation={{
                  // @ts-ignore
                  min: filter.min,
                  max: filter.max,
                }}
                // @ts-ignore
                isMulti={filter.type === FieldType.select && filter.isMulti}
                loading={filter.type === FieldType.select && filter.loading}
                options={filter.type === FieldType.select && filter.options}
              />
            </Fragment>
          )
        })}
      </Form.Wrapper>
    </SlideModal>
  )
}
