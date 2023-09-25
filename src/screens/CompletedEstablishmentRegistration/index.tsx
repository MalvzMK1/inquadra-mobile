import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export default function CompletedEstablishmentRegistration() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    return (
        <View className="h-full flex justify-center items-center bg-white">
            <View className="h-2/5 w-full flex flex-col justify-between items-center">
                <View className="flex flex-col justify-center items-center gap-5">
                    <Text className="text-4xl font-semibold">Cadastro Finalizado!</Text>
                    <Image source={require('../../assets/Group.png')} className="w-20 h-20"></Image>
                    <Text className="text-lg text-center">Aguarde a aprovação do seu Perfil em breve Entraremos em contato confirmando seu acesso.</Text>
                </View>
                <TouchableOpacity className='h-14 mt-4 w-80 rounded-md bg-orange-500 flex items-center justify-center'
                    onPress={() => navigation.navigate('Login')}>
                    <Text className='text-gray-50'>Continuar</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}