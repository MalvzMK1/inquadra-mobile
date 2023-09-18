import { useNavigation, NavigationProp } from "@react-navigation/native"
import { useState, useEffect } from 'react';
import { View, Image, Text, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import { ImageSourcePropType } from "react-native/Libraries/Image/Image"
import { BottomNavigationBar } from "../../components/BottomNavigationBar";
import { SelectList, MultipleSelectList } from 'react-native-dropdown-select-list'
import MaskInput, { Masks } from "react-native-mask-input";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSportTypes } from "../../hooks/useSportTypesFixed";
import useCourtById from "../../hooks/useCourtById";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from "react-hook-form";
import useUpdateCourt from "../../hooks/useUpdateCourt";
import { HOST_API } from '@env'
import storage from "../../utils/storage";
import BottomBlackMenuEstablishment from "../../components/BottomBlackMenuEstablishment";
interface ICourtFormData {
    fantasyName: string
    minimumScheduleValue: number
}

const courtFormSchema = z.object({
    fantasyName: z.string()
        .nonempty("Insira um nome!"),
    minimumScheduleValue: z.number()
})

export default function EditCourt({ navigation, route }: NativeStackScreenProps<RootStackParamList, "EditCourt">) {
    const courtId = route.params.courtId

    const { control, handleSubmit, formState: { errors } } = useForm<ICourtFormData>({
        resolver: zodResolver(courtFormSchema)
    })

    const { data: sportTypesData, error: sportTypesError, loading: sportTypesLoading } = useSportTypes()
    const { data: courtByIdData, error: courtByIdError, loading: courtByIdLoading } = useCourtById(courtId)
    const [updateCourtHook, { data, loading, error }] = useUpdateCourt()

    let courtTypesData: string[] = []
    sportTypesData?.courtTypes.data.map(sportItem => courtTypesData.push(sportItem.attributes.name))

    interface ICourtTypes {
        id: string
        name: string
    }

    let allCourtTypesJson: ICourtTypes[] = []
    sportTypesData?.courtTypes.data.map(sportTypeItem => {
        allCourtTypesJson = [...allCourtTypesJson, { id: sportTypeItem.id, name: sportTypeItem.attributes.name }]
    })

    const fantasyName = courtByIdData?.court.data.attributes.fantasy_name
    const minimumScheduleValue: number | undefined = courtByIdData?.court.data.attributes.minimumScheduleValue
    const [minimumScheduleValueState, setMinimumSheduleValue] = useState<number>()
    useEffect(() => {
        setMinimumSheduleValue(minimumScheduleValue)
    }, [courtByIdData])

    let courtAvailibilites: string[] = []
    if (courtByIdData?.court.data.attributes.court_availibilites != null || courtByIdData?.court.data.attributes.court_availibilites != undefined) {
        courtByIdData?.court.data.attributes.court_availibilites.data.map(courtAvailibilityItem => courtAvailibilites.push(courtAvailibilityItem.attributes.id))
    }

    let courtPhotos: string[] = []
    courtByIdData?.court.data.attributes.photo.data.map(photoItem => {
        courtPhotos.push(photoItem.id)
    })

    let courtTypes: string[] = []
    if (courtByIdData?.court.data.attributes.court_types != null || courtByIdData?.court.data.attributes.court_types != undefined) {
        courtByIdData?.court.data.attributes.court_types.data.map(courtTypeItem => courtTypes.push(courtTypeItem.id))
    }


    let courtTypesJson: ICourtTypes[] = []
    courtByIdData?.court.data.attributes.court_types.data.map(courtTypeItem => {
        courtTypesJson = [...courtTypesJson, { id: courtTypeItem.id, name: courtTypeItem.attributes.name }]
    })

    const [photo, setPhoto] = useState("")

    const handleProfilePictureUpload = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                alert('Desculpe, precisamos da permissão para acessar a galeria!');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
                allowsMultipleSelection: false,
            });

            if (!result.canceled) {
                setPhoto(result.assets[0].uri)
            }
        } catch (error) {
            alert('Erro ao carregar a imagem!')
        }
    };

    const [courtTypeSelected, setCourtTypeSelected] = useState<Array<string> | undefined>([])

    const [isLoading, setIsLoading] = useState(false)

    const handleUpdateCourt = (data: ICourtFormData): void => {
        setIsLoading(true)

        const courtData = {
            ...data
        }

        let courtTypesId: string[] = []
        if (courtTypeSelected) {
            courtTypeSelected?.map(courtTypeSelectedItem => {
                const courtTypeIdItem = allCourtTypesJson.find(courtTypeItem => courtTypeItem.name === courtTypeSelectedItem)?.id
                if (courtTypeIdItem != undefined)
                    courtTypesId?.push(courtTypeIdItem)
            })
        }

        updateCourtHook({
            variables: {
                court_id: courtId,
                court_availabilities: courtAvailibilites,
                court_name: courtByIdData?.court.data.attributes.name,
                court_types: courtTypesId,
                fantasy_name: courtData.fantasyName,
                minimum_value: courtData.minimumScheduleValue,
                photos: courtPhotos
            }
        }).then(() => alert("Quadra atualizada"))
            .catch((reason) => alert(reason))
            .finally(() => setIsLoading(false))
    }

    let userId = ""

    storage.load<UserInfos>({
        key: 'userInfos',
    }).then((data) => {
        userId = data.userId
    })

    const { data: dataUserEstablishment, error: errorUserEstablishment, loading: loadingUserEstablishment } = useCourtById(courtId!)

    return (
        <ScrollView className="h-full w-full flex flex-col">

            <View className="pt-[15px] pl-[7px] pr-[7px] flex flex-col items-center justify-center h-fit w-full">
                <Image className="h-[210px] w-[375px] rounded-[5px]" source={{ uri: HOST_API + courtByIdData?.court.data.attributes.photo.data[0].attributes.url }}></Image>

                <View className="flex flex-row items-center justify-center gap-x-[5px]">
                    <Text className="text-[16px] text-[#FF6112] font-semibold">Editar</Text>
                    <TouchableOpacity onPress={handleProfilePictureUpload}>
                        <Image source={require('../../assets/edit_icon.png')}></Image>
                    </TouchableOpacity>
                </View>

            </View>

            <View className="pl-[20px] pr-[20px] mt-[30px]">

                <View className="mb-[20px]">
                    <View className="w-full items-center mb-[5px]">
                        <Text className="text-[16px] text-[#4E4E4E] font-normal">Selecione a modalidade:</Text>
                    </View>
                    <MultipleSelectList
                        setSelected={(val: []) => {
                            setCourtTypeSelected(val)
                        }}
                        // defaultOption={{key: courtTypesJson[0].id, value: courtTypesJson[0].name}}
                        data={courtTypesData}
                        save="value"
                        placeholder='Selecione uma modalidade'
                        searchPlaceholder='Pesquisar...'

                    />
                </View>

                <View className="mb-[20px]">
                    <Text className="text-[16px] text-[#4E4E4E] font-normal mb-[5px]">Nome fantasia da quadra?</Text>
                    <Controller
                        name='fantasyName'
                        control={control}
                        rules={{
                            required: true
                        }}
                        render={({ field: { onChange } }) => (
                            <TextInput
                                onChangeText={onChange}
                                defaultValue={fantasyName}
                                className={`p-4 border ${errors.fantasyName ? "border-red-400" : "border-gray-400"}  rounded-lg h-45`}
                                placeholder="Ex: Arena Society"
                            />
                        )}
                    />
                    {errors.fantasyName && <Text className='text-red-400 text-sm -pt-[10px]'>{errors.fantasyName.message}</Text>}
                </View>

                <View className="mb-[20px]">
                    <Text className="text-[16px] text-[#4E4E4E] font-normal mb-[5px]">Sinal mínimo para locação</Text>
                    <Controller
                        name='minimumScheduleValue'
                        control={control}
                        rules={{
                            required: true
                        }}
                        render={({ field: { onChange } }) => (
                            <MaskInput
                                className={`p-4 border ${errors.minimumScheduleValue ? "border-red-400" : "border-gray-400"}  rounded-lg h-45`}
                                placeholder='R$ 00,00'
                                keyboardType="numeric"
                                onChangeText={(masked, unmasked) => {
                                    onChange(parseFloat(unmasked))
                                    setMinimumSheduleValue(parseFloat(unmasked))
                                }}
                                value={minimumScheduleValueState?.toString()}
                                mask={Masks.BRL_CURRENCY}
                            />
                        )}
                    />
                    {errors.minimumScheduleValue && <Text className='text-red-400 text-sm -pt-[10px]'>{errors.minimumScheduleValue.message}</Text>}
                </View>

                <View className="">
                    <Text className="text-[16px] text-[#4E4E4E] font-normal mb-[5px]">Valor aluguel/hora</Text>
                    <TouchableOpacity
                        className='h-14 w-full rounded-md bg-orange-500 flex items-center justify-center'
                        onPress={() => navigation.navigate("CourtPriceHour")}
                    >
                        <Text className="font-semibold text-white text-[14px]">Clique para definir</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    className='h-14 w-full rounded-md bg-orange-500 flex items-center justify-center mt-[50px]'
                    onPress={handleSubmit(handleUpdateCourt)}
                >
                    <Text className="font-semibold text-white text-[14px]">{isLoading ? <ActivityIndicator size='small' color='#F5620F' /> : 'Salvar'}</Text>
                </TouchableOpacity>


                <View className="h-24"></View>
            </View>
            <View className={`absolute bottom-0 left-0 right-0`}>
                <BottomBlackMenuEstablishment
                    screen="Any"
                    userID={userId}
                    establishmentLogo={route.params.userPhoto !== undefined || route.params.userPhoto !== null ? HOST_API + route.params.userPhoto : null}
                    establishmentID={dataUserEstablishment?.court.data.attributes.establishment.data.id!}
                    key={1}
                    paddingTop={2}
                />
            </View>
        </ScrollView>
    )
}