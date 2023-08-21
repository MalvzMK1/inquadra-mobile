import { useNavigation, NavigationProp } from "@react-navigation/native"
import { useState } from 'react';
import { View, Image, Text, TextInput, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import { ImageSourcePropType } from "react-native/Libraries/Image/Image"
import { BottomNavigationBar } from "../../components/BottomNavigationBar";
import { SelectList } from 'react-native-dropdown-select-list'
import MaskInput, { Masks } from "react-native-mask-input";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const courtTypesData = [
    { value: 'Futsal' },
    { value: 'Vôlei' },
    { value: 'Basquete' },
    { value: 'Handebol' },
    { value: 'Tênis' }
]

export default function EditCourt({ navigation, route }: NativeStackScreenProps<RootStackParamList, "EditCourt">) {
    const courtId = route.params.courtId
    
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

    const [courtTypeSelected, setCourtTypeSelected] = useState("")
    const [fantasyName, setFantasyName] = useState("")
    const [minValue, setMinValue] = useState("")

    return (
        <ScrollView className="h-full w-full flex flex-col">

            <View className="pt-[15px] pl-[7px] pr-[7px] flex flex-col items-center justify-center h-fit w-full">
                <Image className="h-[210px] w-[375px] rounded-[5px]" source={{ uri: photo }}></Image>

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
                    <SelectList
                        setSelected={(val: string) => {
                            setCourtTypeSelected(val)
                        }}
                        data={courtTypesData}
                        save="value"
                        placeholder='Selecione uma modalidade'
                        searchPlaceholder='Pesquisar...'

                    />
                </View>

                <View className="mb-[20px]">
                    <Text className="text-[16px] text-[#4E4E4E] font-normal mb-[5px]">Nome fantasia da quadra?</Text>
                    <TextInput
                        className='p-4 border border-neutral-400 rounded'
                        placeholder="Ex: Arena Society"
                    />
                </View>

                <View className="mb-[20px]">
                    <Text className="text-[16px] text-[#4E4E4E] font-normal mb-[5px]">Sinal mínimo para locação</Text>
                    <MaskInput
                        className='p-4 border border-neutral-400 rounded'
                        placeholder='R$ 00,00'
                        keyboardType="numeric"
                        value={minValue}
                        onChangeText={setMinValue}
                        mask={Masks.BRL_CURRENCY}
                    />
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
                    onPress={() => true}
                >
                    <Text className="font-semibold text-white text-[14px]">Salvar</Text>
                </TouchableOpacity>

                <BottomNavigationBar
                    isDisabled={false}
                    playerScreen={false}
                    establishmentScreen={true}
                />

            </View>

        </ScrollView>
    )
}