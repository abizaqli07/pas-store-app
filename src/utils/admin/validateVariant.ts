import { TYPE } from '@prisma/client'

export interface variantInterface {
  productId: string
  name: string
  active_period: number
  type: TYPE
  price: BigInt
}

export interface variantUpdateInterface {
  id: string
  name: string
  active_period: number
  type: TYPE
  price: BigInt
}