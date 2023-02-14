import { ReactElement, useEffect, useState } from 'react'

import { faRadio, faReceipt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Status, Wrapper } from '@googlemaps/react-wrapper'
import {
  Form,
  Disclosure,
  Button,
  ToastContent,
  ConfirmationDialog,
  Dialog,
  Popover,
  SlideModal,
  Spinner,
} from '@ui'
import { FieldType, FormType } from '@ui/enums'
import { OptionTypeValue } from '@ui/types'
import { H1, H2, H3, H4, H5, H6, H7 } from '@ui/Typography'

import { useForm } from '@redwoodjs/forms'
import { MetaTags } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { renderer as clustererRenderer } from 'src/components/map/Clusterer'
import Map from 'src/components/map/Map'

type IForm = {
  text: string
  date: any
  number: number
  email: string
  textarea: string
  select: OptionTypeValue
  selmulti: OptionTypeValue[]
  checkbox: boolean
  radio: string
  toggle: boolean
  file: string
  filename: string
  time: string
}

const options = [
  {
    value: '1',
    label: 'Label 1',
  },
  {
    value: '2',
    label: 'Label 2',
  },
  {
    value: '3',
    label: 'Label 3',
  },
  {
    value: '4',
    label: 'Label 4',
  },
]

//
// interface MapProps extends google.maps.MapOptions {
//   style: { [key: string]: string }
//   onClick?: (e: google.maps.MapMouseEvent) => void
//   onIdle?: (map: google.maps.Map) => void
//   marks?: google.maps.LatLng[]
// }

// const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const locations = [
  { lat: -31.56391, lng: 147.154312 },
  { lat: -33.718234, lng: 150.363181 },
  { lat: -33.727111, lng: 150.371124 },
  { lat: -33.848588, lng: 151.209834 },
  { lat: -33.851702, lng: 151.216968 },
  { lat: -34.671264, lng: 150.863657 },
  { lat: -35.304724, lng: 148.662905 },
  { lat: -36.817685, lng: 175.699196 },
  { lat: -36.828611, lng: 175.790222 },
  { lat: -37.75, lng: 145.116667 },
  { lat: -37.759859, lng: 145.128708 },
  { lat: -37.765015, lng: 145.133858 },
  { lat: -37.770104, lng: 145.143299 },
  { lat: -37.7737, lng: 145.145187 },
  { lat: -37.774785, lng: 145.137978 },
  { lat: -37.819616, lng: 144.968119 },
  { lat: -38.330766, lng: 144.695692 },
  { lat: -39.927193, lng: 175.053218 },
  { lat: -41.330162, lng: 174.865694 },
  { lat: -42.734358, lng: 147.439506 },
  { lat: -42.734358, lng: 147.501315 },
  { lat: -42.735258, lng: 147.438 },
  { lat: -43.999792, lng: 170.463352 },
]

//

const UiExamplesPage = () => {
  const formMethods = useForm<IForm>({
    defaultValues: {
      text: '',
      date: undefined,
      number: undefined,
      email: '',
      textarea: '',
      select: undefined,
      selmulti: [],
      checkbox: undefined,
      radio: undefined,
      toggle: undefined,
      file: undefined,
      filename: '',
      time: undefined,
    },
  })

  const [isLoadingFormSubmit, setIsLoadingFormSubmit] = useState(false)
  const [loadingOptions, setLoadingOptions] = useState(null)
  const [isPrimaryConfirmModal, setIsPrimaryConfirmModal] = useState(false)
  const [isErrorConfirmModal, setIsErrorConfirmModal] = useState(false)
  const [isWarningConfirmModal, setIsWarningConfirmModal] = useState(false)
  const [isDialog, setIsDialog] = useState(false)
  const [isSlideModal, setIsSlideModal] = useState(false)

  useEffect(() => {
    setLoadingOptions(true)
    setTimeout(() => {
      setLoadingOptions(false)
    }, 1500)
  }, [])

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

  // const [clicks, setClicks] = React.useState<google.maps.LatLng[]>(
  const [clicks, setClicks] = React.useState<{ lat: number; lng: number }[]>(
    locations
    // .map(
    //   (l) =>
    //     new google.maps.LatLng({
    //       lat: l.lat,
    //       lng: l.lng,
    //     })
    // )
  )
  const [zoom, setZoom] = React.useState(4) // initial zoom
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
    lat: -39.927193,
    lng: 175.053218,
  })

  // const infoWindow = new google.maps.InfoWindow({
  //   content: '',
  //   disableAutoPan: true,
  // })

  // Add a marker clusterer to manage the markers.
  // renderer: renderer,

  const onClick = (e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
    console.log(e)
    setClicks([...clicks, { lat: e.latLng.lat(), lng: e.latLng.lng() }])
  }

  const onIdle = (m: google.maps.Map) => {
    console.log('onIdle')
    setZoom(m.getZoom())
    setCenter(m.getCenter().toJSON())
  }

  const form = (
    <div
      style={{
        padding: '1rem',
        flexBasis: '250px',
        height: '100%',
        overflow: 'auto',
      }}
    >
      <label htmlFor="zoom">Zoom</label>
      <input
        type="number"
        id="zoom"
        name="zoom"
        value={zoom}
        onChange={(event) => setZoom(Number(event.target.value))}
      />
      <br />
      <label htmlFor="lat">Latitude</label>
      <input
        type="number"
        id="lat"
        name="lat"
        value={center.lat}
        onChange={(event) =>
          setCenter({ ...center, lat: Number(event.target.value) })
        }
      />
      <br />
      <label htmlFor="lng">Longitude</label>
      <input
        type="number"
        id="lng"
        name="lng"
        value={center.lng}
        onChange={(event) =>
          setCenter({ ...center, lng: Number(event.target.value) })
        }
      />
      <h3>{clicks.length === 0 ? 'Click on map to add markers' : 'Clicks'}</h3>
      {clicks.map((latLng, i) => (
        <pre key={i}>{JSON.stringify(latLng, null, 2)}</pre>
      ))}
      <button onClick={() => setClicks([])}>Clear</button>
    </div>
  )

  const renderMap = (status: Status): ReactElement => {
    if (status === Status.FAILURE) return <>Error</>
    return <Spinner />
  }

  return (
    <>
      <MetaTags title="UI Examples" description="UI Examples page" />

      <div className="w-full max-w-screen-sm p-4 sm:max-w-none">
        <h1 className="text-2xl">UI Examples Page</h1>

        <div className=" p-2">
          <h2 className="my-2  text-xl">Map</h2>
          <Wrapper
            apiKey={'AIzaSyAZXF1oEsjFv1ox3UIbIh6UMdPRLQ4LKTY'}
            render={renderMap}
          >
            <Map
              center={center}
              onClick={onClick}
              onIdle={onIdle}
              zoom={zoom}
              style={{ flexGrow: '1', height: '800px', width: '100%' }}
              fullscreenControl={false}
              clustererRenderer={clustererRenderer}
              marks={clicks}
            />
          </Wrapper>
        </div>
        {form}

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

          <div className="flex flex-wrap gap-8">
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

        {/*Dialog*/}
        <div className="p-2">
          <h2 className="my-2 text-xl">Dialogs</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              text="Primary confirm"
              onClick={() => setIsPrimaryConfirmModal(true)}
            />
            <ConfirmationDialog
              header="Header primary"
              text="Primary confirm"
              type="primary"
              confirm={() => setIsPrimaryConfirmModal(false)}
              close={() => setIsPrimaryConfirmModal(false)}
              isOpen={isPrimaryConfirmModal}
            />
            <Button
              text="Warning confirm"
              onClick={() => setIsWarningConfirmModal(true)}
              color="warning"
            />
            <ConfirmationDialog
              header="Header primary"
              text="Warning confirm"
              type="warning"
              confirm={() => setIsWarningConfirmModal(false)}
              close={() => setIsWarningConfirmModal(false)}
              isOpen={isWarningConfirmModal}
            />
            <Button
              text="Error confirm"
              color="error"
              onClick={() => setIsErrorConfirmModal(true)}
            />
            <ConfirmationDialog
              header="Header error"
              text="Error confirm"
              type="error"
              confirm={() => setIsErrorConfirmModal(false)}
              close={() => setIsErrorConfirmModal(false)}
              isOpen={isErrorConfirmModal}
            />
            <Button text="Dialog" onClick={() => setIsDialog(true)} />
            <Dialog
              open={isDialog}
              onClose={() => {
                setIsDialog(false)
                console.log('here close dialog')
              }}
            >
              Hello anything
            </Dialog>
          </div>
        </div>

        {/* Slide Modal*/}
        <div className="p-2">
          <h2
            className="text-xm my-2 w-fit cursor-pointer rounded-lg border-[1px] border-primary p-2"
            onClick={() => setIsSlideModal(true)}
          >
            Slide Modal
          </h2>
          <SlideModal
            open={isSlideModal}
            setClosed={() => setIsSlideModal(false)}
            title="Title"
          >
            <>Content</>
          </SlideModal>
        </div>

        {/* Disclosure */}
        <div className="p-2">
          <h2 className="text-xm my-2">Disclosure</h2>
          <Disclosure
            onClickToClose={() => {
              console.log('onClickToClose')
            }}
            onClickToOpen={() => {
              console.log('onClickToOpen')
            }}
            title={'Disclosure'}
            buttonTextColor="text-primary"
            buttonFontSize="text-md"
            buttonFontWeight="font-semibold"
          >
            <>Some children</>
          </Disclosure>
        </div>

        {/* Popover */}
        <div className="p-2">
          <h2 className="my-2 text-xl">Popover</h2>
          <Popover title="Popover" onOpen={() => console.log('Popover opened')}>
            {({ close }) => (
              <>
                <H5>Hello</H5>

                <Button onClick={close} text="Close" color="dark" />
              </>
            )}
          </Popover>
        </div>

        {/*Inputs*/}
        <div className="p-2">
          <h2 className="my-2 text-xl">Inputs</h2>
          <Form.Wrapper<IForm>
            className="flex w-96 flex-col gap-2"
            formMethods={formMethods}
            mode={FormType.editOnly}
            onSubmit={submitForm}
            loading={isLoadingFormSubmit}
          >
            <Form.Field<IForm>
              name="text"
              type={FieldType.text}
              validation={{
                required: 'Text is required',
              }}
              icon={faRadio}
            />
            <Form.Field<IForm>
              name="textarea"
              type={FieldType.textarea}
              validation={{
                required: 'Textarea is required',
              }}
              icon={faRadio}
            />
            <Form.Field<IForm>
              name="date"
              type={FieldType.date}
              validation={{
                required: true,
              }}
              placeholder={'date'}
              maxDate={new Date()}
              icon={faRadio}
            />
            <Form.Field<IForm>
              name="email"
              type={FieldType.email}
              validation={{
                required: true,
              }}
              icon={faRadio}
            />
            <Form.Field<IForm>
              name="number"
              type={FieldType.number}
              validation={{
                required: true,
                min: {
                  value: 1,
                  message: 'Min value 1',
                },
                max: {
                  value: 100,
                  message: 'Max value 100',
                },
              }}
              placeholder="number"
              icon={faRadio}
            />
            <Form.Field<IForm>
              name="select"
              type={FieldType.select}
              validation={{
                required: true,
              }}
              placeholder="select"
              options={options}
              loading={loadingOptions}
            />
            <Form.Field<IForm>
              name="selmulti"
              type={FieldType.select}
              isMulti
              validation={{
                required: true,
              }}
              placeholder="select"
              options={options}
            />
            <Form.Field<IForm>
              name="checkbox"
              type={FieldType.checkbox}
              validation={{
                required: 'chec is required',
              }}
              label="Checkobx"
            />
            <Form.Field<IForm>
              name="radio"
              type={FieldType.radio}
              options={options}
              validation={{
                required: true,
              }}
            />
            <Form.Field<IForm>
              name="toggle"
              type={FieldType.toggle}
              text="Yes"
              leftText="No"
            />
            <Form.Field<IForm>
              name="file"
              validation={{ required: true }}
              type={FieldType.file}
              filenamePath="filename"
            />
            <Form.Field<IForm>
              name="time"
              validation={{
                required: true,
                max: {
                  value: '22:00',
                  message: 'Max value 22:00',
                },
              }}
              type={FieldType.time}
            />
          </Form.Wrapper>
        </div>
      </div>
    </>
  )
}

export default UiExamplesPage
