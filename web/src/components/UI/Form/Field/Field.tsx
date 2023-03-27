import { useContext, useState } from 'react'

import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faFileAlt, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Switch } from '@headlessui/react'
import FileUpload, { AcceptedFileTypes } from '@ui/Form/Field/FileUpload'
import ToastContent from '@ui/ToastContent'
import classNames from 'classnames'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import ReactSelect, { components as ReactSelectComponents } from 'react-select'
import Datepicker from 'react-tailwindcss-datepicker'
import { DateType } from 'react-tailwindcss-datepicker/dist/types'

import {
  CheckboxField,
  Controller,
  EmailField,
  FieldError,
  Label,
  NumberField,
  Path,
  RadioField,
  TextAreaField,
  TextField,
  TimeField,
} from '@redwoodjs/forms'
import { toast } from '@redwoodjs/web/dist/toast'

import { cleanFileName, downloadBase64Data } from 'src/components/utils/file'
import { capitalize } from 'src/components/utils/string'
import { DATE_FORMAT } from 'src/constants'
import { TranslationKeys } from 'src/i18n'

import { FormContext, FormType } from '../FormWrapper/FormWrapper'

export enum FieldType {
  text = 'text',
  textarea = 'textarea',
  number = 'number',
  date = 'date',
  email = 'email',
  select = 'select',
  checkbox = 'checkbox',
  radio = 'radio',
  toggle = 'toggle',
  file = 'file',
  time = 'time',
}

export type OptionTypeValue = number | string

export type OptionType = {
  value: OptionTypeValue
  label: number | string
}

export type IFieldValidationRequired = {
  required?: boolean | string
}

export type IFieldValidationMinMax = {
  min?: {
    value: number
    message: string
  }
  max?: {
    value: number
    message: string
  }
}

type zeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type zeroToSix = 0 | 1 | 2 | 3 | 4 | 5 | 6

type TimeString = `${0 | 1 | 2}${zeroToNine}:${zeroToSix}${zeroToNine}`

export type IFieldValidationMinMaxTime = {
  min?: {
    value: TimeString
    message: string
  }
  max?: {
    value: TimeString
    message: string
  }
}

// export type IFieldValidation = IFieldValidationRequired & IFieldValidationMinMax

export type FormFieldProps<T> = {
  disabled?: boolean
  name: Path<T>
  label?: string
  className?: string
  onChange?: (e: any) => any
  withoutLabel?: boolean
} & (
  | {
      type: FieldType.checkbox
      value?: boolean
      validation?: IFieldValidationRequired
    }
  | {
      type: FieldType.toggle
      value?: boolean
      leftText?: string
      text?: string
    }
  | {
      type: FieldType.radio
      value?: string
      validation?: IFieldValidationRequired
      options: OptionType[]
    }
  | {
      type: FieldType.text | FieldType.email | FieldType.textarea
      value?: string
      validation?: IFieldValidationRequired
      icon?: IconProp
      placeholder?: string
    }
  | {
      type: FieldType.number
      value?: number
      allowDecimal?: boolean
      validation?: IFieldValidationRequired & IFieldValidationMinMax
      icon?: IconProp
      placeholder?: string
    }
  | ({
      type?: FieldType.file
      heading?: string
      subheading?: string
      acceptedFileTypes?: AcceptedFileTypes[]
      validation?: IFieldValidationRequired
      isUploadLoading?: boolean
      onFileLoadFailure?: (error: string) => void
      onFileLoadSuccess?: ({
        name,
        file,
      }: {
        file: string
        name: string
      }) => void
      value?: string
    } & (
      | { onlyImage?: false | null | undefined; filenamePath: Path<T> }
      | { onlyImage?: true }
    ))
  | {
      type: FieldType.date
      value?: any
      validation?: IFieldValidationRequired
      icon?: IconProp
      placeholder?: string
      minDate?: DateType
      maxDate?: DateType
    }
  | {
      type: FieldType.time
      value?: any
      validation?: IFieldValidationRequired & IFieldValidationMinMaxTime
      icon?: IconProp
      placeholder?: string
    }
  | ({
      type: FieldType.select
      validation?: IFieldValidationRequired
      options: OptionType[]
      loading?: boolean
      placeholder?: string
    } & (
      | {
          value?: OptionTypeValue[]
          isMulti?: true
        }
      | {
          value?: OptionTypeValue
          isMulti?: false
        }
    ))
)

const Field = <T,>(props: FormFieldProps<T>) => {
  const { t } = useTranslation()
  const { formMethods, mode, isEdit: isEditTurnedOn } = useContext(FormContext)
  const isEdit =
    (mode === FormType.both || mode === FormType.editOnly) && isEditTurnedOn

  const required =
    props.type !== FieldType.toggle && props.validation?.required
      ? typeof props.validation?.required === 'string'
        ? props.validation?.required
        : capitalize(
            (props.label || props.name) + ' ' + t(TranslationKeys.is_required)
          )
      : false

  const inputClass = classNames({
    'border-secondary_light relative block min-h-[2.5rem] w-full rounded-xl':
      true,
    'border-[1px] border-gray-300 bg-white px-4 py-2 text-xs font-light tracking-wide':
      true,
    'text-secondary placeholder-gray-400 transition-all duration-300': true,
    'focus:border-teal-500 focus:ring focus:ring-teal-500/20 disabled:cursor-not-allowed':
      true,
    'disabled:opacity-70 disabled:bg-gray-100  [&:not(:focus)]:hover:border-secondary':
      true,
    // @ts-ignore
    'pl-10': props.icon,
    'w-36': props.type === FieldType.number,
    'w-28': props.type === FieldType.time,
  })

  const inputGroupWrapperClass = classNames({
    '': true,
    'flex flex-row-reverse gap-x-4 justify-end items-center flex-wrap':
      props.type === FieldType.checkbox && isEdit,
  })

  const inputGroupClass = classNames({
    'mt-1 relative rounded-xl': true,
    'w-36': props.type === FieldType.number,
    'w-28': props.type === FieldType.time,
    'w-3 h-5 mb-2': props.type === FieldType.checkbox && isEdit,
  })

  const errorClass = classNames({
    'text-error text-xs font-light': true,
    'basis-full': props.type === FieldType.checkbox && isEdit,
  })

  const labelClass = classNames({
    block: true,
    'text-primary font-normal text-sm':
      props.type !== FieldType.checkbox || !isEdit,
    'text-primary-light text-sm font-light mt-0.5':
      props.type === FieldType.checkbox && isEdit,
    'cursor-pointer':
      props.type === FieldType.checkbox && !props.disabled && isEdit,
  })

  const previewClass = classNames({
    'block text-secondary font-light text-xs ml-1': true,
    'flex flex-col': props.type === FieldType.select && props.isMulti,
  })

  const labelErrorClass = classNames({
    'block text-error font-light text-sm': true,
    'cursor-pointer':
      props.type === FieldType.checkbox && !props.disabled && !isEdit,
    'mt-0.5': props.type === FieldType.checkbox && !isEdit,
  })

  const radioLabelClass = classNames({
    'text-xs font-light text-primary-light': true,
    'hover:cursor-pointer': !props.disabled,
  })

  const filePreviewClass =
    'relative flex cursor-alias items-center rounded-md border-[1px] py-2 px-4 text-xs font-light text-secondary'

  const getValueForSelect = (
    valueToParse: OptionTypeValue | OptionTypeValue[]
  ): OptionType | OptionType[] => {
    if (props.type === FieldType.select) {
      if (!Array.isArray(valueToParse)) {
        return props.options.find((opt) => opt.value === valueToParse)
      } else {
        return valueToParse.map((value) =>
          props.options.find((opt) => opt.value === value)
        )
      }
    }
    return undefined
  }

  const getValueForRadio = (valueToParse: OptionTypeValue): OptionTypeValue => {
    if (props.type === FieldType.radio) {
      return props.options.find((opt) => opt.value === valueToParse)?.value
    }
    return undefined
  }

  const getLabelFromValue = (
    valueToParse: OptionTypeValue
  ): OptionTypeValue => {
    if (props.type !== FieldType.select) return undefined

    return props.options.find((opt) => opt.value === valueToParse)?.label || ''
  }

  const downloadURL = () => {
    try {
      if (props.type !== FieldType.file || props.onlyImage === true) return
      downloadBase64Data(
        formMethods.watch(props.name),
        formMethods.watch(props.filenamePath)
      )
      toast.success(
        <ToastContent
          type="success"
          text={t(TranslationKeys.file_uploaded_success)}
        />
      )
    } catch (_err) {
      toast.error(
        <ToastContent
          type="error"
          text={t(TranslationKeys.something_went_wrong)}
        />
      )
    }
  }

  const [loadingFileUpload, setLoadingFileUpload] = useState<boolean>(false)

  const onFileLoadSuccess = async (
    files
  ): Promise<{ file: string; name: string }> => {
    return new Promise((resolve, reject) => {
      setLoadingFileUpload(true)
      const reader = new FileReader()
      reader.readAsDataURL(files[0])
      reader.onload = () =>
        resolve({
          file: reader.result,
          name: cleanFileName(files[0].name),
        })
      reader.onerror = (error) => reject(error)
    }).then(({ file, name }: any) => {
      setLoadingFileUpload(false)
      return { file, name }
    })
  }

  const input = () => {
    switch (props.type) {
      case FieldType.time:
        return (
          <TimeField
            name={props.name}
            onChange={(e) => {
              formMethods.setValue(props.name, e.target.value as any, {
                shouldValidate: true,
              })
              props.onChange && props.onChange(e.target.value)
            }}
            className={inputClass}
            value={props.value || formMethods.watch(props.name) || ''}
            placeholder={props.placeholder}
            min={props.validation?.min?.value}
            max={props.validation?.max?.value}
            validation={{
              required,
              min: {
                message: props.validation?.min?.message,
                value: props.validation?.min?.value,
              },
              max: {
                message: (props.validation?.max as any)?.message,
                value: (props.validation?.max as any)?.value,
              },
            }}
            disabled={props.disabled}
          />
        )
      case FieldType.file:
        return (
          <Controller
            name={props.name}
            control={formMethods.control}
            rules={{
              required,
            }}
            render={({ field }) => (
              <>
                {field.value ? (
                  <div className="flex items-center gap-2">
                    {props.onlyImage === true ? (
                      <div className="relative">
                        <img
                          src={formMethods.watch(props.name)}
                          alt="problem"
                          className="max-h-xl max-w-xl rounded-lg object-cover"
                        />

                        <FontAwesomeIcon
                          icon={faTimes as IconProp}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            field.onChange('')
                          }}
                          className="absolute -right-2 -top-2 h-4 w-4  cursor-pointer  text-red-500"
                        />
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          downloadURL()
                        }}
                        className={filePreviewClass}
                      >
                        <FontAwesomeIcon
                          icon={faFileAlt as IconProp}
                          className="mr-2 text-sm"
                        />
                        <span className="block">
                          {formMethods.watch(props.filenamePath)}
                        </span>

                        <span
                          className="absolute -right-2 -top-2 h-4 w-4  cursor-pointer rounded-full bg-red-500 text-center text-white"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            field.onChange('')
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faTimes as IconProp}
                            className="m-auto text-xs"
                          />
                        </span>
                      </button>
                    )}
                  </div>
                ) : (
                  <FileUpload
                    heading={props.heading}
                    subheading={props.subheading}
                    isLoading={loadingFileUpload || props.isUploadLoading}
                    onDropFailure={(error) => {
                      toast.error(<ToastContent type="error" text={error} />)
                      props.onFileLoadFailure && props.onFileLoadFailure(error)
                    }}
                    onlyImage={props.onlyImage}
                    onDropSuccess={async (files) => {
                      const { file, name } = await onFileLoadSuccess(files)
                      formMethods.setValue(props.name, file as any, {
                        shouldValidate: true,
                      })

                      if (props.onlyImage !== true) {
                        formMethods.setValue(props.filenamePath, name as any, {
                          shouldValidate: true,
                        })
                      }
                      props.onFileLoadSuccess &&
                        props.onFileLoadSuccess({ file, name })
                    }}
                    multiple={false}
                    acceptedFileTypes={props.acceptedFileTypes}
                  />
                )}
              </>
            )}
          />
        )

      case FieldType.checkbox:
        return (
          <CheckboxField
            className="h-4 w-4 rounded-xl border-[#dbdcde] text-primary focus:ring-primary enabled:hover:cursor-pointer"
            name={props.name}
            onChange={(e) => {
              const v = e.target.checked as any
              formMethods.setValue(props.name, v, {
                shouldValidate: true,
              })
              props.onChange && props.onChange(v)
            }}
            id={props.name}
            disabled={props.disabled}
            checked={
              props.value || (formMethods.watch(props.name) as boolean) || false
            }
            validation={{ required }}
          />
        )
      case FieldType.toggle:
        return (
          <Controller
            name={props.name}
            control={formMethods.control}
            render={({ field }) => {
              // eslint-disable-next-line no-case-declarations
              const label = props.text
              // eslint-disable-next-line no-case-declarations
              const leftLabel = props.leftText
              // eslint-disable-next-line no-case-declarations
              const enabled =
                props.value || formMethods.watch(props.name) || false
              // eslint-disable-next-line no-case-declarations
              const onChange = (val) => {
                formMethods.setValue(props.name, val as any, {
                  shouldValidate: true,
                })
                props.onChange && props.onChange(val)
              }
              return (
                <Switch.Group as="div" className="flex items-center">
                  {leftLabel ? (
                    <Switch.Label as="span" className="mr-1 sm:mr-3">
                      <span className="text-[11px] font-normal text-gray-500 sm:text-xs">
                        <span>{leftLabel}</span>{' '}
                      </span>
                    </Switch.Label>
                  ) : null}
                  <Switch
                    checked={enabled}
                    disabled={props.disabled}
                    {...field}
                    onChange={onChange}
                    className={classNames({
                      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-opacity-60 disabled:hover:cursor-default':
                        true,
                      'bg-primary': enabled,
                      'bg-gray-200': !enabled,
                    })}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames({
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out':
                          true,
                        'translate-x-5': enabled,
                        'translate-x-0': !enabled,
                      })}
                    />
                  </Switch>
                  {label ? (
                    <Switch.Label as="span" className="ml-1 sm:ml-3">
                      <span className="text-[11px] font-normal text-gray-500 sm:text-xs">
                        <span>{label}</span>{' '}
                      </span>
                    </Switch.Label>
                  ) : null}
                </Switch.Group>
              )
            }}
          />
        )
      case FieldType.radio:
        return (
          <div className="flex flex-wrap gap-x-6">
            {props.options.map((opt, idx) => (
              <div key={idx}>
                <RadioField
                  className="mr-2 h-4 w-4 rounded-xl border-[#dbdcde] text-primary hover:cursor-pointer focus:ring-primary"
                  name={props.name}
                  onChange={(e) => {
                    const val = e.target.value
                    formMethods.setValue(props.name, val as any, {
                      shouldValidate: true,
                    })
                    props.onChange && props.onChange(val)
                  }}
                  id={props.name + idx}
                  checked={
                    (getValueForRadio(
                      props.value || formMethods.watch(props.name)
                    ) || '') === opt.value
                  }
                  disabled={props.disabled}
                  value={opt.value}
                  validation={{
                    required,
                  }}
                />
                <Label
                  name={props.name}
                  className={radioLabelClass}
                  htmlFor={props.name + idx}
                >
                  {opt.label}
                </Label>
              </div>
            ))}
          </div>
        )
      case FieldType.text:
        return (
          <TextField
            name={props.name}
            onChange={(e) => {
              formMethods.setValue(props.name, e.target.value as any, {
                shouldValidate: true,
              })
              props.onChange && props.onChange(e.target.value)
            }}
            className={inputClass}
            value={props.value || formMethods.watch(props.name) || ''}
            placeholder={props.placeholder}
            validation={{ required }}
            disabled={props.disabled}
          />
        )
      case FieldType.textarea:
        return (
          <TextAreaField
            name={props.name}
            onChange={(e) => {
              formMethods.setValue(props.name, e.target.value as any, {
                shouldValidate: true,
              })
              props.onChange && props.onChange(e.target.value)
            }}
            className={inputClass}
            value={props.value || formMethods.watch(props.name) || ''}
            placeholder={props.placeholder}
            validation={{ required }}
            disabled={props.disabled}
          />
        )
      case FieldType.email:
        return (
          <EmailField
            name={props.name}
            onChange={(e) => {
              formMethods.setValue(props.name, e.target.value as any, {
                shouldValidate: true,
              })
              props.onChange && props.onChange(e.target.value)
            }}
            className={inputClass}
            value={props.value || formMethods.watch(props.name) || ''}
            placeholder={props.placeholder}
            validation={{ required }}
            disabled={props.disabled}
          />
        )
      case FieldType.date:
        return (
          <Controller
            name={props.name}
            rules={{
              required,
            }}
            render={() => {
              const value = {
                startDate: props?.value || formMethods.watch(props.name) || '',
                endDate: props?.value || formMethods.watch(props.name) || '',
              }
              return (
                <Datepicker
                  startWeekOn="mon"
                  inputClassName={inputClass}
                  toggleClassName="absolute top-0 bg-gray-400 bg-opacity-20 rounded-r-xl"
                  value={value}
                  placeholder={props.placeholder}
                  onChange={(date) => {
                    formMethods.setValue(props.name, date.startDate as any, {
                      shouldValidate: true,
                    })
                    props.onChange && props.onChange(date.startDate)
                  }}
                  asSingle={true}
                  useRange={false}
                  maxDate={props.maxDate}
                  minDate={props.minDate}
                  disabled={props.disabled}
                  i18n={'uk'}
                  primaryColor={'teal'}
                  displayFormat={DATE_FORMAT}
                />
              )
            }}
          />
        )
      case FieldType.number:
        return (
          <NumberField
            name={props.name}
            disabled={props.disabled}
            onChange={(e) => {
              formMethods.setValue(props.name, e.target.value as any, {
                shouldValidate: true,
              })
              props.onChange && props.onChange(e.target.value)
            }}
            className={inputClass}
            value={props.value || formMethods.watch(props.name) || ''}
            placeholder={props.placeholder}
            min={props.validation?.min?.value}
            max={props.validation?.max?.value}
            onKeyPress={(event) => {
              if (/[,.]/.test(event.key) && !props.allowDecimal) {
                event.preventDefault()
              }
            }}
            validation={{
              required,
              min: {
                message: props.validation?.min?.message,
                value: props.validation?.min?.value,
              },
              max: {
                message: (props.validation?.max as any)?.message,
                value: (props.validation?.max as any)?.value,
              },
            }}
          />
        )
      case FieldType.select:
        return (
          <Controller
            name={props.name}
            rules={{
              required,
            }}
            render={({ field }) => {
              const NoOptionsMessage = (props) => {
                return (
                  <ReactSelectComponents.NoOptionsMessage {...props}>
                    <span>{t(TranslationKeys.no_options)}</span>
                  </ReactSelectComponents.NoOptionsMessage>
                )
              }

              return (
                <ReactSelect
                  {...field}
                  isMulti={props.isMulti}
                  value={
                    getValueForSelect(
                      props.value || formMethods.watch(props.name)
                    ) || ''
                  }
                  onChange={(option) => {
                    const val = Array.isArray(option)
                      ? option.map((opt) => opt.value)
                      : (option as OptionType).value
                    formMethods.setValue(props.name, val as any, {
                      shouldValidate: true,
                    })
                    props.onChange && props.onChange(val)
                  }}
                  styles={{
                    input: (base) => ({
                      ...base,
                      input: {
                        boxShadow: 'none !important',
                      },
                    }),
                  }}
                  components={{ NoOptionsMessage }}
                  className="text-xs font-light"
                  classNames={{
                    valueContainer: () => '!px-4',
                    indicatorSeparator: () => 'hidden',
                    option: ({ isSelected, isFocused }) =>
                      (isSelected
                        ? '!bg-primary !text-white !font-medium '
                        : isFocused
                        ? '!bg-primary-light !bg-opacity-30 '
                        : 'hover:!bg-primary-light hover:!bg-opacity-30 ') + '',

                    control: ({ isFocused, isDisabled }) =>
                      (isFocused
                        ? '!border-teal-500 !ring !ring-teal-500/20 '
                        : 'hover:!border-secondary ') +
                      (isDisabled
                        ? '!cursor-not-allowed !bg-gray-100 !opacity-70 '
                        : 'hover:!cursor-pointer ') +
                      '!text-secondary !placeholder-gray-400 !transition-all !duration-300 !border-secondary_light !min-h-[2.5rem] !w-full !rounded-xl !tracking-wide !border-[1px] !border-gray-300 !bg-white !text-xs !font-light',
                  }}
                  isDisabled={props.disabled || props.loading}
                  isLoading={props.loading}
                  options={props.options}
                  placeholder={
                    props.loading
                      ? t(TranslationKeys.loading) + '..'
                      : props.placeholder
                  }
                />
              )
            }}
          />
        )
    }
  }

  const preview = () => {
    const value = props.value || formMethods.watch(props.name)
    switch (props.type) {
      case FieldType.file:
        if (
          props.onlyImage !== true &&
          formMethods.watch(props.filenamePath) &&
          value
        )
          return (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  downloadURL()
                }}
                className={filePreviewClass}
              >
                <FontAwesomeIcon
                  icon={faFileAlt as IconProp}
                  className="mr-2 text-sm"
                />
                <span className="block">
                  {formMethods.watch(props.filenamePath)}
                </span>
              </button>
            </div>
          )
        if (value) {
          return (
            <img
              src={value}
              alt="problem"
              className="max-h-xl max-w-xl rounded-lg object-cover"
            />
          )
        }
        return <div className={previewClass}>{'N/A'}</div>
      case FieldType.date:
        return (
          <div className={previewClass}>
            {value ? dayjs(value, 'YYYY-M-D').format(DATE_FORMAT) : 'N/A'}
          </div>
        )
      case FieldType.select:
        return (
          <div className={previewClass}>
            {props.isMulti === true
              ? props.value ||
                (formMethods.watch(props.name) as OptionTypeValue[])?.length
                ? (
                    props.value ||
                    (formMethods.watch(props.name) as OptionTypeValue[])
                  ).map((value, idx) => (
                    <div key={'' + idx + value}>
                      {getLabelFromValue(value) || 'N/A'}
                    </div>
                  ))
                : 'N/A'
              : getLabelFromValue(
                  props.value || formMethods.watch(props.name)
                ) || 'N/A'}
          </div>
        )
      case FieldType.checkbox:
        return (
          <div className={previewClass}>
            {value ? 'Yes' : typeof value === 'boolean' ? 'No' : 'N/A'}
          </div>
        )
      case FieldType.toggle:
        return (
          <div className={previewClass}>
            {value ? 'Yes' : typeof value === 'boolean' ? 'No' : 'N/A'}
          </div>
        )
      case FieldType.radio:
        return (
          <div className={previewClass}>
            {props.options.find((el) => el.value === value)?.label || 'N/A'}
          </div>
        )
      default:
        return <div className={previewClass}>{value || 'N/A'}</div>
    }
  }

  return (
    <div className={`${inputGroupWrapperClass} ${props.className ?? ''}`}>
      {!props.withoutLabel && (
        <Label
          name={props.name}
          className={labelClass}
          errorClassName={labelErrorClass}
          htmlFor={props.type === FieldType.radio ? '' : props.name}
        >
          {capitalize(props.label ?? props.name)}
        </Label>
      )}
      <div className={inputGroupClass}>
        {/*@ts-ignore*/}
        {props.icon && isEdit && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FontAwesomeIcon
              className="z-[1] my-auto w-4 text-gray-500"
              aria-hidden="true"
              icon={
                // @ts-ignore
                props.icon
              }
            />
          </div>
        )}
        {isEdit ? input() : preview()}
      </div>
      <FieldError name={props.name} className={errorClass} />
    </div>
  )
}

export default Field
