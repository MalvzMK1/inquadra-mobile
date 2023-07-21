import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list'
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import deleteAccount from './deleteAccount';



export default function ProfileSettings() {
  // console.log(useReserveDisponible(''))

  // const { loading, error, data } = useReserveDisponible("Wednesday");

  // if (loading) return <Text>Loading ...</Text>;
  // return <Text>Hello {JSON.stringify(data)}!</Text>;
  const [selected, setSelected] = React.useState("");
  const data = [
    {key:'1', value:'Brasil'},
    {key:'2', value:'França'},
    {key:'3', value:'Portugal'},
    {key:'4', value:'Estados Unidos'},
    {key:'5', value:'Canadá'},
    {key:'6', value:'Itália'},
    {key:'7', value:'Reino Unido'},
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


  const [profileImage, setProfileImage] = useState(require('../../assets/picture.png'));
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

  const handleCardDataChange = (key, value) => {
    setCardData(prevState => ({
      ...prevState,
      [key]: value
    }));
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
            <TextInput className="p-4 border border-gray-500 rounded-md h-45" placeholder='(00) 00000-0000' placeholderTextColor="#d3d3d3" />
          </View>

          <View>
            <Text className="text-base">CPF</Text>
            <TextInput className="p-4 border border-gray-500 rounded-md h-45" placeholder='000.000000-00' placeholderTextColor="#d3d3d3" />
          </View>

          <TouchableOpacity onPress={handleCardClick}>
            <Text className="text-base">Dados Cartão</Text>
            <View className="h-30 border border-gray-500 rounded-md">
              <View className="flex-row justify-center items-center">
                <IconButton
                  icon={showCameraIcon ? 'camera' : 'credit-card-plus'}
                  size={25}
                  className="items-flex-end"
                />
                <Text className="flex-1 text-base text-right mb-5">
                  {showCard ? <Icon name="camera" size={20} color="#FF4715"  /> : 'Adicionar Cartão'}
                </Text>
                <Icon name={showCard ? 'chevron-up' : 'chevron-down'} size={25} color="#FF4715" />
              </View>
            </View>
          </TouchableOpacity>

          {showCard && (
            <View className="border border-gray-500 rounded-md p-4 mt-10">
              <View className="flex-row justify-between">
                <View className="flex-1 mr-5">
                  <Text className="text-base text-red-500">Data venc.</Text>
                  <TextInput
                    className="p-3 border border-gray-500 rounded-md h-18"
                    placeholderTextColor="#d3d3d3"
                    value={cardData.expirationDate}
                    onChangeText={text => handleCardDataChange('expirationDate', text)}
                  />
                </View>
                <View className="flex-1 ml-5">
                  <Text className="text-base text-red-500">CVV</Text>
                  <TextInput
                    className="p-3 border border-gray-500 rounded-md h-18"
                    placeholderTextColor="#d3d3d3"
                    value={cardData.cvv}
                    onChangeText={text => handleCardDataChange('cvv', text)}
                  />
                </View>
              </View>
              <View className="relative">
                <Text className="text-base text-red-500">País</Text>
                <SelectList 
                  setSelected={(val) => setSelected(val)} 
                  data={data} 
                  save="value"
              />
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
                <TouchableOpacity className="h-10 w-40 rounded-md bg-red-500 flex items-center justify-center" onPress={handleConfirmDelete}>
                  <Text className="text-white">Confirmar</Text>
                </TouchableOpacity>
              </View>
          </View>
        </Modal>
                
        <Modal visible={showExitConfirmation} animationType="fade" transparent={true}>
          <View className="flex-1 justify-center items-center bg-black bg-opacity-10">
            <View className="bg-white rounded-md p-20 items-center">
              <Text className=" font-bold text-lg mb-8">Sair do App?</Text>
              <View>
                <TouchableOpacity className="h-10 w-40 mb-4 rounded-md bg-orange-500 flex items-center justify-center" onPress={handleCancelExit}>
                  <Text className="text-white">Cancelar</Text>
                </TouchableOpacity>
                </View>
                <View>
                <TouchableOpacity className="h-10 w-40 rounded-md bg-red-500 flex items-center justify-center" onPress={() => navigation.navigate('deleteAccount')}>
                  <Text className="text-white">Confirmar</Text>
                </TouchableOpacity>
                </View>
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
});