import { products } from '../../data/products'

export default defineEventHandler((event) => {
  const id = parseInt(event.context.params?.id as string)
  return products.find((product) => product.id === id)
})
