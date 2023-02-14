const Marker: React.FC<
  google.maps.MarkerOptions & { onClick?: () => void }
> = ({ onClick, ...options }) => {
  const [marker, setMarker] = React.useState<google.maps.Marker>()

  React.useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker())
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null)
      }
    }
  }, [marker])

  React.useEffect(() => {
    const listener = marker?.addListener('click', onClick)

    return () => {
      listener.remove()
    }
  }, [marker, onClick])

  React.useEffect(() => {
    if (marker) {
      marker.setOptions(options)
    }
  }, [marker, options])

  return null
}

export default Marker
