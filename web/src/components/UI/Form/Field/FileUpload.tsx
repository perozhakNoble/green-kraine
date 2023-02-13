/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'

import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faCloudUploadAlt, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { FileRejection, useDropzone } from 'react-dropzone'

import {
  getFileBadTypeError,
  getFileInputSubheading,
  getFileTooLargeError,
} from 'src/components/utils/file'
import {
  DEFAULT_ERROR_TEXTS,
  DEFAULT_FORM_BUTTON_TEXTS,
  DEFAULT_INPUTS_TEXTS,
  MAX_FILE_SIZE,
} from 'src/constants'

export enum AcceptedFileTypes {
  PDF = '.pdf',
  DOCX = '.docx',
  DOC = '.doc',
}

export interface FileUploadProps {
  heading: string
  subheading?: string
  multiple?: boolean
  onDropSuccess: any
  onDropFailure: (error: string) => void
  acceptedFileTypes?: AcceptedFileTypes[]
  renderAsButton?: boolean
  buttonClasses?: string
  buttonText?: string
  buttonIcon?: JSX.Element
  isLoading?: boolean
  isDisabled?: boolean
}

const baseStyle = {
  display: 'block',
  width: '100%',
  borderWidth: '2px',
  borderColor: '#D1D5DB',
  borderStyle: 'dashed',
  borderRadius: '0.5em',
  padding: '3rem',
  textAlign: 'center',
  cursor: 'pointer',
}

const buttonStyle = {
  display: 'block',
  width: '80px',
}

const activeStyle = {
  backgroundColor: '#F3F4F6',
  borderColor: '#9CA3AF',
}

export enum FileUploadError {
  BAD_TYPE = 'file-invalid-type',
  TOO_LARGE = 'file-too-large',
}

const defaultTypes = [
  AcceptedFileTypes.PDF,
  AcceptedFileTypes.DOC,
  AcceptedFileTypes.DOCX,
]
const FileUpload = ({
  heading = DEFAULT_INPUTS_TEXTS.FILE_INPUT_HEADER,
  onDropSuccess,
  onDropFailure,
  multiple,
  acceptedFileTypes = defaultTypes,
  subheading = getFileInputSubheading(acceptedFileTypes),
  buttonClasses = 'bg-primary text-white px-3 py-2 rounded-lg hover:bg-primary-dark flex',
  buttonText = DEFAULT_INPUTS_TEXTS.FILE_INPUT_BUTTON,
  buttonIcon = <CloudArrowUpIcon className="my-auto mr-2 w-4" />,
  isLoading = false,
  renderAsButton = false,
  isDisabled = false,
}: FileUploadProps) => {
  const getErrorMessageFromCode = (errorss: FileRejection[]) => {
    const error = errorss.length ? errorss[0] : null
    if (error) {
      if (error.errors.some((err) => err.code === FileUploadError.BAD_TYPE)) {
        return getFileBadTypeError(acceptedFileTypes)
      }
      if (error.errors.some((err) => err.code === FileUploadError.TOO_LARGE)) {
        return getFileTooLargeError(MAX_FILE_SIZE.message)
      }
    } else {
      return DEFAULT_ERROR_TEXTS.SOMETHING_WENT_WRONG
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/*': acceptedFileTypes,
    },
    onDropAccepted: onDropSuccess,
    onDropRejected: (err) => {
      const error = getErrorMessageFromCode(err)
      onDropFailure(error)
    },
    multiple,
    disabled: isDisabled || isLoading,
    maxSize: MAX_FILE_SIZE.size,
  })

  let styles

  if (renderAsButton) {
    styles = buttonStyle
  } else {
    styles = baseStyle
  }

  const style = useMemo(
    () => ({
      ...styles,
      ...(isDragActive ? activeStyle : {}),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDragActive]
  )

  return (
    <div
      className={
        isDisabled || isLoading ? 'hover:cursor-default' : 'hover:bg-gray-100'
      }
      {...getRootProps({ style })}
    >
      <input {...getInputProps()} disabled={isDisabled || isLoading} />
      {renderAsButton ? (
        <button
          type="button"
          className={buttonClasses}
          disabled={isDisabled || isLoading}
        >
          {isLoading ? (
            <FontAwesomeIcon
              icon={faSpinner as IconProp}
              className="my-auto mr-2 w-4"
              spin
            />
          ) : (
            buttonIcon
          )}
          <span className="my-auto text-sm font-bold">{buttonText}</span>
        </button>
      ) : (
        <>
          {isLoading ? (
            <FontAwesomeIcon
              icon={faSpinner as IconProp}
              className="text-2xl text-gray-400"
              spin
            />
          ) : (
            <FontAwesomeIcon
              icon={faCloudUploadAlt as IconProp}
              className="text-2xl text-gray-400"
            />
          )}
          <span className="mt-2 block text-sm font-medium text-gray-900">
            {isLoading ? DEFAULT_FORM_BUTTON_TEXTS.LOADING : heading}
          </span>
          <span className="mt-2 block text-xs font-medium text-gray-900">
            {!isLoading ? subheading : <>&nbsp;</>}
          </span>
        </>
      )}
    </div>
  )
}

export default FileUpload
