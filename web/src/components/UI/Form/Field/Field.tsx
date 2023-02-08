import { useContext } from 'react'

import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
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

import { FormContext, FormType } from '../FormWrapper/FormWrapper'

export enum FieldType {
  text = 'text',
  textarea = 'textarea',
  number = 'number',
  date = 'date',
  email = 'email',
}
// | 'input
// | 'select'
// | 'email'
// | 'textarea'
// | 'number'
// | 'checkbox'
// | 'date'
// | 'radio'
// | 'file'

export type OptionType = {
  value: number | string
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
)

const Field = <T,>(props: IFieldProps<T>) => {
  const { formMethods, mode, isEdit: isEditTurnedOn } = useContext(FormContext)

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
  })

  const labelErrorClass = classNames({
    'block text-error font-light text-sm': true,
  })

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
            validation={{ required: props.validation?.required }}
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
            validation={{ required: props.validation?.required }}
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
            validation={{ required: props.validation?.required }}
            disabled={props.disabled}
          />
        )
      case FieldType.date:
        return (
          <Controller
            name={props.name}
            rules={{
              required: props.validation?.required,
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
                  displayFormat="DD/MM/YYYY"
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
              required: props.validation?.required,
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
    }
  }

  const preview = () => {
    switch (props.type) {
      case FieldType.number:
        return (
          <div className={previewClass}>
            {props.value || formMethods.watch(props.name) || 'N/A'}
          </div>
        )
      case FieldType.date:
        return (
          <div className={previewClass}>
            {props.value || formMethods.watch(props.name) || 'N/A'}
          </div>
        )
      case FieldType.text:
        return (
          <div className={previewClass}>
            {props.value || formMethods.watch(props.name) || 'N/A'}
          </div>
        )
      case FieldType.textarea:
        return (
          <div className={previewClass}>
            {props.value || formMethods.watch(props.name) || 'N/A'}
          </div>
        )
      case FieldType.email:
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
