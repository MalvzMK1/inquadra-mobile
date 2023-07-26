import { View, Text, TouchableOpacity, TextInput, Image, Button, FlatList } from "react-native";

import React, { useState } from "react";
import MaskInput, { Masks } from 'react-native-mask-input';
import { ScrollView } from "react-native-gesture-handler";
import { CheckBox } from 'react-native-elements'
import { useNavigation } from "@react-navigation/native";
import Select from 'react-select'
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, Ionicons } from "@expo/vector-icons";
import DropDownSelect, { MultipleSelectList } from 'react-native-dropdown-select-list';


export default function RegisterEstablishment() {

    const [cpf, setCpf] = useState("");
    const [phone, setPhone] = useState("");
    const [cep, setCep] = useState("")
    const [isChecked, setIsChecked] = useState(false)
    const navigation = useNavigation()
    const [profilePicture, setProfilePicture] = useState(null);

    const [photos, setPhotos] = useState([]);

    const [selected, setSelected] = React.useState([]);
  
    const data = [
        {key:'1', value:'Estacionamento'},
        {key:'2', value:'Vestiário'},
        {key:'3', value:'Restaurante'},
        {key:'4', value:'Opção 4'},
        {key:'5', value:'Opção 5'},
        {key:'6', value:'Opção 6'},
        {key:'7', value:'Opção 7'},
    ]

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
          allowsMultipleSelection: true, // Habilita a seleção múltipla de fotos
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

    return (
            <ScrollView className="h-fit bg-white flex-1"> 
                <View className="items-center mt-9 p-4">
                    <Text className="text-3xl text-center font-extrabold text-gray-700">Cadastro{'\n'}Estabelecimento</Text>
                </View>
                <View className='h-fit'>
                    <View className='p-5 gap-7 flex flex-col justify-between'>
                        <View>
                            <Text className='text-xl p-1'>Nome do Estabelecimento</Text>
                            <TextInput className='p-5 border border-neutral-400 rounded' placeholder='Ex.: Quadra do Zeca'></TextInput>
                        </View>
                        <View>
                            <Text className="text-xl p-1">CNPJ</Text>
                            <MaskInput 
                                    className='p-5 border border-neutral-400 rounded' 
                                    placeholder='00. 000. 000/0001-00.'
                                    value={cpf}
                                    onChangeText={setCpf}
                                    mask={Masks.BRL_CNPJ}>
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
                        <View>
                            <Text className='text-xl p-1'>Endereço</Text>
                            <TextInput className='p-5 border border-neutral-400 rounded' placeholder='Rua Rufus'></TextInput>
                        </View>
                        <View className="flex flex-row justify-between">
                            <View>
                            <Text className='text-xl p-1'>Número</Text>
                            <TextInput className='p-5 border border-neutral-400 rounded w-44' placeholder='123'></TextInput>
                            </View>
                            <View>
                            <Text className='text-xl p-1'>CEP</Text>
                            <MaskInput 
                                className='p-5 border border-neutral-400 rounded w-44' 
                                placeholder='(00) 0000-0000'
                                value={cep}
                                onChangeText={setCep}
                                mask={Masks.ZIP_CODE}>
                            </MaskInput>
                        </View>
                        </View> 
                        <View>
                            <Text className="text-xl p-1">Amenidades do Local</Text>
                            <MultipleSelectList 
                                setSelected={(val: React.SetStateAction<never[]>) => setSelected(val)} 
                                data={data} 
                                save="value"
                                placeholder="Selecione aqui..."
                                label="Amenidades escolhidas:"
                                boxStyles={{borderRadius: 4, minHeight: 55}}
                                inputStyles={{color: "#FF6112", alignSelf: "center"}}
                                searchPlaceholder="Procurar"
                                badgeStyles={{ backgroundColor: "#FF6112"}}
                                closeicon={<Ionicons name="close" size={20} color="#FF6112" />}
                                searchicon={<Ionicons name="search" size={18} color="#FF6112" style={{ marginEnd: 10 }} />}
                                arrowicon={<AntDesign name="down" size={13} color="#FF6112" style={{marginEnd: 2, alignSelf: "center"}} />}
                            />
                            </View>
                        <View>
                        <Text className="text-xl p-1">Fotos do estabelecimento</Text>  
                    
                        <View className="border rounded relative">
                            <View className="flex flex-row">
                                <Text className="text-base text-gray-400 font-bold m-6" onPress={handleProfilePictureUpload}>Carregue as fotos do Estabelecimento. {"\n"} Ex: frente, o bar, o vestiário e afins. </Text>
                                <Ionicons name="star-outline" size={20} color="#FF6112" style = {{ marginTop: 35, marginLeft: 15 }} onPress={handleProfilePictureUpload} />
                            </View>
                            
                            <FlatList className="h-max"
                            data={photos}
                            renderItem={({ item, index }) => (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={{ uri: item.uri }} style={{ width: 100, height: 100, margin: 10}} />
                                <TouchableOpacity style={{ position: 'absolute', right: 0, left: 0, bottom: 0, top: 0, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleDeletePhoto(index)}>
                                    <Ionicons name="trash" size={20} color="orange" />
                                </TouchableOpacity>
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal
                            />
                        </View>
                        </View>
                        <View>
                            <TouchableOpacity className='h-14 w-81 rounded-md bg-[#FF6112] flex items-center justify-center' onPressIn={() => navigation.navigate('ReservationPaymentSign')}>
                                <Text className='text-gray-50'>Continuar</Text>
                            </TouchableOpacity>
                        </View>
                        </View>
                    </View>
            </ScrollView> 
	);
}    