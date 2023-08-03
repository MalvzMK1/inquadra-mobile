import { View, Text, Animated } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {useNavigation} from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons'; 

export default function DeleteAccountSuccess() {
const navigation = useNavigation();

return (
    <View className="h-full flex justify-center items-center">
        <View className="h-2/5 w-full flex flex-col justify-between items-center">
            <View className=" flex flex-col justify-center items-center ">
                <Text className="text-4xl font-semibold">Exclusão feita com sucesso</Text>
            </View>
            <View>
            <MaterialIcons name="verified" size={150} color="green" />
            </View>
            <TouchableOpacity className='h-10 w-80 rounded-md bg-orange-500 flex items-center justify-center' onPress={() => navigation.navigate('Login')}>
              <Text className='text-gray-50'>Continuar</Text>
            </TouchableOpacity>
        </View>
    </View>
)}