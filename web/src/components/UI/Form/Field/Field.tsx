import { useContext } from 'react'

import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'

import { FieldError, Label, Path, TextField } from '@redwoodjs/forms'

import { capitalize } from 'src/components/utils/string'

import { FormContext, FormType } from '../FormWrapper/FormWrapper'

export enum FieldType {
  text = 'text',
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
  required?: boolean
}

export type IFieldValidation = IFieldValidationRequired

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
      type: FieldType.text
      value?: string
      validation?: IFieldValidationRequired
    }
  | {
      type: FieldType.email
      value?: string
      validation?: IFieldValidationRequired
    }
  | {
      type: FieldType.number
      value: number
      allowDecimal?: boolean
    }
  | {
      type: FieldType.date
      isMulti: true
      value: Array<OptionType>
    }
  | {
      type: FieldType.date
      isMulti: false
      value: OptionType
    }
)

const Field = <T,>(props: IFieldProps<T>) => {
  const { formMethods, mode, isEdit: isEditTurnedOn } = useContext(FormContext)

  const inputClass = classNames({
    'rounded-xl px-2 py-2 w-full border-secondary_light block min-h-[2.5rem] text-xs border-[1px] text-secondary font-light [&:not(:focus)]:hover:border-secondary transition-all':
      true,
    'pl-10': props.icon,
    'w-24': props.type === FieldType.number,
  })

  const inputGroupClass = classNames({
    'relative mt-1 rounded-xl ': props.type !== FieldType.date,
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
      case 'text':
        return (
          <TextField
            name={props.name}
            onChange={(e) => {
              formMethods.setValue(props.name, e.target.value as any, {
                shouldValidate: true,
              })
              props.onChange ?? props.onChange(e.target.value)
            }}
            className={inputClass}
            value={props.value || formMethods.watch(props.name) || ''}
            placeholder={props.placeholder}
            validation={{ required: props.validation?.required }}
          />
        )
    }
  }

  const preview = () => {
    switch (props.type) {
      case 'text':
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
