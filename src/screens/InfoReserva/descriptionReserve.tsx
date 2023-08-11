import ProgressBar from 'react-native-progress/Bar'
import React, { useState, useEffect} from 'react'
import { View, Text, Image, Modal, ScrollView } from 'react-native';
import { useNavigation, NavigationProp } from "@react-navigation/native"
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput, Button, Provider as PaperProvider } from 'react-native-paper';
import MaskInput, { Masks } from 'react-native-mask-input';
import { TextInputMask } from 'react-native-masked-text';
import { SelectList } from 'react-native-dropdown-select-list'
import { useInfoSchedule } from '../../hooks/useInfoSchedule';
import { useUserPaymentCard } from '../../hooks/useUserPaymentCard';
import { z } from "zod";
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO, differenceInSeconds, formatDuration, intervalToDuration } from 'date-fns';
import Countdown from '../../components/countdown/Countdown';
import useCountries from '../../hooks/useCountries';
import {HOST_API} from  '@env';
import { isValidCPF } from "../../utils/isValidCpf";
import { formatDateTime, formatDate, convertToAmericanDate } from "../../utils/formatDate";
import useUpdateScheduleValue from '../../hooks/useUpdateScheduleValue';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useGetMenuUser } from '../../hooks/useMenuUser';
export default function DescriptionReserve({navigation, route}:NativeStackScreenProps<RootStackParamList, 'DescriptionReserve'>) {
    const user_id = route.params.userId
    const schedule_id = route.params.scheduleId
    const {data, error, loading} = useInfoSchedule(schedule_id, user_id)
    const schedulePrice = data?.scheduling?.data?.attributes?.court_availability?.data?.attributes?.value
    const scheduleValuePayed = data?.scheduling?.data?.attributes?.valuePayed
    const {data:dataCountry, error:errorCountry, loading:loadingCountry} = useCountries()
    const [userPaymentCard, {data:userCardData, error:userCardError, loading:userCardLoading }] = useUserPaymentCard()
    const [updateScheduleValue, {data:dataScheduleValue, error:errorScheduleValue, loading:loadingScheduleValue}] = useUpdateScheduleValue()
    const {data:dataUser, error:errorUser, loading:loadingUser} = useGetMenuUser(user_id)

    const [showCardPaymentModal, setShowCardPaymentModal] = useState(false)
    
    const [creditCard, setCreditCard] = useState("")
    const [selected, setSelected] = useState("")
    const [countriesData, setCountriesData] = useState<CountryAPI[]>([]);
    const [countryId, setCountryId] = useState<string | null>(null);

    const [showPixPaymentModal, setShowPixPaymentModal] = useState(false)

      interface iFormCardPayment {
        value: string
        name: string
        cpf: string
        cvv: string
        date: string
      }

      interface iFormPixPayment {
        name: string
        cpf: string
        value: string
      }    
      
      const formSchema = z.object({
        value: z.string({required_error: "É necessário inserir um valor"}).min(1),
        name: z.string({required_error: "É necessário inserir o nome"}).max(29, {message: "Só é possivel digitar até 30 caracteres"}),
        cpf: z.string({required_error: "É necessário inserir o CPF"}).max(15, {message: "CPF invalido"}).refine(isValidCPF, { message: "CPF inválido" }),
        cvv: z.string({required_error: "É necessário inserir um CVV"}).max(3, {message: "Só é possivel digitar até 3 caracteres"}).min(3, {message: "O minimo são 3 caracteres"}),
        date: z.string().refine((value) => {
            const [month, year] = value.split('/');
            const currentDate = new Date();
            const inputDate = new Date(`20${year}-${month}-01`);
          
            if (isNaN(inputDate.getTime())) {
              return false;
            }
          
            if (inputDate.getTime() <= currentDate.getTime()) {
              return false;
            }
          
            return true;
          }, { message: "A data de vencimento é inválida" }),
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

      const getCountryImage = (countryISOCode: string | null): string | undefined => {
        if (countryISOCode && dataCountry) {
          const selectedCountry = dataCountry.countries.data.find(country => country.attributes.ISOCode === countryISOCode);
        
          if (selectedCountry) {
            return `http://192.168.0.229:1337${selectedCountry.attributes.flag.data.attributes.url}`;
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

       const formSchemaPixPayment = z.object({
        value: z.string({required_error: "É necessário inserir um valor"}).min(1),
        name: z.string({required_error: "É necessário inserir o nome"}).max(29, {message: "Só é possivel digitar até 30 caracteres"}),
        cpf: z.string({required_error: "É necessário inserir o CPF"}).max(15, {message: "CPF invalido"}).refine(isValidCPF, { message: "CPF inválido" })
      })

    const {control, handleSubmit, formState: {errors}, getValues} = useForm<iFormCardPayment>({
        resolver: zodResolver(formSchema)
    })

    const {control:controlPix, handleSubmit:handleSubmitPix, formState: {errors:errorsPix}, getValues:getValuesPix} = useForm<iFormPixPayment>({
        resolver: zodResolver(formSchemaPixPayment)
    })
          

    const closeCardPayment = () => {
        setShowCardPaymentModal(false);
      };
    
      const closePixPayment = () => {
        setShowPixPaymentModal(false);
      };


      async function pay(data: iFormCardPayment){
        const countryId = getCountryIdByISOCode(selected)
        await userPaymentCard({ 
                variables: {
                    value: parseFloat(data.value.replace(/[^\d.,]/g, '').replace(',', '.')),
                    schedulingId: schedule_id,
                    userId: '1',
                    name: data.name,
                    cpf: data.cpf,
                    cvv: parseInt(data.cvv),
                    date: convertToAmericanDate(data.date),
                    countryID: countryId,
                    publishedAt: new Date().toISOString()
                }
            })
            await scheduleValueUpdate(parseFloat(data.value.replace(/[^\d.,]/g, '').replace(',', '.')))
            setShowCardPaymentModal(false)
      }     

      const scheduleValueUpdate = async (value:number) =>{
        let validatePayment = value + scheduleValuePayed >= schedulePrice ? true : false
        let valuePayedUpdate = value + scheduleValuePayed
        try {
            const update = await updateScheduleValue({
                variables: {
                    payed_status: validatePayment,
                    scheduling_id: parseInt(schedule_id),
                    value_payed:valuePayedUpdate
                }
            })
            console.log(update.data?.updateScheduling.data.id)
        } catch(error){
            console.log("Erro na mutação updateValueSchedule", error)
        }
      }


    const closeCardPayment = () => {
        setShowPixPaymentModal(false);
      };
    
      const closePixPayment = () => {
        setShowCardPaymentModal(false);
      };


      function pay(data: iFormCardPayment){
        const countryId = getCountryIdByISOCode(selected)
        userPaymentCard({ 
                variables: {
                    value: parseFloat(data.value.replace(/[^\d.,]/g, '').replace(',', '.')),
                    schedulingId: schedule_id,
                    userId: user_id, 
                    name: data.name,
                    cpf: data.cpf,
                    cvv: parseInt(data.cvv),
                    date: convertToAmericanDate(data.date),
                    countryID: countryId,
                }
            })
            setShowCardPaymentModal(false)
      }

    function payPix(info: iFormPixPayment){
        navigation.navigate('PixScreen', {courtName: data?.scheduling.data.attributes.court_availability.data.attributes.court.data.attributes.fantasy_name, value: parseFloat(info.value.replace(/[^\d.,]/g, '').replace(',', '.')), userID: user_id})
        setShowPixPaymentModal(false)
      }

      const countryOptions = dataCountry?.countries?.data.map(country => ({
        value: country?.id,
        label: country?.attributes?.ISOCode || "", // Mostra o ISOCode (ou uma string vazia se não existir)
        img: `http://192.168.0.229:1337${country?.attributes?.flag?.data?.attributes?.url || ""}` // Utiliza ? para garantir que a propriedade flag e seus atributos existam
      })) || [];

    return (
        <View className='flex-1 bg-zinc-600'>
            <View className=' h-11 w-max  bg-zinc-900'></View>
            <View className=' h-16 w-max  bg-zinc-900 flex-row item-center justify-between px-5'>
                <View className='flex item-center justify-center'>
                    <TouchableOpacity className='h-6 w-6' onPress={() => navigation.navigate('InfoReserva')}>
                        <TextInput.Icon icon={'chevron-left'} size={25} color={'white'} />
                    </TouchableOpacity>
                </View>
                <View className='flex item-center justify-center'>
                    <Text className='text-lg font-bold text-white'>RESERVA</Text>
                </View>
                <View className='h-max w-max flex justify-center items-center'>
                    <TouchableOpacity className='h-12 W-12 '>
                        <Image
                            source={{ uri: HOST_API + dataUser?.usersPermissionsUser.data.attributes.photo?.data.attributes.url }}
                            style={{ width: 46, height: 46 }}
                            borderRadius={100}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView>
            <View className='h-6'></View>
            <View className='flex w-max h-80 bg-zinc-900  px-5'>
                <View className='flex-row items-start justify-start w-max h-max pt-2'>
                    <View>
                        <Image
                            source={{ uri: HOST_API + data?.scheduling.data.attributes.court_availability.data.attributes.court.data.attributes.photo.data[0].attributes.url }}
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
                                        <TextInput.Icon icon={'pencil'} size={15} color={'#FF6112'} />
                                    </View>
                                </View>
                            </View>
                            <View>
                                <Text className='font-normal text-xs text-white'>{data?.scheduling.data.attributes.court_availability.data.attributes.court.data.attributes.name}</Text>
                            </View>
                            <View className='flex-row pt-2'>
                                <View>
                                    <Text className='font-black text-xs text-white'>Reserva feita em {formatDateTime(data?.scheduling?.data?.attributes?.createdAt)}</Text>
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
                <View style={{ width: '100%', justifyContent: 'center' }} className='relative'>
                <Text className='absolute z-10 self-center text-white font-bold'>
                    R$ {data?.scheduling.data.attributes.valuePayed} / R$ {data?.scheduling.data.attributes.court_availability.data.attributes.value}
                    </Text>
                    {data?.scheduling.data.attributes.valuePayed && data?.scheduling.data.attributes.court_availability.data.attributes.value && (
                        <ProgressBar
                        progress={Math.floor((data.scheduling.data.attributes.valuePayed / data.scheduling.data.attributes.court_availability.data.attributes.value) * 100)}
                        width={null}
                        height={30}
                        borderRadius={5}
                        color={'#0FA958'}
                        unfilledColor={'#0FA95866'}
                        />
                    )}
                </View>
                <View className=' h-18 w-full flex items-center'>
                    <View className='w-60 pt-2 item-center'>
                        <Countdown targetDate={new Date(data?.scheduling?.data?.attributes?.payDay)} />
                    </View>
                </View>
                {
                    data?.scheduling?.data?.attributes?.owner?.data?.id !== user_id ? (
                    <View className='h-max w-full flex justify-center items-center pl-2'>
                            <TouchableOpacity className='pt-2 pb-5 ' onPress={() => setShowCardPaymentModal(true)}>
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
                            <TouchableOpacity className='pb-2' onPress={() => setShowPixPaymentModal(true)}>
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
                                        <TextInput.Icon icon={'share-variant'} size={21} color={'#FF6112'} />
                                    </View>
                                    <View className='item-center justify-center'>
                                        <Text className='font-black text-xs text-center text-white pl-1'>Compartilhar</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View className='h-max w-full flex justify-between pl-2'>
                            <TouchableOpacity className='pt-2' onPress={() => setShowCardPaymentModal(true)  }>
                                <View className='w-30 h-10 bg-white rounded-sm flex-row items-center'>
                                    <View className='w-1'></View>
                                    <View className='h-5 w-5 items-center justify-center'>
                                        <TextInput.Icon icon={'credit-card-plus-outline'} size={21} color={'#FF6112'} />
                                    </View>
                                    <View className='item-center justify-center'>
                                        <Text className='font-black text-xs text-center text-gray-400 pl-1'>Adicionar Pagamento</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity className='pb-2' onPress={() => setShowPixPaymentModal(true)}>
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
                        {
                            data?.scheduling.data.attributes.user_payments.data.map((paymentInfo) => 
                            <View className='w-full pt-5'>
                                <View className='h-14 w-30 rounded-md bg-white flex-row items-center justify-between'>
                                    <Text className='text-black font-normal pl-4'>{paymentInfo?.attributes?.users_permissions_user?.data?.attributes?.username}</Text>
                                    <Text className='text-black font-normal'>{formatDate(paymentInfo?.attributes?.createdAt)}</Text>
                                    <Text className='text-black font-normal pr-4'>R${paymentInfo?.attributes?.value}</Text>
                                </View>
                            </View>
                            )
                        }                 
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
            </ScrollView>
            <Modal visible={showCardPaymentModal} animationType="fade" transparent={true} onRequestClose={closeCardPayment}>
                <View className='bg-black bg-opacity-10 flex-1 justify-center items-center'>      
                    <View className='bg-[#292929] h-fit w-11/12 p-6 justify-center'>
                    <ScrollView>
                        <View className='flex gap-y-[10px]'>
                            <View>
                                <Text className='text-sm text-[#FF6112]'>Nome</Text>
                                    <Controller 
                                        name='name'
                                        control={control}
                                        render={({field: {onChange}}) => (  
                                            <TextInput
                                                className='p-3 border border-neutral-400 rounded bg-white'
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
                                            className='p-3 border border-neutral-400 rounded bg-white'
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
                                <Text className='text-sm text-[#FF6112]'>Valor da contribuição</Text>
                                <Controller
                                    name='value'
                                    control={control}
                                    render={({field: {onChange}}) => (
                                        <MaskInput
                                            className='p-3 border border-neutral-400 rounded bg-white'
                                            placeholder='Ex: R$ 30,00'
                                            value={getValues('value')}
                                            onChangeText={onChange}
                                            mask={Masks.BRL_CURRENCY}
                                            keyboardType='numeric'>
                                        </MaskInput>
                                    )}
                                ></Controller>
                                {errors.value && <Text className='text-red-400 text-sm'>{errors.value.message}</Text>}
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
                                    <Controller
                                        name='date'
                                        control= {control}
                                        render={({field: {onChange}}) => (
                                            <TextInputMask className='p-3 border border-neutral-400 rounded bg-white'
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
                                                className='p-3 border border-neutral-400 rounded bg-white'
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
                                <View>
                                    <Button mode="contained" style={{height: 50, width: '100%',backgroundColor: '#FF6112',borderRadius: 8,justifyContent: 'center',alignItems: 'center', marginTop: 20}}
                                            onPress={handleSubmit(pay, console.log)}
                                        >
                                        <Text className='text-base text-white'>EFETUAR PAGAMENTO</Text>
                                    </Button>
                                </View>
                                
                        </View>    
                        </ScrollView>     
                    </View>
                     
                </View>
            </Modal>
            <Modal visible={showPixPaymentModal} animationType="fade" transparent={true} onRequestClose={closePixPayment} >
                <View className='bg-black bg-opacity-10 flex-1 justify-center items-center'>
                    <View className='bg-[#292929] h-fit w-11/12 p-6 justify-center'>
                        <View className='flex gap-y-[10px]'>
                            <View>
                                <Text className='text-sm text-[#FF6112]'>Nome</Text>
                                <Controller
                                    name='name'
                                    control={controlPix}
                                    render={({field: {onChange}})=> (
                                        <TextInput
                                            className='p-3 border border-neutral-400 rounded bg-white'
                                            placeholder='Ex: nome'
                                            onChangeText={onChange}>
                                        </TextInput>
                                    )}
                                ></Controller>
                                {errorsPix.name && <Text className='text-red-400 text-sm'>{errorsPix.name.message}</Text>}    
                            </View>
                            <View>
                                <Text className='text-sm text-[#FF6112]'>CPF</Text>
                                <Controller
                                    name='cpf'
                                    control={controlPix}
                                    render={({field: {onChange}}) => (
                                        <MaskInput
                                            className='p-3 border border-neutral-400 rounded bg-white'
                                            placeholder='Ex: 000.000.000-00'
                                            value={getValuesPix('cpf')}
                                            onChangeText={onChange}
                                            mask={Masks.BRL_CPF}
                                            keyboardType='numeric'>
                                        </MaskInput>
                                    )}
                                ></Controller>
                                {errorsPix.cpf && <Text className='text-red-400 text-sm'>{errorsPix.cpf.message}</Text>}   
                            </View>
                            <View>
                                <Text className='text-sm text-[#FF6112]'>Valor da contribuição</Text>
                                <Controller
                                    name='value'
                                    control= {controlPix}
                                    render = {({field: {onChange}}) => (
                                        <MaskInput
                                            className='p-3 border border-neutral-400 rounded bg-white'
                                            placeholder='Ex: R$ 30,00'
                                            value={getValuesPix('value')}
                                            onChangeText={onChange}
                                            mask={Masks.BRL_CURRENCY}
                                            keyboardType='numeric'>
                                        </MaskInput>
                                    )}
                                ></Controller>
                                {errorsPix.value && <Text className='text-red-400 text-sm'>{errorsPix.value.message}</Text>}    
                            </View>
                        </View>
                        <View>
                            <Button mode="contained" style={{height: 50, width: '100%',backgroundColor: '#FF6112',borderRadius: 8,justifyContent: 'center',alignItems: 'center', marginTop: 20}}
                                onPress={handleSubmitPix( payPix , console.log )}>
                                <Text className='text-base text-white'>EFETUAR PAGAMENTO</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}