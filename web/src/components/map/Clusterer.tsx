import { Renderer as ClustererRenderer } from '@googlemaps/markerclusterer'

export const renderer: ClustererRenderer = {
  render: ({ count, position }) => {
    // change color if this cluster has more markers than the mean cluster
    let color = ''

    switch (true) {
      case count < 2:
        color = '#fde047'
        break
      case count < 5:
        color = '#f59e0b'
        break
      case count < 8:
        color = '#ea580c'
        break
      case count < 10:
        color = '#dc2626'
        break
      // > 10
      default:
        color = '#991b1b'
        break
    }

    // create svg url with fill color
    const svg = window.btoa(`
      <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
      <circle cx="120" cy="120" opacity=".6" r="70" />
      <circle cx="120" cy="120" opacity=".3" r="90" />
      <circle cx="120" cy="120" opacity=".2" r="110" />
      <circle cx="120" cy="120" opacity=".1" r="130" />
      </svg>
     `)

    // create marker using svg icon
    return new google.maps.Marker({
      position,
      icon: {
        url: `data:image/svg+xml;base64,${svg}`,
        scaledSize: new google.maps.Size(45, 45),
      },
      label: {
        text: String(count),
        color: 'rgba(255,255,255)',
        fontSize: '12px',
      },
      // adjust zIndex to be above other markers
      zIndex: 1000 + count,
    })
  },
}
