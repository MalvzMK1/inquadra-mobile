import { ImageSourcePropType } from "react-native/Libraries/Image/Image"

export type CourtCardInfo = {
    name: string
    type: string
    rate: number
    image: ImageSourcePropType
}