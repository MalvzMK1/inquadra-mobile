import { View, Image, Text, TouchableOpacity, TextInput, Modal } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useState } from "react";
import { FontAwesome } from '@expo/vector-icons';
import { TextInputMask } from 'react-native-masked-text';
import React from "react";
import Icon from 'react-native-vector-icons/Ionicons';
import { SelectList } from 'react-native-dropdown-select-list'
import { useReserveInfo } from "../../hooks/useInfoReserve";
import SvgUri from 'react-native-svg-uri';
import storage from "../../utils/storage";
import { calculateDistance } from "../../components/calculateDistance/calculateDistance";
import { useUserPaymentCard } from '../../hooks/useUserPaymentCard';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { isValidCPF } from "../../utils/isValidCpf";
import MaskInput, { Masks } from 'react-native-mask-input';
import useCountries from '../../hooks/useCountries'
import { convertToAmericanDate } from "../../utils/formatDate";
import useUpdateCourtAvailabilityStatus from "../../hooks/useUpdateCourtAvailabilityStatus";
import { useRegisterSchedule } from "../../hooks/useRegisterSchedule";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export default function ReservationPaymentSign({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'ReservationPaymentSign'>) {

    const { courtId, courtImage, courtName, userId, amountToPay, courtAvailabilityDate, courtAvailabilities } = route.params

    const { data: dataReserve, error: errorReserve, loading: loadingReserve } = useReserveInfo(courtId)
    const [userPaymentCard, { data: userCardData, error: userCardError, loading: userCardLoading }] = useUserPaymentCard()
    const { data: dataCountry, error: errorCountry, loading: loadingCountry } = useCountries()
    const [updateStatusCourtAvailability, { data: dataStatusAvailability, error: errorStatusAvailability, loading: loadingStatusAvailability }] = useUpdateCourtAvailabilityStatus()
    const [createSchedule, { data: dataCreateSchedule, error: errorCreateSchedule, loading: loadingCreateSchedule }] = useRegisterSchedule()

    const [showCard, setShowCard] = useState(false);
    const [cardData, setCardData] = useState({
        cardNumber: '',
        expirationDate: '',
        cvv: '',
        country: ''
    });
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
    const serviceValue = amountToPay * 4 / 100

    const minValue = dataReserve?.courtAvailability?.data?.attributes?.minValue
    let totalValue
    if (reserveValue) {
        totalValue = reserveValue + serviceValue
    }


    const [selected, setSelected] = React.useState("");


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


    const courtLatitude = parseFloat(dataReserve?.courtAvailability?.data?.attributes?.court?.data?.attributes?.establishment?.data?.attributes?.address?.latitude ?? '0');
    const courtLongitude = parseFloat(dataReserve?.courtAvailability?.data?.attributes?.court?.data?.attributes?.establishment?.data?.attributes?.address?.longitude ?? '0');
    const userLatitude = parseFloat(userGeolocation?.latitude.toString() ?? "0");
    const userLongitude = parseFloat(userGeolocation?.longitude.toString() ?? "0");

    let distanceInMeters = calculateDistance(userLatitude, userLongitude, courtLatitude, courtLongitude)
    const distanceText = distanceInMeters >= 1000 ? `${(distanceInMeters / 1000).toFixed(1)} Km` : `${distanceInMeters.toFixed(0)} metros`;

    interface iFormCardPayment {
        name: string
        cpf: string
        cvv: string
        date: string
    }

    const formSchema = z.object({
        name: z.string({ required_error: "É necessário inserir o nome" }).max(29, { message: "Só é possivel digitar até 30 caracteres" }),
        cpf: z.string({ required_error: "É necessário inserir o CPF" }).max(15, { message: "CPF invalido" }).refine(isValidCPF, { message: "CPF inválido" }),
        cvv: z.string({ required_error: "É necessário inserir um CVV" }).max(3, { message: "Só é possivel digitar até 3 caracteres" }).min(3, { message: "O minimo são 3 caracteres" }),
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

    const { control, handleSubmit, formState: { errors }, getValues } = useForm<iFormCardPayment>({
        resolver: zodResolver(formSchema)
    })



    const getCountryImage = (countryName: string | null): string | undefined => {
        if (countryName && dataCountry) {
            const selectedCountry = dataCountry.countries.data.find(country => country.attributes.name === countryName);

            if (selectedCountry) {
                return selectedCountry.attributes.flag.data.attributes.url;
            }
        }
        return undefined;
    };


    const getCountryIdByName = (countryName: string | null): string => {
        if (countryName && dataCountry) {
            const selectedCountry = dataCountry.countries.data.find(name => name.attributes.name === countryName);

            if (selectedCountry) {
                return selectedCountry.id;
            }
        }
        return "";
    };

    const pay = async (data: iFormCardPayment) => {
        try {
            const newScheduleId = await createNewSchedule();
            console.log(newScheduleId)
            const countryId = getCountryIdByName(selected);
            if (newScheduleId) {
                userPaymentCard({
                    variables: {
                        value: dataReserve?.courtAvailability?.data?.attributes?.minValue ? dataReserve?.courtAvailability?.data?.attributes?.minValue : 0,
                        schedulingId: newScheduleId.toString(),
                        userId: userId,
                        name: data.name,
                        cpf: data.cpf,
                        cvv: parseInt(data.cvv),
                        date: convertToAmericanDate(data.date),
                        countryID: countryId,
                        publishedAt: new Date().toISOString()
                    }
                });
            }

            updateStatusDisponibleCourt();
            handleSaveCard();
        } catch (error) {

            console.error("Erro ao criar o agendamento:", error);
        }
    };

    const createNewSchedule = async () => {
        try {
            const create = await createSchedule({
                variables: {
                    title: 'rapaz',
                    court_availability: courtAvailabilities,
                    date: courtAvailabilityDate.split("T")[0],
                    pay_day: courtAvailabilityDate.split("T")[0],
                    value_payed: dataReserve?.courtAvailability?.data?.attributes?.minValue ? dataReserve?.courtAvailability?.data?.attributes?.minValue : 0,
                    owner: userId,
                    users: [userId],
                    publishedAt: new Date().toISOString()
                }
            });
            return create.data?.createScheduling?.data?.id

        } catch (error) {
            console.error("Erro na mutação createSchedule:", error);
        }
    };

    const updateStatusDisponibleCourt = () => {
        updateStatusCourtAvailability({
            variables: {
                id: courtAvailabilityDate,
                status: true
            }
        })
    }

    return (
        <View className="flex-1 bg-white w-full h-full pb-10">
            <ScrollView>
                <View>
                    <Image source={{ uri: courtImage }} className="w-full h-[230]" />
                </View>
                <View className="pt-5 pb-4 flex justify-center flex-row">
                    <Text className="text-base text-center font-bold">
                        Para realizar sua reserva é necessário pagar um sinal.
                    </Text>
                    <TouchableOpacity className="p-1 px-3" onPress={handleRateInformation}>
                        <FontAwesome name="question-circle-o" size={13} color="black" />
                    </TouchableOpacity>
                </View>
                <View className="bg-gray-300 p-4">
                    <Text className="text-5xl text-center font-extrabold text-gray-700">
                        R$ {amountToPay.toFixed(2)}
                    </Text>
                </View>
                <View className='px-10 py-5'>
                    <TouchableOpacity className='py-4 rounded-xl bg-orange-500 flex items-center justify-center'
                        onPressIn={() => {
                            createNewSchedule().then(scheduleID => {
                                if (scheduleID)
                                    navigation.navigate('PixScreen', {
                                        courtName: dataReserve?.courtAvailability.data.attributes.court.data.attributes.fantasy_name ? dataReserve?.courtAvailability.data.attributes.court.data.attributes.fantasy_name : "",
                                        value: (amountToPay + serviceValue).toString(),
                                        userID: userId,
                                        scheduleID,
                                    })
                            })
                        }}
                    >
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
                                        control={control}
                                        render={({ field: { onChange } }) => (
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
                                        render={({ field: { onChange } }) => (
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
                                    render={({ field: { onChange } }) => (
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
                                    control={control}
                                    render={({ field: { onChange } }) => (
                                        <MaskInput
                                            className='p-3 border border-gray-500 rounded-md h-18'
                                            placeholder='Ex: 000.000.000-00'
                                            value={getValues('cpf')}
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
                                <View className='flex flex-row items-center justify-between p-3 border border-neutral-400 rounded bg-white'>
                                    <Image className='h-[21px] w-[30px] mr-[10px] rounded' source={{ uri: getCountryImage(selected) }}></Image>
                                    <SelectList
                                        setSelected={(val: string) => {
                                            setSelected(val);

                                        }}
                                        data={dataCountry?.countries?.data.map(country => ({
                                            value: country?.attributes.name,
                                            label: country?.attributes.name || "",
                                            img: `${country?.attributes.flag?.data?.attributes?.url || ""}`
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
                                        source={{ uri: amenitieInfo.attributes.iconAmenitie.data.attributes.url }}
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
                        <Text className="font-bold text-xl text-right text-[#717171]">R$ {amountToPay.toFixed(2)}</Text>
                    </View>
                    <View className="flex flex-row gap-6">
                        <View className="flex flex-row pt-1">
                            <Text className="font-bold text-xl text-[#717171]">Taxa de Serviço</Text>
                            <TouchableOpacity onPress={handlePaymentInformation}>
                                <FontAwesome name="question-circle-o" size={13} color="black" />
                            </TouchableOpacity>
                        </View>
                        <Text className="font-bold text-xl text-right text-[#717171]">R$ {serviceValue.toFixed(2)}</Text>
                    </View>
                </View>
                <View className="justify-center items-center pt-6">
                    <View className="flex flex-row gap-10">
                        <Text className="font-bold text-xl text-right text-[#717171]">Total: </Text>
                        <Text className="flex flex-row font-bold text-xl text-right text-[#717171]"> R$ {(amountToPay + serviceValue).toFixed(2)}</Text>
                    </View>
                </View>
                <Modal visible={showPaymentInformation} animationType="fade" transparent={true}>
                    <View className="flex-1 justify-center items-center bg-black bg-opacity-0 rounded">
                        <View className="bg-white rounded-md items-center ">
                            <Text className="bg-white p-8 rounded text-base text-center">Através dessa taxa provemos a tecnologia necessária para você reservar suas quadras com antecedência e rapidez.</Text>
                            <TouchableOpacity className="h-10 w-40 mb-4 rounded-md bg-orange-500 flex items-center justify-center" onPress={handleCancelExit}>
                                <Text className="text-white">OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal visible={showRateInformation} animationType="fade" transparent={true}>
                    <View className="flex-1 justify-center items-center bg-black bg-opacity-0 rounded">
                        <View className="bg-white rounded-md items-center">
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