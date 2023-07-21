import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {useNavigation} from "@react-navigation/native";

export default function deleteAccount() {
    const navigation = useNavigation();
    return (
        <View className="h-full flex justify-center items-center">
            <View className="h-2/5 w-full flex flex-col justify-between items-center">
                <View className=" flex flex-col justify-center items-center ">
                    <Text className="text-4xl font-semibold">Exclusão feita com sucesso</Text>
                </View>
                <TouchableOpacity className='h-14 w-80 rounded-md bg-orange-500 flex items-center justify-center' onPress={() => navigation.navigate('Register')}>
                  <Text className='text-gray-50'>Continuar</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}