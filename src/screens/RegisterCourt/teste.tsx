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
import { useReserveInfo } from "../../hooks/useInfoReserve";
import {HOST_API} from  '@env';
import SvgUri from 'react-native-svg-uri';
import storage from "../../utils/storage";
import { Float } from "react-native/Libraries/Types/CodegenTypes";
import geolib from 'geolib';
import { calculateDistance } from "../../components/calculateDistance/calculateDistance";
import { useUserPaymentCard } from '../../hooks/useUserPaymentCard';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { isValidCPF } from "../../utils/isValidCpf";
import MaskInput, { Masks } from 'react-native-mask-input';
import useCountries from '../../hooks/useCountries'
import { formatDateTime, formatDate, convertToAmericanDate } from "../../utils/formatDate";

export default function ReservationPaymentSign() {
    const id_user = '1'
    const court_id = '1'
    const schedule_id = '1'

    const {data:dataReserve, error:errorReserve, loading:loadingReserve} = useReserveInfo(court_id)
    const [userPaymentCard, {data:userCardData, error:userCardError, loading:userCardLoading }] = useUserPaymentCard()
    const {data:dataCountry, error:errorCountry, loading:loadingCountry} = useCountries()

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
    const [userGeolocation, setUserGeolocation] = useState<{ latitude: number, longitude: number }>()
    const reserveValue = dataReserve?.courtAvailability?.data?.attributes?.value
    const serviceValue = 20
    const minValue = dataReserve?.courtAvailability?.data?.attributes?.minValue
    const totalValue = reserveValue + serviceValue
  
   
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

    storage.load<{ latitude: number, longitude: number }>({
		key: 'userGeolocation'
	}).then(data => setUserGeolocation(data));
 
      
      const courtLatitude       = parseFloat(dataReserve?.courtAvailability?.data?.attributes?.court?.data?.attributes?.establishment?.data?.attributes?.address?.latitude);
      const courtLongitude      = parseFloat(dataReserve?.courtAvailability?.data?.attributes?.court?.data?.attributes?.establishment?.data?.attributes?.address?.longitude);
      const userLatitude        = parseFloat(userGeolocation?.latitude);
      const userLongitude       = parseFloat(userGeolocation?.longitude);

      let   distanceInMeters    = calculateDistance(userLatitude, userLongitude, courtLatitude, courtLongitude)
      const distanceText        = distanceInMeters >= 1000 ? `${(distanceInMeters / 1000).toFixed(1)} Km` : `${distanceInMeters.toFixed(0)} metros`;

    interface iFormCardPayment {
        name: string
        cpf: string
        cvv: string
        date: string
    }

    const formSchema = z.object({
        name: z.string({required_error: "É necessário inserir o nome"}).max(29, {message: "Só é possivel digitar até 30 caracteres"}),
        cpf: z.string({required_error: "É necessário inserir o CPF"}).max(15, {message: "CPF invalido"}).refine(isValidCPF, { message: "CPF inválido" }),
        cvv: z.string({required_error: "É necessário inserir um CVV"}).max(3, {message: "Só é possivel digitar até 3 caracteres"}).min(3, {message: "O minimo são 3 caracteres"}),
        date: z.string().refine((value) => {
            const [month, year] = value.split('/');
            const numericMonth = parseInt(month, 10);
            const numericYear = parseInt(year, 10);
            if (isNaN(numericMonth) || isNaN(numericYear)) {
              return false;
            }
            if (numericMonth < 1 || numericMonth > 12) {
              return false;
            }
            const currentDate = new Date();
            const inputDate = new Date(`20${year}-${month}-01`);
            if (isNaN(inputDate.getTime())) {
              return false;
            }
            if (inputDate <= currentDate) {
              return false;
            }
            return true;
          }, { message: "A data de vencimento é inválida" }),
      })

      const {control, handleSubmit, formState: {errors}, getValues} = useForm<iFormCardPayment>({
        resolver: zodResolver(formSchema)
    })



    const getCountryImage = (countryISOCode: string | null): string | undefined => {
        if (countryISOCode && dataCountry) {
          const selectedCountry = dataCountry.countries.data.find(country => country.attributes.ISOCode === countryISOCode);
        
          if (selectedCountry) {
            return HOST_API + selectedCountry.attributes.flag.data.attributes.url;
          }
        }
        return undefined;
      };


      const getCountryIdByISOCode = (countryISOCode: string | null): string => {
        if (countryISOCode && dataCountry) {
          const selectedCountry = dataCountry.countries.data.find(country => country.attributes.ISOCode === countryISOCode);
        
          if (selectedCountry) {
            return selectedCountry.id;
          }
        }
        return "";
      };

    function pay(data: iFormCardPayment){
        const countryId = getCountryIdByISOCode(selected)
        userPaymentCard({ 
                variables: {
                    value: parseFloat(dataReserve?.courtAvailability?.data?.attributes?.minValue),
                    schedulingId: schedule_id,
                    userId: id_user, 
                    name: data.name,
                    cpf: data.cpf,
                    cvv: parseInt(data.cvv),
                    date: convertToAmericanDate(data.date),
                    countryID: countryId,
                }
            })
            handleSaveCard()
      }

    const navigation = useNavigation()
    return (
        <View className="flex-1 bg-white w-full h-full pb-10">
            <ScrollView>
                <View>
                <Image source={{ uri: HOST_API + dataReserve?.courtAvailability?.data?.attributes?.court?.data?.attributes?.photo?.data[0]?.attributes?.url }}className="w-full h-[230]"/>
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
                        R$ {dataReserve?.courtAvailability?.data?.attributes?.minValue}
                    </Text>
                </View>
                <View className='px-10 py-5'>
					<TouchableOpacity className='py-4 rounded-xl bg-orange-500 flex items-center justify-center' 
                    onPressIn={() => navigation.navigate('PixScreen', {courtName: dataReserve?.courtAvailability.data.attributes.court.data.attributes.fantasy_name, value: dataReserve?.courtAvailability.data.attributes.minValue})}>
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
                        <View className='flex-1 mr-[20px]'>
                            <Text className='text-sm text-[#FF6112]'>Data de Venc.</Text>   
                                <Controller
                                        name='date'
                                        control= {control}
                                        render={({field: {onChange}}) => (
                                            <TextInputMask className='p-3 border border-gray-500 rounded-md h-18'
                                            options={{
                                            format: 'MM/YY',
                                            }}
                                            type={'datetime'}
                                            value={getValues('date')}
                                            onChangeText={onChange}
                                            placeholder="MM/YY"
                                            keyboardType="numeric"
                                        />
                                        )}
                                ></Controller>
                        {errors.date && <Text className='text-red-400 text-sm'>{errors.date.message}</Text>}
                        </View>
                        <View className='flex-1 ml-[20px]'>
                            <Text className='text-sm text-[#FF6112]'>CVV</Text>
                                <Controller
                                    name='cvv'
                                    control={control}
                                    render={({field: {onChange}}) => (
                                            <TextInput
                                                className='p-3 border border-gray-500 rounded-md h-18'
                                                placeholder='123'
                                                onChangeText={onChange}
                                                keyboardType='numeric'
                                                maxLength={3}>
                                            </TextInput>
                                    )}
                                ></Controller>
                                {errors.cvv && <Text className='text-red-400 text-sm'>{errors.cvv.message}</Text>}                                 
                        </View>
                    </View>
                    <View>
                        <Text className='text-sm text-[#FF6112]'>Nome</Text>
                            <Controller 
                                name='name'
                                control={control}
                                render={({field: {onChange}}) => (  
                                    <TextInput
                                        className='p-3 border border-gray-500 rounded-md h-18'
                                        placeholder='Ex: nome'
                                        onChangeText={onChange}>
                                    </TextInput> 
                                        )}
                            ></Controller>
                            {errors.name && <Text className='text-red-400 text-sm'>{errors.name.message}</Text>}
                    </View>
                    <View>
                        <Text className='text-sm text-[#FF6112]'>CPF</Text>                              
                            <Controller
                                name='cpf'
                                control = {control}
                                render={({field: {onChange}}) => (
                                    <MaskInput
                                        className='p-3 border border-gray-500 rounded-md h-18'
                                        placeholder='Ex: 000.000.000-00'
                                        value= {getValues('cpf')}
                                        onChangeText={onChange}
                                        mask={Masks.BRL_CPF}
                                        keyboardType='numeric'>
                                    </MaskInput>
                                    )}                         
                                ></Controller>
                                {errors.cpf && <Text className='text-red-400 text-sm'>{errors.cpf.message}</Text>}
                            </View>
                            <View>
                                <Text className='text-sm text-[#FF6112]'>País</Text>
                                <View className='flex flex-row items-center p-3 border border-neutral-400 rounded bg-white'>
                                    <Image className='h-[21px] w-[30px] mr-[15px] rounded' source={{ uri: getCountryImage(selected) }}></Image>
                                    <SelectList
                                        setSelected={(val: string) => {
                                            setSelected(val);
                                            
                                        }}
                                        data={dataCountry?.countries?.data.map(country => ({
                                            value: country?.attributes.ISOCode,
                                            label: country?.attributes.ISOCode || "", // Mostra o ISOCode (ou uma string vazia se não existir)
                                            img: `${HOST_API}${country?.attributes.flag?.data?.attributes?.url || ""}` // Utiliza ? para garantir que a propriedade flag e seus atributos existam
                                        })) || []}
                                        save="value"
                                        placeholder='Selecione um país'
                                        searchPlaceholder='Pesquisar...'
                                        />
                                </View>
                            </View> 

                    <View className="p-2 justify-center items-center pt-5">
                        <TouchableOpacity onPress={handleSubmit(pay)} className="h-10 w-40 rounded-md bg-red-500 flex items-center justify-center">
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
                        <Text className="text-base">{dataReserve?.courtAvailability?.data?.attributes?.court?.data?.attributes?.name}</Text>
                        <Text className="text-base">{distanceText} de distância</Text>
                        <View className="flex flex-row">
                        <Text className="text-base">Avaliação: {dataReserve?.courtAvailability?.data?.attributes?.court?.data?.attributes?.rating}</Text>
                        <View className="pt-1.5 pl-1.5">
                            <FontAwesome name="star" color="#FF4715" size={11} /></View>
                        </View>
                        <Text className="text-base">{dataReserve?.courtAvailability?.data?.attributes?.court?.data?.attributes?.establishment?.data?.attributes?.address?.streetName}</Text>
                    </View>
                    <View className="justify-center gap-1">
                        {
                            dataReserve?.courtAvailability.data.attributes.court.data.attributes.establishment.data.attributes.amenities.data.map((amenitieInfo) =>
                            <View className="flex flex-row  items-center">
                                 <SvgUri
                                    width="14"
                                    height="14"
                                    source={{uri: HOST_API + amenitieInfo.attributes.iconAmenitie.data.attributes.url}}
                                    />
                                <Text className="text-base pl-2">{amenitieInfo.attributes.name}</Text>
                            </View>
                            )
                        }
                    </View>
                </View>
                <View className="p-4 justify-center items-center border-b ml-8 mr-8">
                    <View className="flex flex-row gap-6">
                        <Text className="font-bold text-xl text-[#717171]">Valor da Reserva</Text>
                        <Text className="font-bold text-xl text-right text-[#717171]">R$ {dataReserve?.courtAvailability.data.attributes.value}</Text>
                    </View>
                    <View className="flex flex-row gap-6">
                    <View className="flex flex-row pt-1">
                    <Text className="font-bold text-xl text-[#717171]">Taxa de Serviço</Text>
                        
                        <TouchableOpacity onPress={handlePaymentInformation}>
                            <FontAwesome name="question-circle-o" size={13} color="black" />
                        </TouchableOpacity>
                        </View>
                        <Text className="font-bold text-xl text-right text-[#717171]">R$ {serviceValue}</Text>
                    </View>
                </View>
                <View className="justify-center items-center pt-6">
                    <View className="flex flex-row gap-10">
                        <Text className="font-bold text-xl text-right text-[#717171]">Total: </Text>
                        <Text className="flex flex-row font-bold text-xl text-right text-[#717171]"> R$ {totalValue}</Text>
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