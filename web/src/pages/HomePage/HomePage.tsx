import { ReactElement, useEffect, useState } from 'react'

import { faFilter } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Status, Wrapper } from '@googlemaps/react-wrapper'
import { Button, Spinner } from '@ui'
import { FieldType } from '@ui/enums'
import { ITableFilters, TableFilters } from '@ui/Table/Table'
import { H4 } from '@ui/Typography'
import { useTranslation } from 'react-i18next'
import {
  GetCategoriesAsOptions,
  GetKeywordsAsOptions,
  GetMarkers,
  GetMarkersVariables,
  Marker,
} from 'types/graphql'

import { navigate, routes, useParams } from '@redwoodjs/router'
import { MetaTags, useQuery } from '@redwoodjs/web'

import { GET_CATEGORIES_AS_OPTIONS } from 'src/components/Categories/Categories.graphql'
import { GET_KEYWORDS_AS_OPTIONS } from 'src/components/Keywords/Keywords.graphql'
import { renderer as clustererRenderer } from 'src/components/map/Clusterer'
import Map from 'src/components/map/Map'
import MarkerInfoDialog from 'src/components/map/MarkerInfoDialog/MarkerInfoDialog'
import { ProblemStatus } from 'src/constants/problem'
import { getLanguageLocaleFromLocalStorage } from 'src/hooks/useLanguageLocaleStorage'
import { TranslationKeys } from 'src/i18n'

export const MARKERS_FRAGMENT = gql`
  fragment MarkersFragment on Marker {
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
      images {
        id
        path
      }
      keywords {
        id
        title
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
      severity
      comments {
        id
        createdAt
        content
        user {
          id
          email
          name
        }
      }
    }
  }
`

export const MARKERS_QUERY = gql`
  ${MARKERS_FRAGMENT}
  query GetMarkers($userId: String, $filters: ProblemsFilters) {
    markers(userId: $userId, filters: $filters) {
      ...MarkersFragment
    }
  }
`

const renderMap = (status: Status): ReactElement => {
  if (status === Status.FAILURE) return <>Error</>
  return <Spinner />
}

const HomePage = () => {
  const { id: problemId } = useParams()

  const { data: markersData, refetch } = useQuery<GetMarkers>(MARKERS_QUERY)

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

  const { t } = useTranslation()

  const [currentMarker, setCurrentMarker] =
    useState<GetMarkers['markers'][number]>(null)

  const resetProblemIdQueryParameter = () => {
    navigate(routes.home())
  }

  useEffect(() => {
    if (problemId) {
      const m = markersData?.markers?.find((m) => m?.problem?.id === problemId)
      setCurrentMarker(m || null)
    } else {
      setCurrentMarker(null)
    }
  }, [problemId, markersData])

  const statusOptions = Object.values(ProblemStatus).map((ps) => ({
    value: ps,
    label: t(TranslationKeys[ps]),
  }))

  const { data: categoriesOptionsData, loading: loadingCategoriesData } =
    useQuery<GetCategoriesAsOptions>(GET_CATEGORIES_AS_OPTIONS)
  const categoriesOptions = categoriesOptionsData?.options || []

  const { data: keywordsOptionsData, loading: loadingKeywordsData } =
    useQuery<GetKeywordsAsOptions>(GET_KEYWORDS_AS_OPTIONS)
  const keywordsOptions = keywordsOptionsData?.options || []

  const tableFilters: ITableFilters = [
    {
      name: 'status',
      label: t(TranslationKeys.status),
      options: statusOptions,
      type: FieldType.select,
      placeholder: t(TranslationKeys.status),
    },
    {
      name: 'severity',
      label: t(TranslationKeys.severity),
      type: FieldType.number,
      min: { value: 1, message: `${t(TranslationKeys.min_value)} 1` },
      max: { value: 10, message: `${t(TranslationKeys.max_value)} 10` },
      placeholder: t(TranslationKeys.severity),
    },
    {
      name: 'category',
      label: t(TranslationKeys.category),
      options: categoriesOptions,
      loading: loadingCategoriesData,
      type: FieldType.select,
      placeholder: t(TranslationKeys.category),
    },
    {
      name: 'keywords',
      label: t(TranslationKeys.key_words),
      options: keywordsOptions,
      loading: loadingKeywordsData,
      type: FieldType.select,
      isMulti: true,
      placeholder: t(TranslationKeys.key_words),
    },
  ]

  const [filters, setFilters] = useState(undefined)
  const refetchWithFilters = (filters: any) => {
    setFilters(filters)
    refetch({
      filters: {
        ...filters,
      },
    } as GetMarkersVariables)
  }

  const refetchWithoutFilters = () => {
    setFilters(undefined)
    refetch({
      filters: undefined,
    } as GetMarkersVariables)
  }
  const [isOpenFilters, setIsOpenFilters] = useState(false)

  return (
    <>
      <MetaTags title={t(TranslationKeys.view_map)} description="Map page" />

      <div className="flex items-center">
        <H4 className="mx-6 mt-4">
          {currentMarker
            ? `${t(TranslationKeys.view_marker)} ${
                currentMarker.problem?.title || ''
              } `
            : t(TranslationKeys.view_all_markers)}{' '}
        </H4>

        {currentMarker ? (
          <div className="mt-3">
            <Button
              text={t(TranslationKeys.go_view_all_markers)}
              color="secondary"
              type="button"
              onClick={resetProblemIdQueryParameter}
            />
          </div>
        ) : (
          <FontAwesomeIcon
            icon={faFilter}
            className="mb-2 block cursor-pointer text-gray-500"
            onClick={() => setIsOpenFilters(true)}
          />
        )}
      </div>

      <MarkerInfoDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        afterModalClose={() => setMarkerToDisplayInfo(null)}
        marker={markerToDisplayInfo}
        filtersForRefetch={filters}
      />
      <TableFilters
        filters={tableFilters}
        refetchWithFilters={refetchWithFilters}
        refetchWithoutFilters={refetchWithoutFilters}
        isOpen={isOpenFilters}
        setIsOpen={setIsOpenFilters}
      />

      <div className="w-5xl h-[90vh] p-4">
        <Wrapper
          apiKey={process.env.GOOGLE_MAP_KEY}
          render={renderMap}
          language={getLanguageLocaleFromLocalStorage()}
        >
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

export default HomePage
