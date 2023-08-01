import { View, Image, Text, TouchableOpacity, TextInput, Modal } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useState } from "react";
import { FontAwesome } from '@expo/vector-icons';
import { TextInputMask } from 'react-native-masked-text';
import React from "react";
import Icon from 'react-native-vector-icons/Ionicons';
import { SelectList } from 'react-native-dropdown-select-list'
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";


export default function ReservationPaymentSign() {

// 

    const [showCard, setShowCard] = useState(false);
    const [showCameraIcon, setShowCameraIcon] = useState(false);
    const handleCardClick = () => {
      setShowCard(!showCard);
      setShowCameraIcon(false);
    };
  
  
    const handleSaveCard = () => {
      setShowCard(false);
    };
    const [expiryDate, setExpiryDate] = useState('');

    const handleExpiryDateChange = (formatted: string) => {
      setExpiryDate(formatted); 
    };
  
    const [cvv, setCVV] = useState('');
  
  
    const [selected, setSelected] = React.useState("");
    const countriesData = [
      { key: '1', value: 'Brasil', img: 'https://s3.static.brasilescola.uol.com.br/be/2021/11/bandeira-do-brasil.jpg' },
      { key: '2', value: 'França', img: 'https://static.todamateria.com.br/upload/58/4f/584f1a8561a5c-franca.jpg' },
      { key: '3', value: 'Portugal', img: 'https://s3.static.brasilescola.uol.com.br/be/2021/11/bandeira-do-brasil.jpg' },
      { key: '4', value: 'Estados Unidos', img: 'https://s3.static.brasilescola.uol.com.br/be/2021/11/bandeira-do-brasil.jpg' },
      { key: '5', value: 'Canadá', img: 'https://s3.static.brasilescola.uol.com.br/be/2021/11/bandeira-do-brasil.jpg' },
      { key: '6', value: 'Itália', img: 'https://s3.static.brasilescola.uol.com.br/be/2021/11/bandeira-do-brasil.jpg' },
      { key: '7', value: 'Reino Unido', img: 'https://s3.static.brasilescola.uol.com.br/be/2021/11/bandeira-do-brasil.jpg' },
    ]
  
    const handleCVVChange = (input: any) => {
    const numericInput = input.replace(/\D/g, '');
  
    const truncatedCVV = numericInput.slice(0, 3);
      setCVV(truncatedCVV);
    };

    const [showPaymentInformation, setShowPaymentInformation] = useState(false);
    const [showRateInformation, setShowRateInformation] = useState(false);

    const handleRateInformation = () => {
        setShowRateInformation(true)
    };

    const handlePaymentInformation = () => {
        setShowPaymentInformation(true);
    }

    const handleCancelExit = () => {
        setShowPaymentInformation(false);
        setShowRateInformation(false);
    };

    const navigation = useNavigation()
    
    return (
        <View className="flex-1 bg-white w-full h-full pb-10">
            <ScrollView>
                <View>
                <Image source={require('../../assets/quadra.png')}className="w-full h-[230]"/>
                </View>
                <View className="pt-5 pb-4 flex justify-center flex-row">
                    <Text className="text-base text-center font-bold">
                        Para realizar sua reserva é necessário pagar um sinal.
                    </Text>
                    <View className="p-1">
                        <TouchableOpacity onPress={handleRateInformation}>
                            <FontAwesome name="question-circle-o" size={13} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View className="bg-gray-300 p-4">
                    <Text className="text-5xl text-center font-extrabold text-gray-700">
                        R$ 40.00
                    </Text>
                </View>
                <View className='px-10 py-5'>
					<TouchableOpacity className='py-4 rounded-xl bg-orange-500 flex items-center justify-center' onPressIn={() => navigation.navigate('Login')}>
                        <Text className='text-lg text-gray-50 font-bold'>Copiar código PIX</Text>
                    </TouchableOpacity>
				</View>
                <View><Text className="text-center font-bold text-base text-gray-700">ou</Text></View>
                <View className="pt-5 px-9">
                <TouchableOpacity onPress={handleCardClick}>
                    <View className="h-30 border border-gray-500 rounded-md">
                    <View className="flex-row justify-center items-center m-2">
                    <FontAwesome name="credit-card-alt" size={24} color="#FF6112" />
                        <Text className="flex-1 text-base text-center mb-0">
                        {showCard ? <FontAwesome name="camera" size={24} color="#FF6112" /> : 'Selecionar Cartão'}
                        </Text>
                        <Icon name={showCard ? 'chevron-up' : 'chevron-down'} size={25} color="#FF4715" />
                    </View>
                    </View>
                </TouchableOpacity>

                {showCard && (
                    <View className="border border-gray-500 rounded-xl p-4 mt-3">
                    <View className="flex-row justify-between">
                        <View className="flex-1 mr-5">
                        <Text className="text-base text-[#FF6112]">Data venc.</Text>
                        
                        <TextInputMask className='p-3 border border-gray-500 rounded-md h-18'
                            type={'datetime'}
                            options={{
                            format: 'MM/YY',
                            }}
                            value={expiryDate}
                            onChangeText={handleExpiryDateChange}
                            placeholder="MM/YY"
                            keyboardType="numeric"
                        />
                        </View>
                        <View className="flex-1 ml-5">
                        <Text className="text-base text-[#FF6112]">CVV</Text>
                        <View>
                            <TextInput className='p-3 border border-gray-500 rounded-md h-18'
                            value={cvv}
                            onChangeText={handleCVVChange}
                            placeholder="CVV"
                            keyboardType="numeric"
                            maxLength={4} 
                            secureTextEntry 
                            />
                        </View>
                        </View>
                    </View>
                    <View className="pt-3">
                        <Text className='text-base text-[#FF6112]'>País</Text>
                        <View className='flex flex-row items-center'>
                        
                        <View style={{ width: '100%' }}>
                        <SelectList
                        setSelected={(val: string) => {
                            setSelected(val)
                        }}
                        data={countriesData}
                        save='value'
                        placeholder='Selecione um país...'
                        searchPlaceholder='Pesquisar...'
                        />
                        </View>
                        </View>
                    </View>
                    <View className="p-2 justify-center items-center pt-5">
                        <TouchableOpacity onPress={handleSaveCard} className="h-10 w-40 rounded-md bg-red-500 flex items-center justify-center">
                        <Text className="text-white">Salvar</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                )}
                <View>
                    <Text className="text-center font-extrabold text-3xl text-gray-700 pt-10 pb-4">
                        Detalhes Reserva
                    </Text>
                </View>
                </View>
                <View className="bg-gray-300 flex flex-row">
                    <View className="m-6">
                        <Text className="text-base">Quadra de Futsal</Text>
                        <Text className="text-base">4,3 Km de distância</Text>
                        <View className="flex flex-row">
                        <Text className="text-base">Avaliação: 4,5 </Text>
                        <View className="pt-1">
                            <FontAwesome name="star" color="#FF4715" size={11} /></View>
                        </View>
                        <Text className="text-base">Rua Jogatina 512 - Jd Futebol</Text>
                    </View>
                    <View className="justify-center gap-1">
                        <View className="flex flex-row">
                            <View className="bg-orange-500 rounded p-1">
                                <FontAwesome5 name="tshirt" size={14} color = "white" />
                            </View>
                        <Text className="text-base pl-2">Vestiário</Text>
                        </View>
                        <View className="flex flex-row">
                            <View className="bg-orange-500 rounded p-1">
                                <MaterialIcons name="local-restaurant" size={18} color="white" />
                            </View>
                            <Text className="text-base pl-2 pt-1">Restaurante</Text>
                        </View>
                        <View className="flex flex-row">
                        <View className="bg-orange-500 rounded p-1">
                            <FontAwesome name="car" size={16} color="white" />
                        </View>
                        <Text className="text-base pl-2 pt-1">Estacionamento</Text>
                        </View>
                    </View>
                </View>
                <View className="p-4 justify-center items-center border-b ml-8 mr-8">
                    <View className="flex flex-row gap-6">
                        <Text className="font-bold text-xl text-[#717171]">Valor da Reserva</Text>
                        <Text className="font-bold text-xl text-right text-[#717171]">R$ 450.00</Text>
                    </View>
                    <View className="flex flex-row gap-6">
                    <View className="flex flex-row pt-1">
                    <Text className="font-bold text-xl text-[#717171]">Taxa de Serviço</Text>
                        
                        <TouchableOpacity onPress={handlePaymentInformation}>
                            <FontAwesome name="question-circle-o" size={13} color="black" />
                        </TouchableOpacity>
                        </View>
                        <Text className="font-bold text-xl text-right text-[#717171]">R$ 20.00</Text>
                    </View>
                </View>
                <View className="justify-center items-center pt-6">
                    <View className="flex flex-row gap-10">
                        <Text className="font-bold text-xl text-right text-[#717171]">Total: </Text>
                        <Text className="flex flex-row font-bold text-xl text-right text-[#717171]"> R$ 470.00</Text>
                    </View>
                </View>
                <Modal visible={showRateInformation} animationType="fade" transparent={true}>
                <View className="flex-1 justify-center items-center bg-black bg-opacity-0 rounded">
                    <View className="bg-white rounded-md items-center rounded">
                    <Text className="bg-white p-8 rounded text-base text-center">Através dessa taxa provemos a tecnologia necessária para você reservar suas quadras com antecedência e rapidez.</Text>
                        <TouchableOpacity className="h-10 w-40 mb-4 rounded-md bg-orange-500 flex items-center justify-center" onPress={handleCancelExit}>
                        <Text className="text-white">OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </Modal>
                <Modal visible={showPaymentInformation} animationType="fade" transparent={true}>
                <View className="flex-1 justify-center items-center bg-black bg-opacity-0 rounded">
                    <View className="bg-white rounded-md items-center rounded">
                    <Text className="bg-white p-8 rounded text-base text-center">Esse valor será deduzido do valor total e não será estornado, mesmo no caso de não comparecimento ao local ou cancelamento da reserva.</Text>
                        <TouchableOpacity className="h-10 w-40 mb-4 rounded-md bg-orange-500 flex items-center justify-center" onPress={handleCancelExit}>
                        <Text className="text-white">OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </Modal>
            </ScrollView>
        </View>
    )
}