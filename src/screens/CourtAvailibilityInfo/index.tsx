import { View, Text, TextInput, ImageBackground } from "react-native"
import { ImageSourcePropType } from "react-native/Libraries/Image/Image"

const courtImage: ImageSourcePropType = require('../../assets/black_heart.png')

export default function CourtAvailibilityInfo() {
    return (
        <View>
            <View className="h-80 w-full">
                <ImageBackground className="flex-1 flex flex-col items-center justify-center" source={courtImage}/>
            </View>
        </View>
    )
}