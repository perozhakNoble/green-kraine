import { Dialog } from '@ui'
import { H4 } from '@ui/Typography'
import { Marker } from 'types/graphql'

import LikeUnlikeButtons from 'src/components/map/LikeUnlikeButtons/LikeUnlikeButtons'

const MarkerInfoDialog = ({
  open,
  onClose,
  afterModalClose,
  marker,
}: {
  open: boolean
  onClose: () => void
  afterModalClose?: () => void
  marker: Partial<Marker>
}) => {
  return (
    <Dialog open={open} onClose={onClose} afterModalClose={afterModalClose}>
      <div>
        <H4>{marker?.problem?.title}</H4>
        <div className="text-md font-light">
          <p>
            <b>Автор: </b>
            {marker?.user?.name}
          </p>
          <p>
            <b>Категорія: </b>
            {marker?.problem?.category.name}
          </p>
          <p>
            <b>Проблема: </b>
            {marker?.problem?.description}
          </p>
        </div>
        <div className="mt-2 ml-auto mr-2 w-20">
          <LikeUnlikeButtons
            votes={marker?.problem?.votes}
            problemId={marker?.problem?.id}
          />
        </div>
      </div>
    </Dialog>
  )
}

export default MarkerInfoDialog
