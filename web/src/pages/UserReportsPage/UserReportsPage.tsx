import { ReactElement, useEffect, useState } from 'react'

import { Status, Wrapper } from '@googlemaps/react-wrapper'
import { Button, Dialog, Spinner } from '@ui'
import { H4 } from '@ui/Typography'
import { GetMarkers, GetMarkersVariables, Marker } from 'types/graphql'

import { navigate, routes, useParams } from '@redwoodjs/router'
import { MetaTags, useQuery } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import LikeUnlikeButtons from 'src/components/LikeUnlikeButtons/LikeUnlikeButtons'
import { renderer as clustererRenderer } from 'src/components/map/Clusterer'
import Map from 'src/components/map/Map'
import { MARKERS_QUERY } from 'src/pages/HomePage/HomePage'

const renderMap = (status: Status): ReactElement => {
  if (status === Status.FAILURE) return <>Error</>
  return <Spinner />
}

const HomePaUserReportsPagege = () => {
  const { id: problemId } = useParams()
  const { currentUser } = useAuth()

  const { data: markersData } = useQuery<GetMarkers>(MARKERS_QUERY, {
    variables: {
      userId: currentUser?.id,
    } as GetMarkersVariables,
  })

  const [zoom, setZoom] = React.useState(7) // initial zoom
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
    lat: 49,
    lng: 32,
  })

  const [dialogOpen, setDialogOpen] = useState(false)
  const [markerToDisplayInfoId, setMarkerToDisplayInfo] = useState<string>(null)
  const markerToDisplayInfo: Marker =
    (markerToDisplayInfoId &&
      (markersData?.markers?.find(
        (el) => el.id === markerToDisplayInfoId
      ) as Marker)) ||
    null

  const [currentMarker, setCurrentMarker] =
    useState<GetMarkers['markers'][number]>(null)

  useEffect(() => {
    if (problemId) {
      const m = markersData?.markers?.find((m) => m?.problem?.id === problemId)
      setCurrentMarker(m || null)
    } else {
      setCurrentMarker(null)
    }
  }, [problemId, markersData])

  const onIdle = (m: google.maps.Map) => {
    setZoom(m.getZoom())
    setCenter(m.getCenter().toJSON())
  }

  const resetProblemIdQueryParameter = () => {
    navigate(routes.userReports())
  }

  return (
    <>
      <MetaTags title="Мої мітки" description="My map page" />

      <div className="flex items-center">
        <H4 className="mx-6 mt-4">
          {currentMarker
            ? `Перегляд мітки ${currentMarker.problem?.title || ''} `
            : 'Перегляд моїх міток'}{' '}
        </H4>

        {currentMarker && (
          <div className="mt-3">
            <Button
              text="Переглянути усі мої мітки"
              color="secondary"
              type="button"
              onClick={resetProblemIdQueryParameter}
            />
          </div>
        )}
      </div>
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
              (currentMarker ? [currentMarker] : markersData?.markers)?.map(
                (marker) => ({
                  lng: marker.lng,
                  lat: marker.lat,
                  withContent: true,
                  onClick: () => {
                    setDialogOpen(true)
                    setMarkerToDisplayInfo(marker.id)
                  },
                })
              ) || []
            }
          />
        </Wrapper>
      </div>
    </>
  )
}

export default HomePaUserReportsPagege
