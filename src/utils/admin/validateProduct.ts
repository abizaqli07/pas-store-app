export interface productInterface {
  name: string
  small_description: string
  description: string
  is_active: boolean
  image: string | null
}
export interface productUpdateInterface {
  id: string
  name: string
  small_description: string
  description: string
  is_active: boolean
  image: string
}