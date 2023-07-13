import { View, Text, TextInput } from "react-native"
import { RegisterHeader } from "../../../components/RegisterHeader"
import { TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"

export default function Password() {
    const navigation = useNavigation()
    return (
        <View className="flex-1 bg-white h-screen">

            <View>
                <RegisterHeader title="Senha" subtitle="Antes de concluir escolha uma senha de acesso"></RegisterHeader>
            </View>

            <View className='p-6 gap-2 flex flex-col justify-between'>
                <View>
                    <Text className='text-xl'>Escolha uma senha</Text>
                    <TextInput className='p-4 border border-neutral-400 rounded' placeholder='Ex.: João'></TextInput>
                </View>

                <View>
                    <Text className='text-xl'>Repita a senha escolhida</Text>
                    <TextInput className='p-4 border border-neutral-400 rounded' placeholder='exemplo@mail.com.br'></TextInput>
                </View>

                <View className='p-6'>
					<TouchableOpacity className='h-14 w-81 rounded-md bg-orange-500 flex items-center justify-center' onPress={() => navigation.navigate('RegisterPassword')}>
                    	<Text className='text-gray-50'>Continuar</Text>
                	</TouchableOpacity>
				</View>

            </View>

        </View>
    )
}