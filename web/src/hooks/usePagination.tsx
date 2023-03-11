import { useState } from 'react'

import _, { debounce } from 'lodash'

import { PAGINATION_SEARCH_DEBOUNCE_TIME } from 'src/constants'
import { useAfterMountEffect } from 'src/hooks/useAfterMountEffect'
import usePrevious from 'src/hooks/usePrevious'

const usePagination = ({
  defaultSortColumn,
  search,
  refetch,
  total,
  filters = {},
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState(10)
  const [withoutFetch, setWithoutFetch] = useState(false)
  const [sortColumn, setSortColumn] = useState(defaultSortColumn || null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(null)

  const pageCount = Math.ceil(total / pageSize)

  const canPreviousPage = currentPage !== 0
  const canNextPage =
    total >= pageSize * (currentPage + 1) && currentPage + 1 < pageCount

  const nextPage = () => {
    setCurrentPage(currentPage + 1)
  }

  const previousPage = () => {
    setCurrentPage(currentPage - 1)
  }

  const gotoPage = (page) => {
    setCurrentPage(page)
  }
  const paginationVariables: any = {
    skip: currentPage * pageSize,
    take: pageSize,
    sortBy: sortColumn?.replace?.(' ', '_').toLowerCase(),
  }
  if (sortOrder) {
    paginationVariables.order = sortOrder
  }

  const fetchData = () => {
    refetch({
      pagination: paginationVariables,
      search,
    })
  }

  useAfterMountEffect(() => {
    if (withoutFetch) {
      return setWithoutFetch(false)
    }
    fetchData()
    // eslint-disable-next-line
  }, [currentPage, sortColumn, sortOrder])

  const handleSearchOrPageSizeChange = () => {
    if (currentPage === 0) fetchData()
    gotoPage(0)
  }

  const prevFilters = usePrevious(filters)
  useAfterMountEffect(() => {
    if (!_.isEqual(filters, prevFilters)) {
      gotoPage(0)
      setWithoutFetch(true)
    }
  }, [filters])

  useAfterMountEffect(() => {
    const func = debounce(
      handleSearchOrPageSizeChange,
      PAGINATION_SEARCH_DEBOUNCE_TIME
    )
    func()
    return () => {
      func.cancel()
    }
    //eslint-disable-next-line
    }, [search])

  useAfterMountEffect(() => {
    handleSearchOrPageSizeChange()
    //eslint-disable-next-line
      }, [pageSize])

  function handleSort(Header: string): void {
    const isAscOrder = sortOrder === 'asc'
    if (Header === sortColumn) {
      setSortOrder(isAscOrder ? 'desc' : 'asc')
    } else {
      setSortColumn(Header)
      setSortOrder('asc')
    }
  }

  return {
    paginationVariables,
    nextPage,
    previousPage,
    gotoPage,
    handleSort,
    setPageSize,
    sortColumn,
    sortOrder,
    canNextPage,
    canPreviousPage,
    currentPage,
    pageCount,
    pageSize,
  }
}

export default usePagination
