import { ReactElement, useState } from 'react'

import { Status, Wrapper } from '@googlemaps/react-wrapper'
import { Dialog, Spinner } from '@ui'
import { H4 } from '@ui/Typography'
import { AllMarkers, Marker } from 'types/graphql'

import { MetaTags, useQuery } from '@redwoodjs/web'

import LikeUnlikeButtons from 'src/components/LikeUnlikeButtons/LikeUnlikeButtons'
import { renderer as clustererRenderer } from 'src/components/map/Clusterer'
import Map from 'src/components/map/Map'

export const MARKERS_QUERY = gql`
  query AllMarkers {
    markers {
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
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        afterModalClose={() => setMarkerToDisplayInfo(null)}
      >
        <div>
          <H4>{markerToDisplayInfo?.problem.title}</H4>
          <div className="text-md font-light">
            <p>
              <b>Автор: </b>
              {markerToDisplayInfo?.user.name}
            </p>
            <p>
              <b>Категорія: </b>
              {markerToDisplayInfo?.problem.category.name}
            </p>
            <p>
              <b>Проблема: </b>
              {markerToDisplayInfo?.problem.description}
            </p>
          </div>
          <div className="mt-2 ml-auto mr-2 w-20">
            <LikeUnlikeButtons
              votes={markerToDisplayInfo?.problem?.votes}
              problemId={markerToDisplayInfo?.problem?.id}
            />
          </div>
        </div>
      </Dialog>
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
