import { saveAs } from 'file-saver'

import { capitalize } from 'src/components/utils/string'

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

export const getFileInputSubheading = (
  extensionsToParse: Array<string>,
  words: { or: string; add: string; file: string }
) => {
  const extensions = [...extensionsToParse]
  let str = ''
  if (extensions.length > 1) {
    const lastExt = extensions.pop()
    str = extensions.join(',  ') + ` ${words.or} ` + lastExt
  } else {
    str = extensions[0]
  }

  return `${capitalize(words.add)} ${str} ${words.file}`
}

export const getFileBadTypeError = (
  extensionsToParse: Array<string>,
  words: { or: string }
) => {
  const extensions = [...extensionsToParse]
  let str = ''
  if (extensions.length > 1) {
    const lastExt = extensions.pop()
    str = extensions.join(',  ') + ` ${words.or} ` + lastExt
  } else {
    str = extensions[0]
  }
  return `${str}`
}
export const getFileTooLargeError = (size: string) => {
  return `${size}`
}

export const cleanFileName = (fileName: string): string => {
  return fileName.replace(/[<>:'"\+\[\]\/\\|?$*%!#]+/g, '')
}
