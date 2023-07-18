import { useNavigation } from "@react-navigation/native"
import { View, Image, Text } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { ImageSourcePropType } from "react-native/Libraries/Image/Image"

type UserTypeCardType = {
    title: string
    subtitle: string
    image: ImageSourcePropType
    pageNavigation: string
}

export function UserTypeCard(props: UserTypeCardType) {
    const navigation = useNavigation()
    return (
        <View className="h-80 w-80 bg-white rounded-lg shadow-xl flex flex-col justify-around items-center">
            <Image source={props.image}></Image>
            <Text className="text-3xl font-semibold">{props.title}</Text>
            <Text className="text-lg w-4/6 flex text-center">{props.subtitle}</Text>
            <TouchableOpacity 
                className='h-14 w-60 rounded-md bg-orange-500 flex items-center justify-center'
                onPress={() => navigation.navigate(`${props.pageNavigation}`)}>
                <Text className='text-gray-50'>Cadastrar</Text>
            </TouchableOpacity>
        </View>
    )
}