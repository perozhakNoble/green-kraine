import type {
  QueryResolvers,
  MutationResolvers,
  MarkerRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const markers: QueryResolvers['markers'] = () => {
  return db.marker.findMany()
}

export const marker: QueryResolvers['marker'] = ({ id }) => {
  return db.marker.findUnique({
    where: { id },
  })
}

export const createMarker: MutationResolvers['createMarker'] = ({ input }) => {
  return db.marker.create({
    data: input,
  })
}

export const updateMarker: MutationResolvers['updateMarker'] = ({
  id,
  input,
}) => {
  return db.marker.update({
    data: input,
    where: { id },
  })
}

export const deleteMarker: MutationResolvers['deleteMarker'] = ({ id }) => {
  return db.marker.delete({
    where: { id },
  })
}

export const Marker: MarkerRelationResolvers = {
  user: (_obj, { root }) => {
    return db.marker.findUnique({ where: { id: root?.id } }).user()
  },
}
