import { ReactElement } from 'react'

import { Status, Wrapper } from '@googlemaps/react-wrapper'
import { Spinner } from '@ui'
import { H3 } from '@ui/Typography'
import { AllMarkers } from 'types/graphql'

import { MetaTags, useQuery } from '@redwoodjs/web'

import { renderer as clustererRenderer } from 'src/components/map/Clusterer'
import Map from 'src/components/map/Map'

export const MARKERS_QUERY = gql`
  query AllMarkers {
    markers {
      id
      lat
      lng
    }
  }
`

const renderMap = (status: Status): ReactElement => {
  if (status === Status.FAILURE) return <>Error</>
  return <Spinner />
}

const HomePage = () => {
  const { data: markersData } = useQuery<AllMarkers>(MARKERS_QUERY)

  const [zoom, setZoom] = React.useState(7) // initial zoom
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
    lat: 49,
    lng: 32,
  })

  const onIdle = (m: google.maps.Map) => {
    setZoom(m.getZoom())
    setCenter(m.getCenter().toJSON())
  }

  return (
    <>
      <MetaTags title="Перегляд карти" description="Map page" />

      <H3 className="mx-6 mt-4">Перегляд усіх міток</H3>
      <div className="h-[90vh] w-screen p-4">
        <Wrapper apiKey={process.env.GOOGLE_MAP_KEY} render={renderMap}>
          <Map
            center={center}
            onIdle={onIdle}
            zoom={zoom}
            style={{
              flexGrow: '1',
              height: '100%',
              width: '100%',
            }}
            minZoom={4}
            fullscreenControl={false}
            clustererRenderer={clustererRenderer}
            markers={markersData?.markers || []}
          />
        </Wrapper>
      </div>
    </>
  )
}

export default HomePage
