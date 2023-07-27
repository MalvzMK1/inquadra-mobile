import ProgressBar from 'react-native-progress/Bar'
import React, { useState } from 'react'
import { View, Text, Image, Modal, ScrollView } from 'react-native';
import { useNavigation, NavigationProp } from "@react-navigation/native"
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput, IconButton } from 'react-native-paper';
import MaskInput, { Masks } from 'react-native-mask-input';
import { SelectList } from 'react-native-dropdown-select-list'
import { useInfoSchedule } from '../../hooks/useInfoSchedule';

const countriesData = [
    { key: '1', value: 'Brasil', img: 'https://s3.static.brasilescola.uol.com.br/be/2021/11/bandeira-do-brasil.jpg' },
    { key: '2', value: 'França', img: 'https://static.todamateria.com.br/upload/58/4f/584f1a8561a5c-franca.jpg' },
    { key: '3', value: 'Portugal', img: 'https://static.mundoeducacao.uol.com.br/mundoeducacao/2022/03/bandeira-portugal.jpg' },
    { key: '4', value: 'Estados Unidos', img: 'https://s3.static.brasilescola.uol.com.br/be/conteudo/images/estados-unidos.jpg' },
    { key: '5', value: 'Canadá', img: 'https://s5.static.brasilescola.uol.com.br/be/2021/04/bandeira-do-canada.jpg' },
    { key: '6', value: 'Itália', img: 'https://s5.static.brasilescola.uol.com.br/be/2021/12/bandeira-da-italia.jpg' },
    { key: '7', value: 'Reino Unido', img: 'https://s4.static.brasilescola.uol.com.br/be/2021/10/bandeira-do-reino-unido.jpg' },
]

const getCountryImage = (countryName: string) => {
    const countryImg = countriesData.find(item => item.value === countryName)?.img
    return countryImg
}

export default function DescriptionReserve() {

    const [showCameraIcon, setShowCameraIcon] = useState(false);
    const [showCard, setShowCard] = useState(false);

    const handleCardClick = () => {
        setShowCard(!showCard);
        setShowCameraIcon(false);
    };

    interface InfoCourtCardContentPaymentProgressBarProps {
        progress: number
    }

    const [showCardPaymentModal, setShowCardPaymentModal] = useState(false)

    const handleOpenPaymentModal = () => {
        setShowCardPaymentModal(true)
    }

    const handleExitPaymentModal = () => {
        setShowCardPaymentModal(false)
    }

    const [name, setName] = useState("")
    const [cpf, setCpf] = useState("")
    const [value, setValue] = useState("")
    const [creditCard, setCreditCard] = useState("")
    const [maturityDate, setMaturityDate] = useState("")
    const [creditCardCvv, setCreditCardCvv] = useState("")
    const [selected, setSelected] = useState("")

    const [showPixPaymentModal, setShowPixPaymentModal] = useState(false)

    const handleOpenPixPaymentModal = () => {
        setShowPixPaymentModal(true)
    }

    const handleExitPixPaymentModal = () => {
        setShowPixPaymentModal(false)
    }

    const navigation = useNavigation<NavigationProp<RootStackParamList>>()

    const user_id = '1'
    const schedule_id = '1'
   
    const {data, error, loading} = useInfoSchedule(schedule_id, user_id)
    console.log(data?.scheduling?.data?.attributes?.owner?.data?.id === user_id)
    return (

        <View className='flex-1 bg-zinc-600'>
            <View className=' h-11 w-max  bg-zinc-900'></View>
            <View className=' h-16 w-max  bg-zinc-900 flex-row item-center justify-between px-5'>

                <View className='flex item-center justify-center'>
                    <TouchableOpacity className='h-6 w-6' onPress={() => navigation.navigate('InfoReserva')}>
                        {/* <TextInput.Icon icon={'chevron-left'} size={25} color={'white'} /> */}
                    </TouchableOpacity>
                </View>


                <View className='flex item-center justify-center'>
                    <Text className='text-lg font-bold text-white'>RESERVA</Text>
                </View>


                <View className='h-max w-max flex justify-center items-center'>
                    <TouchableOpacity className='h-12 W-12 '>
                        <Image
                            source={{ uri: 'https://i1.sndcdn.com/artworks-z2IyrLsaAE9AmeIg-3bUswQ-t500x500.jpg' }}
                            style={{ width: 46, height: 46 }}
                            borderRadius={100}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View className='h-6'></View>
            <View className='flex w-max h-80 bg-zinc-900  px-5'>
                <View className='flex-row items-start justify-start w-max h-max pt-2'>

                    <View>
                        <Image
                            source={{ uri: `http://192.168.0.229:1337${data?.scheduling.data.attributes.court_availability.data.attributes.court.data.attributes.photo.data[0].attributes.url}` }}
                            style={{ width: 138, height: 90 }}
                            borderRadius={5}
                        />
                    </View>

                    <View className='flex item-start h-24 w-max'>

                        <View className='flex justify-start items-start h-max w-max pl-1'>

                            <View className='flex-row justify-between items-center w-48'>
                                <View className='flex items-center justify-center'>
                                    <Text className='font-black text-base text-orange-600'>{data?.scheduling.data.attributes.court_availability.data.attributes.court.data.attributes.fantasy_name}</Text>
                                </View>

                                <View className='flex-row items-center'>
                                    <View>
                                        <Text className='font-normal text-xs text-orange-600'>Editar</Text>
                                    </View>

                                    <View className='flex items-center justify-center pl-4'>
                                        {/* <TextInput.Icon icon={'pencil'} size={15} color={'#FF6112'} /> */}
                                    </View>


                                </View>

                            </View>

                            <View>
                                <Text className='font-normal text-xs text-white'>{data?.scheduling.data.attributes.court_availability.data.attributes.court.data.attributes.name}</Text>
                            </View>


                            <View className='flex-row pt-2'>
                                <View>
                                    <Text className='font-black text-xs text-white'>Reserva feita em {new Date(data?.scheduling.data.attributes.createdAt).toDateString()}</Text>
                                </View>


                            </View>


                            <View className='pt-2'>
                                <Text className='font-black text-xs text-red-500'>CANCELAR</Text>
                            </View>


                        </View>

                    </View>


                </View>
                <View className='h-2'></View>
                <View>
                    <Text className='font-black text-xs text-white pb-1'>STATUS :</Text>
                </View>
                <View className='w-full'>
                    <View className='relative w-full justify-center'>
                        <Text className='absolute z-10 self-center text-white font-bold'>R$ {data?.scheduling.data.attributes.valuePayed} / R$ {data?.scheduling.data.attributes.court_availability.data.attributes.value}</Text>
                        <ProgressBar progress={ 
                           Math.floor(100)
                        } width={null} height={30} borderRadius={5} color={'#0FA958'} unfilledColor={'#0FA95866'} />
                    </View>
                </View>
                <View className=' h-18 w-full flex items-center'>
                    <View className='w-60 pt-2 item-center'>
                        <Text className='font-black text-xs text-center text-white'>Tempo restante para pagamento 4 dias, 3 horas e 20 minutos</Text>
                    </View>
                </View>
                        
                

                {
                    data?.scheduling?.data?.attributes?.owner?.data?.id !== user_id ? (
                    <View className='h-max w-full flex justify-center items-center pl-2'>
                            <TouchableOpacity className='pt-2 pb-5'>
                                <View className='w-64 h-10 bg-white rounded-sm flex-row items-center'>
                                    <View className='w-1'></View>                       
                                    <View className='h-5 w-5 items-center justify-center'>
                                        <TextInput.Icon icon={'credit-card-plus-outline'} size={21} color={'#FF6112'}  />
                                    </View>
                                    <View className='item-center justify-center'>
                                        <Text className='font-black text-xs text-center text-gray-400 pl-1'>Adicionar Pagamento</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity className='pb-2'>
                                <View className='h-10 w-64 rounded-md bg-orange-500 flex items-center justify-center'>
                                        <Text className='text-gray-50 font-bold'>Copiar código PIX</Text>                 
                                </View>
                            </TouchableOpacity>
                        </View>)
                        : (
                    <View className='h-28 w-60 flex-row  pr-5'>
                        <View className='h-max w-max  justify-center items-start'>
                            <View className='flex-row item-center justify-center'>
                                <TouchableOpacity onPress={() => navigation.navigate('DescriptionInvited')} className='flex-row'>
                                    <View className='h-5 w-5 items-center justify-center'>
                                        {/* <TextInput.Icon icon={'share-variant'} size={21} color={'#FF6112'} /> */}
                                    </View>
                                    <View className='item-center justify-center'>
                                        <Text className='font-black text-xs text-center text-white pl-1'>Compartilhar</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className='h-max w-full flex justify-between pl-2'>
                            <TouchableOpacity className='pt-2' onPress={handleOpenPaymentModal}>
                                <View className='w-30 h-10 bg-white rounded-sm flex-row items-center'>
                                    <View className='w-1'></View>
                                    <View className='h-5 w-5 items-center justify-center'>
                                        {/* <TextInput.Icon icon={'credit-card-plus-outline'} size={21} color={'#FF6112'} /> */}
                                    </View>
                                    <View className='item-center justify-center'>
                                        <Text className='font-black text-xs text-center text-gray-400 pl-1'>Adicionar Pagamento</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity className='pb-2' onPress={handleOpenPixPaymentModal}>
                                <View className='h-10 w-30 rounded-md bg-orange-500 flex items-center justify-center'>
                                    <Text className='text-gray-50 font-bold'>Copiar código PIX</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                </View>
                )
                }






              


            </View>
            <View className='h-screen w-full  px-5 items-center justify-start pt-4'>

                {
                    data?.scheduling?.data?.attributes?.user_payments?.data[0] !== undefined && data?.scheduling?.data?.attributes?.user_payments?.data[0] !== null
                    ?
                    <>
                        <View>
                            <Text className='text-gray-50 font-black'>MEUS PAGAMENTOS:</Text>
                        </View>

                        <View className='w-full pt-5'>
                            <View className='h-14 w-30 rounded-md bg-white flex-row items-center justify-between'>
                                <Text className='text-black font-normal pl-4'>{data?.scheduling.data.attributes.user_payments.data[0].attributes.users_permissions_user.data.attributes.username}</Text>
                                <Text className='text-black font-normal'>{new Date(data?.scheduling.data.attributes.user_payments.data[0].attributes.createdAt).toDateString()}</Text>
                                <Text className='text-black font-normal pr-4'>R${data?.scheduling.data.attributes.user_payments.data[0].attributes.value}</Text>
                            </View>
                        </View>
                    </>
                    : null
                }
                <View className='pt-6'>
                    <Text className='text-gray-50 font-black'>HISTÓRICO DE PAGAMENTOS :</Text>
                </View>
                <View className='pt-3'>
                    <Text className='text-gray-50 font-semibold text-center'>Compartilhe essa página ! Informações serão mostradas aqui uma vez que outros realisem pagamentos </Text>
                </View>
            </View>

            <Modal visible={showCardPaymentModal} animationType="fade" transparent={true}>
                <View className='bg-black bg-opacity-10 flex-1 justify-center items-center'>
                    <View className='bg-[#292929] h-fit w-11/12 p-6 justify-center'>

                        <View className='flex gap-y-[10px]'>

                            <View>
                                <Text className='text-sm text-[#FF6112]'>Nome</Text>
                                <TextInput
                                    className='p-3 border border-neutral-400 rounded bg-white'
                                    placeholder='Ex: nome'
                                    value={name}
                                    onChangeText={setName}>
                                </TextInput>
                            </View>

                            <View>
                                <Text className='text-sm text-[#FF6112]'>CPF</Text>
                                <MaskInput
                                    className='p-3 border border-neutral-400 rounded bg-white'
                                    placeholder='Ex: 000.000.000-00'
                                    value={cpf}
                                    onChangeText={setCpf}
                                    mask={Masks.BRL_CPF}
                                    keyboardType='numeric'>
                                </MaskInput>
                            </View>

                            <View>
                                <Text className='text-sm text-[#FF6112]'>Valor da contribuição</Text>
                                <MaskInput
                                    className='p-3 border border-neutral-400 rounded bg-white'
                                    placeholder='Ex: R$ 30,00'
                                    value={value}
                                    onChangeText={setValue}
                                    mask={Masks.BRL_CURRENCY}
                                    keyboardType='numeric'>
                                </MaskInput>
                            </View>

                        </View>

                        <View className='h-[1px] w-full mt-[20px] mb-[20px] border border-[#4B4B4B] border-dashed'></View>

                        <View className='flex gap-y-[10px]'>
                            <View className=' w-full flex flex-row p-3 border border-neutral-400 rounded bg-white items-center justify-between'>
                                <View className='flex flex-row items-center'>
                                    <TouchableOpacity onPress={() => navigation.navigate('')}>
                                        <Image className="h-5 w-6" source={require('../../assets/new_credit_card.png')}></Image>
                                    </TouchableOpacity>
                                    <MaskInput
                                        className='bg-white w-10/12'
                                        placeholder=''
                                        value={creditCard}
                                        onChangeText={setCreditCard}
                                        mask={Masks.CREDIT_CARD}
                                        keyboardType='numeric'>
                                    </MaskInput>
                                </View>
                                <TouchableOpacity onPress={() => navigation.navigate('')}>
                                    <Image source={require('../../assets/camera.png')}></Image>
                                </TouchableOpacity>
                            </View>

                            <View className='flex flex-row'>
                                <View className='flex-1 mr-[20px]'>
                                    <Text className='text-sm text-[#FF6112]'>Data de Venc.</Text>
                                    <MaskInput
                                        className='p-3 border border-neutral-400 rounded bg-white'
                                        placeholder='MM/AA'
                                        value={maturityDate}
                                        onChangeText={setMaturityDate}
                                        mask={Masks.DATE_DDMMYYYY}>
                                    </MaskInput>
                                </View>

                                <View className='flex-1 ml-[20px]'>
                                    <Text className='text-sm text-[#FF6112]'>CVV</Text>
                                    <TextInput
                                        className='p-3 border border-neutral-400 rounded bg-white'
                                        placeholder='123'
                                        value={creditCardCvv}
                                        onChangeText={setCreditCardCvv}
                                        keyboardType='numeric'
                                        maxLength={3}>
                                    </TextInput>
                                </View>
                            </View>

                            <View>
                                <Text className='text-sm text-[#FF6112]'>País</Text>
                                <View className='flex flex-row items-center p-3 border border-neutral-400 rounded bg-white'>
                                    <Image className='h-[21px] w-[30px] mr-[15px] rounded' source={{ uri: getCountryImage(selected) }}></Image>
                                    <SelectList
                                        setSelected={(val: string) => {
                                            setSelected(val)
                                        }}
                                        data={countriesData}
                                        save="value"
                                        placeholder='Selecione um país'
                                        searchPlaceholder='Pesquisar...'
                                    />
                                </View>
                            </View>

                        </View>

                        <TouchableOpacity
                            className='h-14 w-full rounded-md bg-orange-500 flex items-center justify-center mt-[20px]'
                            onPress={handleExitPaymentModal}>
                            <Text className='text-base text-white'>Efetuar pagamento</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>

            <Modal visible={showPixPaymentModal} animationType="fade" transparent={true}>
                <View className='bg-black bg-opacity-10 flex-1 justify-center items-center'>
                    <View className='bg-[#292929] h-fit w-11/12 p-6 justify-center'>

                        <View className='flex gap-y-[10px]'>

                            <View>
                                <Text className='text-sm text-[#FF6112]'>Nome</Text>
                                <TextInput
                                    className='p-3 border border-neutral-400 rounded bg-white'
                                    placeholder='Ex: nome'
                                    value={name}
                                    onChangeText={setName}>
                                </TextInput>
                            </View>

                            <View>
                                <Text className='text-sm text-[#FF6112]'>CPF</Text>
                                <MaskInput
                                    className='p-3 border border-neutral-400 rounded bg-white'
                                    placeholder='Ex: 000.000.000-00'
                                    value={cpf}
                                    onChangeText={setCpf}
                                    mask={Masks.BRL_CPF}
                                    keyboardType='numeric'>
                                </MaskInput>
                            </View>

                            <View>
                                <Text className='text-sm text-[#FF6112]'>Valor da contribuição</Text>
                                <MaskInput
                                    className='p-3 border border-neutral-400 rounded bg-white'
                                    placeholder='Ex: R$ 30,00'
                                    value={value}
                                    onChangeText={setValue}
                                    mask={Masks.BRL_CURRENCY}
                                    keyboardType='numeric'>
                                </MaskInput>
                            </View>

                        </View>

                        <TouchableOpacity
                            className='h-14 w-full rounded-md bg-orange-500 flex items-center justify-center mt-[20px]'
                            onPress={handleExitPixPaymentModal}>
                            <Text className='text-base text-white'>Efetuar pagamento</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>
        </View>
    )
}

