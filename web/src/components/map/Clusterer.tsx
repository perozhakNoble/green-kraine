import { Renderer as ClustererRenderer } from '@googlemaps/markerclusterer'

export const renderer: ClustererRenderer = {
  render: ({ count, position }) =>
    new google.maps.Marker({
      label: { text: String(count), color: 'white', fontSize: '10px' },
      position,
      // adjust zIndex to be above other markers
      zIndex: 1000 + count,
    }),
}
