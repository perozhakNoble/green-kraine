import { useContext } from 'react'

import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import dayjs from 'dayjs'
import ReactSelect, { components as ReactSelectComponents } from 'react-select'
import Datepicker from 'react-tailwindcss-datepicker'

import {
  Controller,
  EmailField,
  FieldError,
  Label,
  NumberField,
  Path,
  TextAreaField,
  TextField,
} from '@redwoodjs/forms'

import { capitalize } from 'src/components/utils/string'
import { DATE_FORMAT, DEFAULT_INPUTS_TEXTS } from 'src/constants'

import { FormContext, FormType } from '../FormWrapper/FormWrapper'

export enum FieldType {
  text = 'text',
  textarea = 'textarea',
  number = 'number',
  date = 'date',
  email = 'email',
  select = 'select',
}

// | 'time'
// | 'checkbox'
// | 'radio'
// | 'file'

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

// export type IFieldValidation = IFieldValidationRequired & IFieldValidationMinMax

export type IFieldProps<T> = {
  disabled?: boolean
  icon?: IconProp
  name: Path<T>
  label?: string
  placeholder?: string
  className?: string
  onChange?: (e: any) => any
  withoutLabel?: boolean
} & (
  | {
      type: FieldType.text | FieldType.email | FieldType.textarea
      value?: string
      validation?: IFieldValidationRequired
    }
  | {
      type: FieldType.number
      value?: number
      allowDecimal?: boolean
      validation?: IFieldValidationRequired & IFieldValidationMinMax
    }
  | {
      type: FieldType.date
      value?: any
      validation?: IFieldValidationRequired
    }
  | ({
      type: FieldType.select
      validation?: IFieldValidationRequired
      options: OptionType[]
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

const Field = <T,>(props: IFieldProps<T>) => {
  const { formMethods, mode, isEdit: isEditTurnedOn } = useContext(FormContext)

  const required = props.validation?.required
    ? typeof props.validation?.required === 'string'
      ? props.validation?.required
      : capitalize(props.name + ' ' + DEFAULT_INPUTS_TEXTS.IS_REQUIRED)
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
    'pl-10': props.icon,
    'w-36': props.type === FieldType.number,
  })

  const inputGroupClass = classNames({
    'mt-1 relative rounded-xl': true,
    'w-24': props.type === FieldType.number,
    // 'w-3 h-5 mb-2': type === 'checkbox',
  })

  const errorClass = classNames({
    'text-error text-xs font-light': true,
  })

  const labelClass = classNames({
    'block text-primary font-normal text-sm': true,
  })

  const previewClass = classNames({
    'block text-secondary font-light text-xs ml-1': true,
    'flex flex-col': props.type === FieldType.select && props.isMulti,
  })

  const labelErrorClass = classNames({
    'block text-error font-light text-sm': true,
  })

  const getValueForSelect = (
    valueToParse: OptionTypeValue | OptionTypeValue[]
  ): OptionType | OptionType[] => {
    if (props.type !== FieldType.select) return undefined

    if (!Array.isArray(valueToParse)) {
      return props.options.find((opt) => opt.value === valueToParse)
    } else {
      return valueToParse.map((value) =>
        props.options.find((opt) => opt.value === value)
      )
    }
  }

  const getLabelFromValue = (
    valueToParse: OptionTypeValue
  ): OptionTypeValue => {
    if (props.type !== FieldType.select) return undefined

    return props.options.find((opt) => opt.value === valueToParse)?.label || ''
  }

  const input = () => {
    switch (props.type) {
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
                    <span>{DEFAULT_INPUTS_TEXTS.NO_OPTIONS}</span>
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
                  isDisabled={props.disabled}
                  options={props.options}
                  placeholder={props.placeholder}
                />
              )
            }}
          />
        )
    }
  }

  const preview = () => {
    switch (props.type) {
      case FieldType.date:
        return (
          <div className={previewClass}>
            {props.value || formMethods.watch(props.name)
              ? dayjs(
                  props.value || formMethods.watch(props.name),
                  'YYYY-M-D'
                ).format(DATE_FORMAT)
              : 'N/A'}
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
      default:
        return (
          <div className={previewClass}>
            {props.value || formMethods.watch(props.name) || 'N/A'}
          </div>
        )
    }
  }

  const isEdit =
    (mode === FormType.both || mode === FormType.editOnly) && isEditTurnedOn
  return (
    <div className={`${props.className ?? ''}`}>
      {!props.withoutLabel && (
        <Label
          name={props.name}
          className={labelClass}
          errorClassName={labelErrorClass}
          htmlFor={props.name}
        >
          {capitalize(props.label ?? props.name)}
        </Label>
      )}
      <div className={inputGroupClass}>
        {props.icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FontAwesomeIcon
              className="my-auto w-4 text-gray-500"
              aria-hidden="true"
              icon={props.icon}
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
