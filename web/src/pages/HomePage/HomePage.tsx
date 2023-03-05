import { ReactElement, useState } from 'react'

import { Status, Wrapper } from '@googlemaps/react-wrapper'
import { Spinner } from '@ui'
import { H4 } from '@ui/Typography'
import { GetMarkers, Marker } from 'types/graphql'

import { MetaTags, useQuery } from '@redwoodjs/web'

import { renderer as clustererRenderer } from 'src/components/map/Clusterer'
import Map from 'src/components/map/Map'
import MarkerInfoDialog from 'src/components/map/MarkerInfoDialog/MarkerInfoDialog'

export const MARKERS_QUERY = gql`
  query GetMarkers($userId: String) {
    markers(userId: $userId) {
      id
      lat
      lng
      user {
        id
        name
      }
      problem {
        id
        category {
          name
        }
        title
        description
        status
        votes {
          id
          upvote
          user {
            email
          }
        }
      }
    }
  }
`

const renderMap = (status: Status): ReactElement => {
  if (status === Status.FAILURE) return <>Error</>
  return <Spinner />
}

const HomePage = () => {
  const { data: markersData } = useQuery<GetMarkers>(MARKERS_QUERY)

  const [zoom, setZoom] = React.useState(7) // initial zoom
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
    lat: 49,
    lng: 32,
  })

  const onIdle = (m: google.maps.Map) => {
    setZoom(m.getZoom())
    setCenter(m.getCenter().toJSON())
  }

  const [dialogOpen, setDialogOpen] = useState(false)
  const [markerToDisplayInfoId, setMarkerToDisplayInfo] = useState<string>(null)
  const markerToDisplayInfo: Marker =
    (markerToDisplayInfoId &&
      (markersData?.markers?.find(
        (el) => el.id === markerToDisplayInfoId
      ) as Marker)) ||
    null
  return (
    <>
      <MetaTags title="Перегляд карти" description="Map page" />

      <H4 className="mx-6 mt-4">Перегляд усіх міток</H4>
      <MarkerInfoDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        afterModalClose={() => setMarkerToDisplayInfo(null)}
        marker={markerToDisplayInfo}
      />
      <div className="w-5xl h-[90vh] p-4">
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
            markers={
              markersData?.markers.map((marker) => ({
                lng: marker.lng,
                lat: marker.lat,
                withContent: true,
                onClick: () => {
                  setDialogOpen(true)
                  setMarkerToDisplayInfo(marker.id)
                },
              })) || []
            }
          />
        </Wrapper>
      </div>
    </>
  )
}

export default HomePage
