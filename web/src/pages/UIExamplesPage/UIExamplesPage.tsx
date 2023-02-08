import { useState } from 'react'

import { faRadio, faReceipt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { useForm } from '@redwoodjs/forms'
import { MetaTags } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import Button from 'src/components/UI/Button/Button'
import Field, { FieldType } from 'src/components/UI/Form/Field/Field'
import FormWrapper, {
  FormType,
} from 'src/components/UI/Form/FormWrapper/FormWrapper'
import ToastContent from 'src/components/UI/ToastContent'
import { H1, H2, H3, H4, H5, H6, H7 } from 'src/components/UI/Typography'

type IForm = {
  text: string
  date: any
  number: number
  email: string
}

const UiExamplesPage = () => {
  const formMethods = useForm<IForm>({
    defaultValues: {
      text: '',
      date: undefined,
      number: undefined,
      email: '',
    },
  })

  const [isLoadingFormSubmit, setIsLoadingFormSubmit] = useState(false)

  const submitForm = async (values: IForm) => {
    setIsLoadingFormSubmit(true)

    await toast.promise(
      // emulate fetch
      new Promise((resolve, _reject) => {
        setTimeout(() => {
          resolve(null)
        }, 1000)
      }),
      {
        error: <ToastContent text={'Error'} type="error" />,
        loading: <ToastContent text={'Loading..'} type="loading" />,
        success: <ToastContent text={'Success'} type="success" />,
      }
    )

    console.log(values)
    setIsLoadingFormSubmit(false)
  }

  console.log(formMethods.watch('date'))

  return (
    <>
      <MetaTags title="UI Examples" description="UI Examples page" />

      <div className="w-full p-6">
        <h1 className="text-2xl">UI Examples Page</h1>

        {/*Font weight*/}
        <div className="p-2">
          <h2 className="my-2 text-xl">Font weight</h2>
          <h3 className="font-thin">
            Україна, Екологія, Здоровʼя | GreenKraine - Thin
          </h3>
          <h3 className="font-extralight">
            Україна, Екологія, Здоровʼя | GreenKraine - Extraligh
          </h3>
          <h3 className="font-light">
            Україна, Екологія, Здоровʼя | GreenKraine - Light
          </h3>
          <h3 className="font-normal">
            Україна, Екологія, Здоровʼя | GreenKraine - Normal
          </h3>
          <h3 className="font-medium ">
            Україна, Екологія, Здоровʼя | GreenKraine - Medium
          </h3>
          <h3 className="font-semibold">
            Україна, Екологія, Здоровʼя | GreenKraine - Semibold
          </h3>
          <h3 className="font-bold">
            Україна, Екологія, Здоровʼя | GreenKraine - Bold
          </h3>
          <h3 className="font-extrabold">
            Україна, Екологія, Здоровʼя | GreenKraine - Extrabold
          </h3>
        </div>

        {/*Font color*/}
        <div className="p-2">
          <h2 className="my-2 text-xl">Font color</h2>
          <h3 className="text-error">
            Україна, Екологія, Здоровʼя | GreenKraine - Error
          </h3>
          <h3 className="text-error-light">
            Україна, Екологія, Здоровʼя | GreenKraine - Error Light
          </h3>
          <h3 className="text-secondary-light">
            Україна, Екологія, Здоровʼя | GreenKraine - Secondary Light
          </h3>
          <h3 className="text-secondary">
            Україна, Екологія, Здоровʼя | GreenKraine - Secondary
          </h3>
          <h3 className="text-dark">
            Україна, Екологія, Здоровʼя | GreenKraine - Secondary Dark
          </h3>
          <h3 className="text-warning-light">
            Україна, Екологія, Здоровʼя | GreenKraine - Warning Light
          </h3>
          <h3 className="text-warning">
            Україна, Екологія, Здоровʼя | GreenKraine - Warning
          </h3>
          <h3 className="text-primary-light">
            Україна, Екологія, Здоровʼя | GreenKraine - Primary Light
          </h3>
          <h3 className="text-primary">
            Україна, Екологія, Здоровʼя | GreenKraine - Primary
          </h3>
          <h3 className="text-primary-dark">
            Україна, Екологія, Здоровʼя | GreenKraine - Primary Dark
          </h3>
        </div>

        {/*Custom Headers*/}
        <div className="p-2">
          <h2 className="my-2 text-xl">Custom Headers</h2>
          <H1>Україна, Екологія, Здоровʼя | GreenKraine - H1</H1>
          <H2>Україна, Екологія, Здоровʼя | GreenKraine - H2</H2>
          <H3>Україна, Екологія, Здоровʼя | GreenKraine - H3</H3>
          <H4>Україна, Екологія, Здоровʼя | GreenKraine - H4</H4>
          <H5>Україна, Екологія, Здоровʼя | GreenKraine - H5</H5>
          <H6>Україна, Екологія, Здоровʼя | GreenKraine - H6</H6>
          <H7>Україна, Екологія, Здоровʼя | GreenKraine - H7</H7>
        </div>

        {/*Buttons*/}
        <div className="p-2">
          <h2 className="my-2 text-xl">Buttons</h2>

          <div className="flex gap-8">
            {/*primary*/}
            <div className="ml-2">
              <h2 className="my-2 text-lg">Primary</h2>
              <Button
                onClick={() => null}
                text="Button"
                color="primary"
                depth="sm"
                type="button"
                isLoading={false}
                disabled={false}
              />
              <h2 className="my-2 text-lg">Loading</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="primary"
                depth="sm"
                type="button"
                isLoading={true}
                disabled={false}
              />
              <h2 className="my-2 text-lg">Disabled</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="primary"
                depth="sm"
                type="button"
                isLoading={false}
                disabled={true}
              />
              <h2 className="my-2 text-lg">Disabled + Loading</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Primary"
                color="primary"
                depth="sm"
                type="button"
                isLoading={true}
                disabled={true}
              />
            </div>
            {/*secondary*/}
            <div className="ml-2">
              <h2 className="my-2 text-lg">Secondary</h2>
              <Button
                onClick={() => null}
                text="Button"
                color="secondary"
                depth="sm"
                type="button"
                isLoading={false}
                disabled={false}
              />
              <h2 className="my-2 text-lg">Loading</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="secondary"
                depth="sm"
                type="button"
                isLoading={true}
                disabled={false}
              />
              <h2 className="my-2 text-lg">Disabled</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="secondary"
                depth="sm"
                type="button"
                isLoading={false}
                disabled={true}
              />
              <h2 className="my-2 text-lg">Disabled + Loading</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="secondary"
                depth="sm"
                type="button"
                isLoading={true}
                disabled={true}
              />
            </div>
            {/*dark*/}
            <div className="ml-2">
              <h2 className="my-2 text-lg">Dark</h2>
              <Button
                onClick={() => null}
                text="Button"
                color="dark"
                depth="sm"
                type="button"
                isLoading={false}
                disabled={false}
              />
              <h2 className="my-2 text-lg">Loading</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="dark"
                depth="sm"
                type="button"
                isLoading={true}
                disabled={false}
              />
              <h2 className="my-2 text-lg">Disabled</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="dark"
                depth="sm"
                type="button"
                isLoading={false}
                disabled={true}
              />
              <h2 className="my-2 text-lg">Disabled + Loading</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="dark"
                depth="sm"
                type="button"
                isLoading={true}
                disabled={true}
              />
            </div>
            {/*error*/}
            <div className="ml-2">
              <h2 className="my-2 text-lg">Error</h2>
              <Button
                onClick={() => null}
                text="Button"
                color="error"
                depth="sm"
                type="button"
                isLoading={false}
                disabled={false}
              />
              <h2 className="my-2 text-lg">Loading</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="error"
                depth="sm"
                type="button"
                isLoading={true}
                disabled={false}
              />
              <h2 className="my-2 text-lg">Disabled</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="error"
                depth="sm"
                type="button"
                isLoading={false}
                disabled={true}
              />
              <h2 className="my-2 text-lg">Disabled + Loading</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="error"
                depth="sm"
                type="button"
                isLoading={true}
                disabled={true}
              />
            </div>

            {/*warning*/}
            <div className="ml-2">
              <h2 className="my-2 text-lg">Warning</h2>
              <Button
                onClick={() => null}
                text="Button"
                color="warning"
                depth="sm"
                type="button"
                isLoading={false}
                disabled={false}
              />
              <h2 className="my-2 text-lg">Loading</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="warning"
                depth="sm"
                type="button"
                isLoading={true}
                disabled={false}
              />
              <h2 className="my-2 text-lg">Disabled</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="warning"
                depth="sm"
                type="button"
                isLoading={false}
                disabled={true}
              />
              <h2 className="my-2 text-lg">Disabled + Loading</h2>
              <Button
                onClick={(_e) => console.log('here')}
                text="Button"
                color="warning"
                depth="sm"
                type="button"
                isLoading={true}
                disabled={true}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-x-8 p-2">
            {/*default*/}
            <div>
              <h2 className="my-2 text-lg">Default</h2>
              <Button
                onClick={() => null}
                text="Button"
                type="button"
                isLoading={false}
                disabled={false}
              />
            </div>
            {/*depth sm*/}
            <div>
              <h2 className="my-2 text-lg">Depth SM</h2>
              <Button
                onClick={() => null}
                text="Button"
                type="button"
                depth="sm"
                isLoading={false}
                disabled={false}
              />
            </div>
            {/*depth lg*/}
            <div>
              <h2 className="my-2 text-lg">Depth LG</h2>
              <Button
                onClick={() => null}
                text="Button"
                type="button"
                depth="lg"
                isLoading={false}
                disabled={false}
              />
            </div>
            {/*rounded sm*/}
            <div>
              <h2 className="my-2 text-lg">Rounded SM</h2>
              <Button
                onClick={() => null}
                text="Button"
                type="button"
                rounded="sm"
                isLoading={false}
                disabled={false}
              />
            </div>
            {/*rounded md*/}
            <div>
              <h2 className="my-2 text-lg">Rounded MD</h2>
              <Button
                onClick={() => null}
                text="Button"
                type="button"
                rounded="md"
                isLoading={false}
                disabled={false}
              />
            </div>
            {/*rounded lg*/}
            <div>
              <h2 className="my-2 text-lg">Rounded lg</h2>
              <Button
                onClick={() => null}
                text="Button"
                type="button"
                rounded="lg"
                isLoading={false}
                disabled={false}
              />
            </div>
            {/*size xs*/}
            <div>
              <h2 className="my-2 text-lg">Size XS</h2>
              <Button
                onClick={() => null}
                text="Button"
                type="button"
                size="xs"
                isLoading={false}
                disabled={false}
              />
            </div>
            {/*size sm*/}
            <div>
              <h2 className="my-2 text-lg">Size SM</h2>
              <Button
                onClick={() => null}
                text="Button"
                type="button"
                size="sm"
                isLoading={false}
                disabled={false}
              />
            </div>
            {/*size md*/}
            <div>
              <h2 className="my-2 text-lg">Size MD</h2>
              <Button
                onClick={() => null}
                text="Button"
                type="button"
                size="md"
                isLoading={false}
                disabled={false}
              />
            </div>
            {/*size lg*/}
            <div>
              <h2 className="my-2 text-lg">Size LG</h2>
              <Button
                onClick={() => null}
                text="Button"
                type="button"
                size="lg"
                isLoading={false}
                disabled={false}
              />
            </div>
            {/*icon left*/}
            <div>
              <h2 className="my-2 text-lg">Icon left</h2>
              <Button
                onClick={() => null}
                text="Button"
                type="button"
                isLoading={false}
                disabled={false}
                iconPosition="left"
                icon={<FontAwesomeIcon icon={faRadio} />}
              />
            </div>
            {/*icon right*/}
            <div>
              <h2 className="my-2 text-lg">Icon Right</h2>
              <Button
                onClick={() => null}
                text="Button"
                type="button"
                isLoading={false}
                disabled={false}
                iconPosition="right"
                icon={<FontAwesomeIcon icon={faReceipt} />}
              />
            </div>
          </div>
        </div>

        {/*Toasts*/}
        <div className="p-2">
          <h2 className="my-2 text-xl">Toasts</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              text="Success toast"
              onClick={() =>
                toast.success(<ToastContent text={'Messsage'} type="success" />)
              }
            />
            <Button
              text="Error toast"
              onClick={() =>
                toast.error(<ToastContent text={'Messsage'} type="error" />)
              }
            />
            <Button
              text="Loading toast"
              onClick={() =>
                toast.loading(
                  <ToastContent text={'Messsage'} type="loading" />,
                  {
                    duration: 1000,
                  }
                )
              }
            />
            <Button
              text="Promise success"
              onClick={() =>
                toast.promise(
                  new Promise((resolve) => {
                    setTimeout(() => resolve(null), 1000)
                  }),
                  {
                    error: <ToastContent text={'Message error'} type="error" />,
                    loading: <ToastContent text={'Message..'} type="loading" />,
                    success: (
                      <ToastContent text={'Message success'} type="success" />
                    ),
                  }
                )
              }
            />
            <Button
              text="Promise error"
              onClick={() =>
                toast.promise(
                  new Promise((_resolve, reject) => {
                    setTimeout(() => reject(null), 1000)
                  }),
                  {
                    error: <ToastContent text={'Message error'} type="error" />,
                    loading: <ToastContent text={'Message..'} type="loading" />,
                    success: (
                      <ToastContent text={'Message success'} type="success" />
                    ),
                  }
                )
              }
            />
          </div>
        </div>

        {/*Inputs*/}
        <div className="p-2">
          <h2 className="my-2 text-xl">Inputs</h2>
          <FormWrapper<IForm>
            className="flex w-96 flex-col gap-2"
            formMethods={formMethods}
            mode={FormType.editOnly}
            onSubmit={submitForm}
            loading={isLoadingFormSubmit}
          >
            <Field<IForm>
              name="text"
              type={FieldType.text}
              validation={{
                required: 'Text is required',
              }}
            />
            <Field<IForm>
              name="date"
              type={FieldType.date}
              validation={{
                required: true,
              }}
              placeholder={'date'}
            />
            <Field<IForm>
              name="email"
              type={FieldType.email}
              validation={{
                required: true,
              }}
              disabled={true}
            />
            <Field<IForm>
              name="number"
              type={FieldType.number}
              validation={{
                required: true,
                min: {
                  value: 0,
                  message: 'Min value 1',
                },
              }}
              placeholder="number"
            />
          </FormWrapper>
        </div>
      </div>
    </>
  )
}

export default UiExamplesPage
