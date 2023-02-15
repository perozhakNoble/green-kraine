import { useEffect, useState } from 'react'

import {
  MarkerClusterer,
  Renderer as ClustererRenderer,
} from '@googlemaps/markerclusterer'
import { createCustomEqual } from 'fast-equals'

import Marker from 'src/components/map/Marker'

const deepCompareEqualsForMaps = createCustomEqual(
  // @ts-ignore
  (deepEqual) => (a: any, b: any) => {
    if (a instanceof google.maps.LatLng || b instanceof google.maps.LatLng) {
      return new google.maps.LatLng(a).equals(new google.maps.LatLng(b))
    }

    // TODO extend to other types

    // use fast-equals for other objects
    // @ts-ignore
    return deepEqual(a, b)
  }
)

function useDeepCompareMemoize(value: any) {
  const ref = React.useRef()

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value
  }

  return ref.current
}

function useDeepCompareEffectForMaps(
  callback: React.EffectCallback,
  dependencies: any[]
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(callback, dependencies.map(useDeepCompareMemoize))
}

interface MapProps extends google.maps.MapOptions {
  style: { [key: string]: string }
  onClick?: (e: google.maps.MapMouseEvent) => void
  onIdle?: (map: google.maps.Map) => void
  markers: {
    lat: number
    lng: number
    isPending?: boolean
    isNew?: boolean
  }[]
  clustererRenderer?: ClustererRenderer
}

const getMarkerOptions = ({
  isPending,
  isNew,
  // eslint-disable-next-line
  ...position
}: {
  isPending?: boolean
  isNew?: boolean
  lat: number
  lng: number
}): google.maps.MarkerOptions => {
  return {
    // draggable: isPending,
    clickable: !isPending && !isNew,
    animation: isPending && google.maps.Animation.BOUNCE,
  }
}

const Map: React.FC<MapProps> = ({
  onClick,
  onIdle,
  style,
  markers: markersFromProps,
  clustererRenderer,
  ...options
}) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const [infoWindow] = React.useState(
    new google.maps.InfoWindow({
      content: '',
      disableAutoPan: true,
    })
  )

  const [map, setMap] = React.useState<google.maps.Map>()

  // Create an array of alphabetical characters used to label the markers.

  const [clusterer, setClusterer] = useState<MarkerClusterer>(null)
  const [markers, setMarkers] = useState([])

  useEffect(() => {
    if (clustererRenderer) {
      setClusterer(
        new MarkerClusterer({
          markers,
          renderer: clustererRenderer,
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clustererRenderer])

  React.useEffect(() => {
    if (ref.current && !map) {
      const mp = new window.google.maps.Map(ref.current, {})
      setMap(mp)
    }
  }, [ref, map])

  React.useEffect(() => {
    if (map && clusterer) {
      clusterer.setMap(map)
    }
  }, [map, clusterer])

  React.useEffect(() => {
    if (markers && clusterer) {
      clusterer.clearMarkers()
      clusterer.addMarkers(markers)
    }
  }, [clusterer, markers])

  React.useEffect(() => {
    if (markersFromProps) {
      setMarkers(
        markersFromProps.map(
          ({ isPending, isNew, ...position }): google.maps.Marker => {
            const marker = new google.maps.Marker({
              position,
              ...getMarkerOptions({ isPending, isNew, ...position }),
            })

            const cont = 'cont'
            // markers can only be keyboard focusable when they have click listeners
            // open info window when marker is clicked

            // marker.addListener('dragend', (e: google.maps.) => {
            //   console.log(e.)
            // })

            marker.addListener('click', () => {
              infoWindow.setContent(
                `<div>
                <div>Author: ${cont}</div>
                <div>Info: ${cont}</div>
              </div>`
              )
              infoWindow?.open(map, marker)
            })

            return marker
          }
        )
      )
    }
    // eslint-disable-next-line
  }, [markersFromProps])

  // because React does not do deep comparisons, a custom hook is used
  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions({
        ...options,
        ...{
          streetViewControl: false,
          // can be applied
          // zoom: 7,
          // minZoom: 1,
          // minZoom: 5,
          // restriction: {
          // Ukraine bounds
          //   latLngBounds: {
          //     east: 41.14,
          //     north: 52.56,
          //     south: 43.97,
          //     west: 21.95,
          //   },
          //   strictBounds: false,
          // },
        },
      })
      clusterer?.clearMarkers()
      clusterer?.addMarkers(markers)
    }
  }, [map, options])

  React.useEffect(() => {
    if (map) {
      ;['click', 'idle'].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      )

      if (onClick) {
        map.addListener('click', onClick)
      }

      if (onIdle) {
        map.addListener('idle', () => onIdle(map))
      }
    }
  }, [map, onClick, onIdle])

  return (
    <>
      <div ref={ref} style={style} />
      {clustererRenderer ? (
        <></>
      ) : (
        markersFromProps.map(({ isPending, isNew, ...position }, idx) => (
          <Marker
            position={position}
            key={idx}
            map={map}
            {...getMarkerOptions({ ...position, isNew, isPending })}
          />
        ))
      )}
    </>
  )
}

export default Map
