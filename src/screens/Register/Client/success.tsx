import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {useNavigation} from "@react-navigation/native";

export default function RegisterSuccess() {
    const navigation = useNavigation();
    return (
        <View className="h-full flex justify-center items-center">
            <View className="h-2/5 w-full flex flex-col justify-between items-center">
                <View className="w-3/5 flex flex-col justify-center items-center gap-5">
                    <Text className="text-4xl font-semibold">Cadastro feito com sucesso</Text>
                    <Image source={require('../../../assets/inquadra_unnamed_logo.png')} className="w-20 h-20"></Image>
                </View>
                <TouchableOpacity className='h-14 w-80 rounded-md bg-orange-500 flex items-center justify-center' onPress={() => navigation.navigate('RegisterPassword')}>
                  <Text className='text-gray-50'>Continuar</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}