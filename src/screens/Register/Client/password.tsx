import { View, Text, TextInput, Image } from "react-native"
import { useState } from "react"
import { RegisterHeader } from "../../../components/RegisterHeader"
import { TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { CheckBox } from 'react-native-elements'

// import CheckBox from "@react-native-community/checkbox"

export default function Password() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmedPassword, setShowConfirmedPassword] = useState(false)
    const [userPassword, setUserPassword] = useState("")
    const [confirmUserPassword, setConfirmUserPassword] = useState("")
    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }
    const handleConfirmShowPassword = () => {
        setShowConfirmedPassword(!showConfirmedPassword)
    }
    const checked: string = "checked"

    const [isChecked, setIsChecked] = useState(false)
    const [captchaChecked, setCaptchaChecked] = useState(false)

    const navigation = useNavigation()
    return (
        <View className=" flex flex-col bg-white h-screen items-center p-5">

            <View>
                <RegisterHeader title="Senha" subtitle="Antes de concluir escolha uma senha de acesso"></RegisterHeader>
            </View>

            <View className='gap-2 flex flex-col justify-between items-center w-full'>
                <View className="w-full">
                    <Text className='text-xl'>Escolha uma senha</Text>
                    <View className="flex flex-row border border-neutral-400 rounded items-center justify-between p-4">
                        <TextInput
                            secureTextEntry={!showPassword}
                            value={userPassword}
                            onChangeText={setUserPassword}
                            className=''
                            placeholder='**********'>
                        </TextInput>
                        <TouchableOpacity onPress={handleShowPassword}>
                            <Image className="h-4 w-4" source={!showPassword ? require('../../../assets/eye.png') : require('../../../assets/eye-slash.png')}></Image>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="w-full">
                    <Text className='text-xl'>Repita a senha escolhida</Text>
                    <View className="flex flex-row border border-neutral-400 rounded items-center justify-between p-4">
                        <TextInput
                            secureTextEntry={!showConfirmedPassword}
                            value={confirmUserPassword}
                            onChangeText={setConfirmUserPassword}
                            className=''
                            placeholder='**********'>
                        </TextInput>
                        <TouchableOpacity onPress={handleConfirmShowPassword}>
                            <Image className="h-4 w-4" source={!showConfirmedPassword ? require('../../../assets/eye.png') : require('../../../assets/eye-slash.png')}></Image>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="flex flex-row justify-start items-center w-full">
                    <CheckBox
                        checked={isChecked}
                        onPress={() => setIsChecked(!isChecked)}
                    />
                    <Text className="text-base flex-wrap flex-1">Li e estou de acordo com o <Text className="text-[#3D58DB] flex-wrap">Termo de Uso e Política de Privacidade</Text> </Text>
                </View>

                <View className="flex flex-row justify-between items-center w-5/6 border rounded-md border-[#CACACA] bg-[#F2F2F2] font-normal p-2">
                    <View className="flex flex-row items-center">
                        <CheckBox
                            checked={captchaChecked}
                            onPress={() => setCaptchaChecked(!captchaChecked)}
                        />

                        <Text className="text-[#959595] text-base">Não sou um robô</Text>
                    </View>

                    <Image source={require('../../../assets/captcha.png')}></Image>
                </View>

                <View className='p-6 w-full'>
                    <TouchableOpacity className='h-14 w-81 rounded-md bg-orange-500 flex items-center justify-center' onPress={() => navigation.navigate('RegisterSuccess')}>
                        <Text className='text-gray-50'>Continuar</Text>
                    </TouchableOpacity>
                </View>


            </View>

        </View>
    )
}