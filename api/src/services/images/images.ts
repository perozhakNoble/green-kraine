import type {
  QueryResolvers,
  MutationResolvers,
  ImageRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const images: QueryResolvers['images'] = () => {
  return db.image.findMany()
}

export const image: QueryResolvers['image'] = ({ id }) => {
  return db.image.findUnique({
    where: { id },
  })
}

export const createImage: MutationResolvers['createImage'] = ({ input }) => {
  return db.image.create({
    data: input,
  })
}

export const updateImage: MutationResolvers['updateImage'] = ({
  id,
  input,
}) => {
  return db.image.update({
    data: input,
    where: { id },
  })
}

export const deleteImage: MutationResolvers['deleteImage'] = ({ id }) => {
  return db.image.delete({
    where: { id },
  })
}

export const Image: ImageRelationResolvers = {
  problem: (_obj, { root }) => {
    return db.image.findUnique({ where: { id: root?.id } }).problem()
  },
}
