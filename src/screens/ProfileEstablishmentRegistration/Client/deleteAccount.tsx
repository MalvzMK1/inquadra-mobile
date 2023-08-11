import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {useNavigation} from "@react-navigation/native";
import { Octicons } from '@expo/vector-icons';

export default function DeleteAccountEstablishment() {
const navigation = useNavigation();

const nameCourt = "Fenix Esportes"

return (
    <View className="h-full flex justify-center items-center">
    <View className="h-2/4 w-full flex flex-col justify-between items-center">
        <View className="flex flex-col justify-center items-center">
        <Text className="text-3xl font-semibold text-center">Pedido de Exclusão de {nameCourt} em Análise</Text>
        </View>
        <View className="relative flex items-center justify-center">
        <Image className="w-40 h-40 opacity-75 mt-5 mb-5" source={require("../../../assets/picture.png")} />
        <View className="absolute flex items-center justify-center w-full h-full">
            <Octicons name="check-circle-fill" size={120} color="green" />
        </View>
        </View>
        <View className=" p-4 flex flex-col justify-center items-center">
        <Text className="text-3xl font-semibold text-center">Analisaremos seu pedido, no prazo de até 72 horas entraremos em contato.</Text>
        </View>
        <View className="mt-5">
            <TouchableOpacity className='h-14 w-80 rounded-md bg-orange-500 flex items-center justify-center' onPress={() => navigation.navigate('Login')}>
            <Text className='text-gray-50'>Continuar</Text>
            </TouchableOpacity>
        </View>
    </View>
    </View>
)}