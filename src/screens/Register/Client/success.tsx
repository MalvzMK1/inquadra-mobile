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

<<<<<<< HEAD
                <TouchableOpacity className='h-14 w-full rounded-md bg-orange-500 flex items-center justify-center' onPress={() => navigation.navigate('RegisterPassword')}>
                    	<Text className='text-gray-50'>Continuar</Text>
=======
                <TouchableOpacity className='h-14 w-10/12 rounded-md bg-orange-500 flex items-center justify-center' onPress={() => navigation.navigate('RegisterPassword')}>
                    <Text className='text-gray-50'>Continuar</Text>
>>>>>>> 21266c85a720a603f449447ab3b1c02cf390c728
                </TouchableOpacity>
            </View>
        </View>
    )
}