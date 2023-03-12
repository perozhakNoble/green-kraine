import { Dialog } from '@ui'
import { H4 } from '@ui/Typography'
import { useTranslation } from 'react-i18next'
import { Marker } from 'types/graphql'

import LikeUnlikeButtons from 'src/components/map/LikeUnlikeButtons/LikeUnlikeButtons'
import { TranslationKeys } from 'src/i18n'

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
  const { t } = useTranslation()

  return (
    <Dialog open={open} onClose={onClose} afterModalClose={afterModalClose}>
      <div>
        <H4>{marker?.problem?.title}</H4>
        <div className="text-md font-light">
          <p>
            <b>{t(TranslationKeys.author)}: </b>
            {marker?.user?.name}
          </p>
          <p>
            <b>{t(TranslationKeys.category)}: </b>
            {marker?.problem?.category.name}
          </p>
          <p>
            <b>{t(TranslationKeys.problem)}: </b>
            {marker?.problem?.description}
          </p>
          <p>
            <b>{t(TranslationKeys.key_words)}: </b>
            {marker?.problem?.keywords
              ?.map((keyword) => keyword.title)
              .join(', ')}
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
