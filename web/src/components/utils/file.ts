import { saveAs } from 'file-saver'

import { capitalize } from 'src/components/utils/string'
import { DEFAULT_ERROR_TEXTS } from 'src/constants'
import { DEFAULT_WORDS } from 'src/constants/default_texts'

export const convertBase64ToFile = (base64String, fileName) => {
  const arr = base64String.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const uint8Array = new Uint8Array(n)
  while (n--) {
    uint8Array[n] = bstr.charCodeAt(n)
  }
  const file = new File([uint8Array], fileName, { type: mime })
  return file
}

type base64String = string

export const downloadBase64Data = (
  base64String: base64String,
  fileName: string
) => {
  const file = convertBase64ToFile(base64String, fileName)
  saveAs(file, fileName)
}

export const getFileInputSubheading = (extensionsToParse: Array<string>) => {
  const extensions = [...extensionsToParse]
  let str = ''
  if (extensions.length > 1) {
    const lastExt = extensions.pop()
    str = extensions.join(',  ') + ` ${DEFAULT_WORDS.OR} ` + lastExt
  } else {
    str = extensions[0]
  }

  return `${capitalize(DEFAULT_WORDS.ADD)} ${str} ${DEFAULT_WORDS.FILE}`
}

export const getFileBadTypeError = (extensionsToParse: Array<string>) => {
  const extensions = [...extensionsToParse]
  let str = ''
  if (extensions.length > 1) {
    const lastExt = extensions.pop()
    str = extensions.join(',  ') + ` ${DEFAULT_WORDS.OR} ` + lastExt
  } else {
    str = extensions[0]
  }
  return `${DEFAULT_ERROR_TEXTS.FILE_TYPE_SHOULD_BE} ${str}`
}
export const getFileTooLargeError = (size: string) => {
  return `${DEFAULT_ERROR_TEXTS.FILE_SHOULD_BE_LESS_THAN} ${size}`
}

export const cleanFileName = (fileName: string): string => {
  return fileName.replace(/[<>:'"\+\[\]\/\\|?$*%!#]+/g, '')
}
