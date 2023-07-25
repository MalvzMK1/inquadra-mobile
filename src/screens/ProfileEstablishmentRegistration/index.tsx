import { View, Text, TouchableOpacity, TextInput, Image } from "react-native";

import React, { useState } from "react";
import MaskInput, { Masks } from 'react-native-mask-input';
import { ScrollView } from "react-native-gesture-handler";
import { CheckBox } from 'react-native-elements'



export default function ProfileEstablishmentRegistration() {

    const [cpf, setCpf] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState('');
    const [isChecked, setIsChecked] = useState(false)
    const [captchaChecked, setCaptchaChecked] = useState(false)

    return (
		<View className="flex-1 bg-white h-screen">
            <ScrollView> 
                <View className="items-center mt-9 p-4">
                    <Text className="text-3xl text-center font-extrabold text-gray-700">Cadastro Pessoal</Text>
                </View>
                <View className='h-screen'>
                    <View className='p-5 gap-7 flex flex-col justify-between'>
                        <View>
                            <Text className='text-xl p-1'>Qual é o seu nome?</Text>
                            <TextInput className='p-5 border border-neutral-400 rounded' placeholder='Ex.: João'></TextInput>
                        </View>

                        <View>
                            <Text className='text-xl p-1'>Qual é o seu email?</Text>
                            <TextInput className='p-5 border border-neutral-400 rounded' placeholder='exemplo@mail.com.br'></TextInput>
                        </View>
                        <View>
                            <Text className="text-xl p-1">CPF</Text>
                            <MaskInput 
                                    className='p-5 border border-neutral-400 rounded' 
                                    placeholder='000-000-000-00'
                                    value={cpf}
                                    onChangeText={setCpf}
                                    mask={Masks.BRL_CPF}>
                                </MaskInput>
                        </View>
                        <View>
                            <Text className="text-xl p-1">Telefone para Contato</Text>
                        <MaskInput 
                                className='p-5 border border-neutral-400 rounded' 
                                placeholder='(00) 0000-0000'
                                value={phone}
                                onChangeText={setPhone}
                                mask={Masks.BRL_PHONE}>
                            </MaskInput>
                        </View>
                        </View>
                        <View>
                        <View className="p-5 mt-7">
                            <Text className="text-xl p-1">Criar Senha para acesso</Text>
                            <TextInput secureTextEntry className='p-5 border border-neutral-400 rounded' placeholder="*********" ></TextInput>
                        </View>
                        <View className="p-5">
                        <Text className="text-xl p-1">Repita sua nova senha</Text>
                            <TextInput secureTextEntry className='p-5 border border-neutral-400 rounded' placeholder="*********" ></TextInput>
                        </View>
                        </View>
                        <View className="flex flex-row justify-start items-center w-full">
                        <CheckBox
                            checked={isChecked}
                            onPress={() => setIsChecked(!isChecked)}
                        />
                        <View className="flex ">
                        <Text className="text-base flex-wrap">Li e estou de acordo com o <Text className="text-[#3D58DB] flex-wrap">Termo de Uso e Política de Privacidade</Text> </Text>
                        </View>
                    </View>
                    <View className="flex items-center pt-3">
                    <View className="flex flex-row justify-between items-center w-5/6 border rounded-md border-[#CACACA] bg-[#F2F2F2] font-normal p-2">
                        <View className="flex flex-row items-center">
                            <CheckBox
                                checked={captchaChecked}
                                onPress={() => setCaptchaChecked(!captchaChecked)}
                            />
                            <Text className="text-[#959595] text-base">Não sou um robô</Text>
                        </View>
                        <Image className="w-8 h-8" source={require('../../../assets/captcha.png')}></Image>
                    </View>
                    </View>
                    </View>
                    <View className='p-6'>
                            <TouchableOpacity className='h-14 w-81 rounded-md bg-orange-500 flex items-center justify-center'>
                                <Text className='text-gray-50'>Continuar</Text>
                            </TouchableOpacity>
                    </View>
            </ScrollView> 
		</View>     
	);
}    