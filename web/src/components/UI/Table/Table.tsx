import { ReactNode } from 'react'

export type TableColumn<T> = {
  title: string
  isSortable?: boolean
  accessor: (row: T) => string
  isMain?: boolean
}

export type TableProps<T> = {
  buttons?: (row: T) => ReactNode
  data: any[]
  columns: TableColumn<T>[]
}

const Table = <T,>({ buttons, columns, data }: TableProps<T>) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            {columns.map((header, idx) => (
              <th scope="col" className="px-6 py-3" key={'header' + idx}>
                <div className="flex items-center">
                  {header.title}
                  {header.isSortable && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-1 h-3 w-3 cursor-pointer"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 320 512"
                    >
                      <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
                    </svg>
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
    </div>
  )
}

export default Table
