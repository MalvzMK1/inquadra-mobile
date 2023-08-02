import { View, Text, TouchableOpacity, TextInput, Image, Button, FlatList } from "react-native";

import React, { useState } from "react";
import MaskInput, { Masks } from 'react-native-mask-input';
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons";
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { MaterialIcons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';

export default function RegisterCourt() {

    const [cpf, setCpf] = useState("");
    const [phone, setPhone] = useState("");
    const [cep, setCep] = useState("")
    const [isChecked, setIsChecked] = useState(false)
    const navigation = useNavigation()
    const [profilePicture, setProfilePicture] = useState(null);

    const [photos, setPhotos] = useState([]);

    const [selected, setSelected] = React.useState([]);
  
    const data = [
        {key:'1', value:'Futsal'},
        {key:'2', value:'Vôlei'},
        {key:'3', value:'Basquete'},
        {key:'4', value:'Futebol'},
        {key:'5', value:'Tennnis'},
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

    return (
            <ScrollView className="h-fit bg-white flex-1"> 
                <View className="items-center mt-9 p-4">
                    <Text className="text-3xl text-center font-extrabold text-gray-700">Cadastro Quadra</Text>
                </View>
                <View className='h-fit'>
                    <View className='p-5 gap-7 flex flex-col justify-between'>
                    <View>
                            <Text className="text-xl p-1">Selecione a modalidade:</Text>
                            <MultipleSelectList 
                                setSelected={(val: React.SetStateAction<never[]>) => setSelected(val)} 
                                data={data} 
                                save="value"
                                placeholder="Selecione aqui..."
                                label="Modalidades escolhidas:"
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
                            <Text className='text-xl p-1'>Nome fantasia da quadra?</Text>
                            <TextInput className='p-5 border border-neutral-400 rounded' placeholder='Ex.: Quadra do Zeca'></TextInput>
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
                            
                            <FlatList className="h-max"
                            data={photos}
                            renderItem={({ item, index }) => (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={{ uri: item.uri }} style={{ width: 100, height: 100, margin: 10}} />
                                <TouchableOpacity style={{ position: 'absolute', right: 0, left: 0, bottom: 0, top: 0, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleDeletePhoto(index)}>
                                    <Ionicons name="trash" size={25} color="#FF6112" />
                                </TouchableOpacity>
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal
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
                            <TextInput className='p-5 border border-neutral-400 rounded' placeholder='Ex.: R$ 00.00'></TextInput>
                        </View>
                        <View className="border-t border-neutral-400 border-b flex flex-row p-5 items-center">
                            <MaterialIcons name="add-box" size={38} color="#FF6112" onPress={() => navigation.navigate("RegisterNewCourt")} />
                            <Text className="pl-4 text-lg" onPress={() => navigation.navigate("RegisterNewCourt")}>Adicionar uma nova Quadra</Text>
                        </View>
                        <View>
                            <TouchableOpacity className='h-14 w-81 rounded-md bg-[#FF6112] flex items-center justify-center' onPressIn={() => navigation.navigate('RegisterNewCourt')}>
                                <Text className='text-gray-50'>Concluir</Text>
                            </TouchableOpacity>
                        </View>
                       
                        </View>
                    </View>
            </ScrollView> 
	);
}    