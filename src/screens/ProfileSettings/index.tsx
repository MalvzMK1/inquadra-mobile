import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list'
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import MaskInput, { Masks } from 'react-native-mask-input'; 
import { TextInputMask } from 'react-native-masked-text';


export default function ProfileSettings() {

  // const { loading, error, data } = useGetFavoriteById("1");

  // if (loading) return <Text>Loading ...</Text>;
  // return <Text>Hello {JSON.stringify(data)}!</Text>;

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
const [profilePicture, setProfilePicture] = useState(null);

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
      });

      if (!result.canceled) {
        setProfilePicture(result.uri);
      }
    } catch (error) {
      console.log('Erro ao carregar a imagem: ', error);
    }
  };


  const navigation = useNavigation();
  const [showCard, setShowCard] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    country: ''
  });
  const [showCameraIcon, setShowCameraIcon] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  const handleCardClick = () => {
    setShowCard(!showCard);
    setShowCameraIcon(false);
  };


  const handleSaveCard = () => {
    setShowCard(false);
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleExitApp = () => {
    setShowExitConfirmation(true);
  };

  const handleConfirmExit = () => {
    // sair do app
    setShowExitConfirmation(false);
  };

  const handleCancelExit = () => {
    setShowExitConfirmation(false);

  };

  const handleCVVChange = (input: any) => {
    const numericInput = input.replace(/\D/g, '');

    const truncatedCVV = numericInput.slice(0, 3);

    setCVV(truncatedCVV);
  };

  const [ phoneNumber, setPhoneNumber ] = useState("")
  const [ cpf, setCpf ] = useState("")

  const getCountryImage = (countryName: string) => {
    const countryImg = countriesData.find(item => item.value === countryName)?.img
    return countryImg
  }


  // if (loading) return <Text>Loading ...</Text>;
  // return <Text>Hello {JSON.stringify(data?.usersPermissionsUser.data.attributes.photo)}!</Text>;

  return (
    <View className="flex-1 bg-white h-full">
      
      <ScrollView className="flex-grow p-1">
      <TouchableOpacity className="items-center mt-8">
        <View style={styles.container}>
      {profilePicture ? (
        <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
      ) : (
        <Ionicons name="person-circle-outline" size={100} color="#bbb" />
      )}
      <TouchableOpacity onPress={handleProfilePictureUpload} style={styles.uploadButton}>
        {profilePicture ? (
          <Ionicons name="pencil-outline" size={30} color="#fff" />
        ) : (
          <Ionicons name="camera-outline" size={30} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
        </TouchableOpacity>

        <View className="p-6 space-y-10">
        <View>
          <Text className="text-base">Nome</Text>
          <TextInput className="p-4 border border-gray-500 rounded-md h-45" placeholder='Larissa' placeholderTextColor="#d3d3d3" />
          </View>

          <View>
            <Text className="text-base">E-mail</Text>
            <TextInput className="p-4 border border-gray-500 rounded-md h-45" placeholder='larissa@mail.com.br' placeholderTextColor="#d3d3d3" />
          </View>
          <View>
          <Text className="text-base">Telefone</Text>
          <MaskInput
              className='p-4 border border-gray-500 rounded-md h-45'
              placeholder='Ex: 000.000.000-00'
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              mask={Masks.BRL_PHONE}>
          </MaskInput>
          </View>
          
          <View>
          <Text className="text-base">CPF</Text>
          <MaskInput
              className='p-4 border border-gray-500 rounded-md h-45'
              placeholder='Ex: 000.000.000-00'
              value={cpf}
              onChangeText={setCpf}
              mask={Masks.BRL_CPF}>
          </MaskInput>
          </View>
          
          <TouchableOpacity onPress={handleCardClick}>
            <Text className="text-base">Dados Cartão</Text>
            <View className="h-30 border border-gray-500 rounded-md">
              <View className="flex-row justify-center items-center m-2">
              <FontAwesome name="credit-card-alt" size={24} color="#FF6112" />
                <Text className="flex-1 text-base text-right mb-0">
                  {showCard ? <FontAwesome name="camera" size={24} color="#FF6112" /> : 'Adicionar Cartão'}
                </Text>
                <Icon name={showCard ? 'chevron-up' : 'chevron-down'} size={25} color="#FF4715" />
              </View>
            </View>
          </TouchableOpacity>

          {showCard && (
            <View className="border border-gray-500 p-4 mt-10">
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
              <View>
                <Text className='text-base text-[#FF6112]'>País</Text>
                <View className='flex flex-row items-center' >
                
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
              
              <View className="p-2 justify-center items-center">
                <TouchableOpacity onPress={handleSaveCard} className="h-10 w-40 rounded-md bg-red-500 flex items-center justify-center">
                  <Text className="text-white">Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <View>
          <View className='p-2'>
					  <TouchableOpacity onPress={handleDeleteAccount} className='h-14 w-81 rounded-md bg-red-500 flex items-center justify-center'>
            	<Text className='text-gray-50'>Excluir essa conta</Text>
            </TouchableOpacity>
				  </View>

          <View className='p-2'>
					  <TouchableOpacity onPress={handleExitApp} className='h-14 w-81 rounded-md bg-orange-500 flex items-center justify-center' >
             	<Text className='text-gray-50'>Sair do App</Text>
          	</TouchableOpacity>
				</View>
          </View>
        </View>

        <Modal visible={showDeleteConfirmation} animationType="fade" transparent={true}>
          <View className="flex-1 justify-center items-center bg-black bg-opacity-10">
            <View className="bg-white rounded-md p-20 items-center">
              <Text className=" font-bold text-lg mb-8">Confirmar exclusão da conta?</Text>
                <TouchableOpacity className="h-10 w-40 mb-4 rounded-md bg-orange-500 flex items-center justify-center" onPress={handleCancelDelete}>
                  <Text className="text-white">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity className="h-10 w-40 rounded-md bg-red-500 flex items-center justify-center" onPress={handleConfirmDelete}  onPressIn={() => navigation.navigate('DeleteAccountSuccess')}>
                  <Text className="text-white">Confirmar</Text>
                </TouchableOpacity>
              </View>
          </View>
        </Modal>
                
        <Modal visible={showExitConfirmation} animationType="fade" transparent={true}>
          <View className="flex-1 justify-center items-center bg-black bg-opacity-10">
            <View className="bg-white rounded-md p-20 items-center">
              <Text className=" font-bold text-lg mb-8">Sair do App?</Text>
                <TouchableOpacity className="h-10 w-40 mb-4 rounded-md bg-orange-500 flex items-center justify-center" onPress={handleCancelExit}>
                  <Text className="text-white">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity className="h-10 w-40 rounded-md bg-red-500 flex items-center justify-center" onPress={handleConfirmExit} onPressIn={() => navigation.navigate('Login')}>
                  <Text className="text-white">Confirmar</Text>
                </TouchableOpacity>
              </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  uploadButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6112',
    borderRadius: 15,
    padding: 8,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  label: {
    color: 'black',
    paddingBottom: 20,
    fontSize: 20
  },
  maskedInput: {
    borderWidth: 2,
    borderRadius: 6,
    width: '80%',
    padding: 12,
    color: 'black',
    fontSize: 20
  }
});