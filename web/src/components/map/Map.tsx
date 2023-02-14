import { useEffect, useState } from 'react'

import {
  MarkerClusterer,
  Renderer as ClustererRenderer,
} from '@googlemaps/markerclusterer'
import { isLatLngLiteral } from '@googlemaps/typescript-guards'
import { createCustomEqual } from 'fast-equals'

import Marker from 'src/components/map/Marker'

const deepCompareEqualsForMaps = createCustomEqual(
  // @ts-ignore
  (deepEqual) => (a: any, b: any) => {
    if (
      isLatLngLiteral(a) ||
      a instanceof google.maps.LatLng ||
      isLatLngLiteral(b) ||
      b instanceof google.maps.LatLng
    ) {
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
  marks: { lat: number; lng: number }[]
  clustererRenderer?: ClustererRenderer
}

const Map: React.FC<MapProps> = ({
  onClick,
  onIdle,
  style,
  marks,
  clustererRenderer,
  ...options
}) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const [map, setMap] = React.useState<google.maps.Map>()

  // Create an array of alphabetical characters used to label the markers.

  const [clusterer, setClusterer] = useState<MarkerClusterer>(null)
  const [markers, setMarkers] = useState(
    marks.map((position): google.maps.Marker => {
      //const label = labels;
      const marker = new google.maps.Marker({
        position,
      })

      // markers can only be keyboard focusable when they have click listeners
      // open info window when marker is clicked
      // marker.addListener('click', () => {
      //   //infoWindow.setContent();
      //   infoWindow.open(map, marker)
      // })

      return marker
    })
  )

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
    if (marks) {
      setMarkers(
        marks.map((position): google.maps.Marker => {
          const marker = new google.maps.Marker({
            position,
          })
          return marker
        })
      )
    }
  }, [marks])

  // because React does not do deep comparisons, a custom hook is used
  // see discussion in https://github.com/googlemaps/js-samples/issues/946
  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions({
        ...options,
        ...{
          streetViewControl: false,
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
        marks.map((marker, idx) => (
          <Marker position={marker} key={idx} map={map} />
        ))
      )}
    </>
  )
}

export default Map
