import { View, Text, TouchableOpacity, TextInput, Image, FlatList } from "react-native";

import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons";
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { MaterialIcons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';
import useRegisterCourt from "../../hooks/useRegisterCourt";
import { z } from "zod";
import {useForm, Controller} from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import useAvailableSportTypes from "../../hooks/useAvailableSportTypes";
import { TextInputMask } from "react-native-masked-text";
import { ActivityIndicator } from "react-native-paper";
import useUploadImage from "../../hooks/useUploadImage";
import { IUploadImageVariables } from "../../graphql/mutations/uploadImage";
import { da } from "date-fns/locale";
import {HOST_API} from '@env'
import MaskInput, {Masks} from "react-native-mask-input";


type CourtTypes = Array<{label: string, value: string}>;

export default function RegisterCourt() {    
    const [modalities, setModalities] = useState([])

    const [courtName, setCourtName] = useState("")
    const [courtType, setCourtType] = useState("")
    const [fantasyName, setFantasyName] = useState("")
    const [photo, setPhoto] = useState(Array<string>)
    const [courtAvailabilities, setCourtAvailabilities] = useState(Array<string>)
    const [minValue, setMinValue] = useState("")
    const [courtTypes, setCourtTypes] = useState<CourtTypes>([]);
    const [registerCourt, { data, error, loading }] = useRegisterCourt()
    const {data: dataSportType, loading: sportLoading, error: sportError} = useAvailableSportTypes();
    // !sportLoading && console.log(sportError)

    // console.log(sportLoading)
    // console.log(HOST_API)
    // if (!sportLoading) console.log(dataSportType?.courts.data[0].attributes)

    //const {data:dataSportType, error:errorSportType, loading:loadingSportType} = useAvailableSportTypes()
    //if (!loadingSportType) console.log({data: dataSportType, error: errorSportType});

    // const [uploadImage, { data: uploadImageData, error: uploadImageError, loading: uploadImageLoading }] = useUploadImage();

    // const handleUploadPhotos = async () => {
    //     try {
    //       // Iterate over the selected photos and upload each one
    //       for (const photo of photos) {
    //         const uploadVariables: IUploadImageVariables = {
    //           ref_id: 'some-id', // Substitua pelo ID correto da entidade no Strapi
    //           ref: 'some-ref', // Substitua pela referência correta no Strapi
    //           field: 'photos', // Substitua pelo campo correto onde você deseja salvar as fotos no Strapi
    //           file: photo.uri, // Substitua pela URI correta da foto
    //         };
      
    //         // Fazer o upload da foto
    //         const { data } = await uploadImage({ variables: uploadVariables });
      
    //         // Use a resposta se necessário (por exemplo, para mostrar a URL da foto carregada)
    //         console.log('Foto enviada com sucesso:', data.upload.data.attributes.url);
    //       }
      
    //       // Limpar as fotos após o upload (ou faça isso de acordo com o seu fluxo de negócios)
    //       setPhotos([]);
    //     } catch (error) {
    //       console.error('Erro ao enviar fotos:', error);
    //     }
    //   };
      
    // function Teste (data: IFormDatasCourt){
    //     console.log(data)
    // }

    // useEffect(() => {
    //     let newCourtTypes: CourtTypes;

    //     console.log('OIE')

    //     dataSportType?.courts.data.forEach((sport) => {
    //         newCourtTypes = [...newCourtTypes, ...sport.attributes.court_types.data.map(typeCourt => ({
    //             value: typeCourt.attributes.name ?? '',
    //             label: typeCourt.id ?? ''
    //         }))]
    //         console.log(courtTypes)
    //     })

    //     setCourtTypes(prevState => [...prevState, ...newCourtTypes])
    // }, [dataSportType])


    function RegisterNewCourt(data: IFormDatasCourt){
        console.log(courtTypes)
        
        let courtIDs: Array<string> = [];

        selected.forEach(selectedType => {
            courtTypes.forEach(type => {
                if (type.value === selectedType) courtIDs.push(type.label)
            })
        })
       
        console.log(data, selected, courtIDs, data.minimum_value)
        const payload = {
            court_name: `Quadra de ${selected}`,
            courtType: courtIDs,
            fantasyName: data.fantasyName,
            photos: ["2"],
            court_availabilities: ["2"], // tela vinicius
            minimum_value: Number(data.minimum_value) / 100,
            currentDate: new Date().toISOString()      
        }
        console.log(payload)
        // for (const object in payload) console.log(object, typeof payload[object] === 'object' && 'É UM ARRAY?' + payload[object][0])
        registerCourt({
            variables: payload
        }).catch(err => console.error({...err})).then(console.log)
    }

    const formSchema = z.object({
        // court_name: z.string(),
        minimum_value: z.string({required_error:"É necessário determinar um valor mínimo."}),
        // courtType: z.string({required_error:"Selecione pelo menos uma modalidade."}),
        fantasyName: z.string({required_error: "Dê um nome fantasia."}),
        //photos: z.array(z.string()),
        //court_availabilities: z.string()
    })

    // const courtType = z.string().array().nonempty({
    //     message: "Can't be empty!",
    // })

    
    const { control, handleSubmit, formState: { errors }, getValues } = useForm<IFormDatasCourt>({
        resolver: zodResolver(formSchema)
    });
    
    interface IFormDatasCourt{
        court_name: string
        minimum_value: string
        courtType: string
        fantasyName: string
        photos: string[]
        court_availabilities?: string[]
    }

    const [isLoading, setIsLoading] = useState(false)

    const handleRegisterCourt = (data: IFormDatasCourt): void => {
        setIsLoading(true)

        const registerCourts = {
            ...data,
        }

        registerCourt({
            variables: {
                court_name: `Quadra de ${selected[0]}`,
                courtType: registerCourts.courtType,
                fantasyName: registerCourts.fantasyName,
                photos: registerCourts.photos,
                court_availabilities: registerCourts.court_availabilities,
                minimum_value: parseFloat(registerCourts.minimum_value)
            }
        }).then(value => {
            alert(value.data?.createCourt.data.attributes.name)
        })
            .catch((reason) => console.error(reason))
            .finally(() => setIsLoading(false)) 
    }

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	
    // console.log({errorSportType})
    // !loadingSportType && console.log(dataSportType)
    // console.log({
    //     ...errorSportType
    // })


    const [photos, setPhotos] = useState([]);
    
    const [selected, setSelected] = useState<Array<string>>([]);

      const [selectedItems, setSelectedItems] = useState([]);  

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
          allowsMultipleSelection: true, 
        });
  
        if (!result.canceled) {
          setPhotos([...photos, { uri: result.uri }]);
        }
      } catch (error) {
        console.log('Erro ao carregar a imagem: ', error);
      }


    };

        const handleDeletePhoto = (index) => {
            const newPhotos = [...photos];
            newPhotos.splice(index, 1);
            setPhotos(newPhotos);
        };

        const dataSports = dataSportType?.courts?.data || [];

    
    useEffect(() => {
        let newCourtTypes: Array<{value: string, label: string}> = [];

        dataSportType?.courts.data.forEach(sport => {
            newCourtTypes = [...newCourtTypes, ...sport.attributes.court_types.data.filter((deco, index) => {
                if (newCourtTypes[index])
                    return deco.id !== newCourtTypes[index].label
                return deco
            }).map(court => ({
                value: court.attributes.name,
                label: court.id
            }))]
        })
        setCourtTypes(newCourtTypes);
    }, [dataSportType, sportLoading])

    return (
            <ScrollView className="h-fit bg-white flex-1"> 
            {errors && <Text>{JSON.stringify(errors)}</Text>}
                <View className="items-center mt-9 p-4">
                    <Text className="text-3xl text-center font-extrabold text-gray-700">Cadastro Quadra</Text>
                </View>
                <View className='h-fit'>
                    <View className='p-5 gap-7 flex flex-col justify-between'>
                    <View>
                            <Text className="text-xl p-1">Selecione a modalidade:</Text>
                            
                            <Controller
                                name='courtType'
                                control={control}
                                render={({ field: { onChange } }) => (
                                    <MultipleSelectList
                                    setSelected={(val: []) => {
                                        setSelected(val);
                                        onChange([val])
                                        
                                    }}  data={courtTypes}
                                        save="value"
                                        placeholder="Selecione aqui..."
                                        label="Modalidades escolhidas:"
                                        boxStyles={{ borderRadius: 4, minHeight: 55 }}
                                        inputStyles={{ color: "#FF6112", alignSelf: "center" }}
                                        searchPlaceholder="Procurar"
                                        badgeStyles={{ backgroundColor: "#FF6112" }}
                                        closeicon={<Ionicons name="close" size={20} color="#FF6112" />}
                                        searchicon={<Ionicons name="search" size={18} color="#FF6112" style={{ marginEnd: 10 }} />}
                                        arrowicon={<AntDesign name="down" size={13} color="#FF6112" style={{ marginEnd: 2, alignSelf: "center" }} />}
                                    />
                                )}
                            />
                            {errors?.courtType?.message && <Text className='text-red-400 text-sm'>{errors.courtType.message}</Text>}                     
                        </View>
                        <View>
                            <Text className='text-xl p-1'>Nome fantasia da quadra?</Text>
                            <Controller
                                name='fantasyName'
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput 
                                    className='p-5 border border-neutral-400 rounded' 
                                    placeholder='Ex.: Quadra do Zeca'
                                    value={value}
                                    onChangeText={onChange}>
                                    </TextInput>
                                )}
                            />
                        </View>
                        <View>
                        <Text className="text-xl p-1">Fotos da quadra</Text>  
                        <View className="border border-dotted border-neutral-400 rounded relative">
                            <View className="flex flex-row items-center" style={{ justifyContent: "space-between", height: 130 }}>
                            <Text className="text-base text-gray-300 font-bold m-6 " onPress={handleProfilePictureUpload}>
                                Carregue suas fotos aqui.
                            </Text>
                            <Ionicons name="star-outline" size={20} color="#FF6112" style={{ marginEnd: 20 }} onPress={handleProfilePictureUpload} />
                            </View>
                            <Controller
                                name='photos'
                                control={control}
                                rules={{ required: false }} 
                                render={({ field: { onChange, value } }) => (
                                    <FlatList
                                        className="h-max"
                                        data={photos}
                                        renderItem={({ item, index }) => (
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Image source={{ uri: item.uri }} style={{ width: 100, height: 100, margin: 10 }} />
                                            <TouchableOpacity style={{ position: 'absolute', right: 0, left: 0, bottom: 0, top: 0, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleDeletePhoto(index)}>
                                                <Ionicons name="trash" size={25} color="#FF6112" />
                                            </TouchableOpacity>
                                            </View>
                                        )}
                                        keyExtractor={(item, index) => index.toString()}
                                        horizontal
                                        />
                                 )}
                            />
                        </View>

                        </View>
                        <View>
                        <Text className='text-xl p-1'>Valor aluguel/hora</Text>
                            <TouchableOpacity className='h-14 w-81 rounded-md bg-[#FF6112] flex items-center justify-center' onPressIn={() => navigation.navigate('')}>
                                <Text className='text-gray-50'>Clique para Definir</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text className='text-xl p-1'>Sinal mínimo para locação</Text>
                            <Controller
                                name='minimum_value'
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <MaskInput
                                        mask={Masks.BRL_CURRENCY}
                                        keyboardType="numeric"
                                        value={value}
                                        placeholder='Ex.: R$ 00.00'
                                        onChangeText={(masked, unmasked) => onChange(unmasked)}
                                        className='p-5 border border-neutral-400 rounded'
                                    />
                                )}
                            />

                            {errors.minimum_value && <Text className='text-red-400 text-sm'>{errors.minimum_value.message}</Text>}

                        </View>
                        <View className="border-t border-neutral-400 border-b flex flex-row p-5 items-center">
                            <MaterialIcons name="add-box" size={38} color="#FF6112" onPress={() => navigation.navigate("RegisterNewCourt")} />
                            <Text className="pl-4 text-lg" onPress={() => navigation.navigate("RegisterNewCourt")}>Adicionar uma nova Quadra</Text>
                        </View>
                        <View>
                            <TouchableOpacity className='h-14 w-81 rounded-md bg-[#FF6112] flex items-center justify-center' onPress={handleSubmit(RegisterNewCourt)}>
                                <Text className='text-gray-50'>{isLoading ? <ActivityIndicator size="small" color= '#F5620F' /> : 'Concluir'}</Text>
                            </TouchableOpacity>
                        </View>
                        </View>
                    </View>
            </ScrollView> 
	);
}    