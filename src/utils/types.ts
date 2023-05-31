export interface callbackData {
  visible: boolean
  data: {
    success: boolean
    message: string
    error: any
  } | null
}