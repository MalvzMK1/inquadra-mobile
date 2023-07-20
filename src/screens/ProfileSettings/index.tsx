import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Modal, } from 'react-native';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import useGetNextToCourts from '../../hooks/useNextToCourts';
import { userEstablishmentQuery } from '../../graphql/queries/userEstablishmentInfo';
import useGetUserEstablishmentInfos from '../../hooks/useGetUserEstablishmentInfos';
import useGetMenuUser from '../../hooks/useMenuUser';
import useGetNextToCourtsById from '../../hooks/useNextToCourtById';
import useGetUserById from '../../hooks/useUserById';
import useSchedule from '../../hooks/useSchedule';

export default function ProfileSettings() {
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
    // excluir conta
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

  const { loading, error, data } = useSchedule();

  if (loading) return <Text>Loading ...</Text>;
  return <Text>Hello {JSON.stringify(data)}!</Text>;

  // if (loading) return <Text>Loading ...</Text>;
  // return <Text>Hello {JSON.stringify(data?.usersPermissionsUser.data.attributes.photo)}!</Text>;

  return (
    <View className="flex-1 bg-white h-full">
      
      <ScrollView className="flex-grow p-1">
        <TouchableOpacity className="items-center mt-8">
          <Image source={require('../../assets/picture.png')} className="w-100 h-100 rounded-full" />
          <Text className="mt-10 text-gray-500 text-base">Trocar foto de perfil</Text>
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
                  {showCard ? <Icon name="camera" size={25} color="#FF4715" /> : 'Adicionar Cartão'}
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
                <TouchableOpacity className="h-10 w-40 mb-4 rounded-md bg-orange-500 flex items-center justify-center" onPress={handleCancelExit}>
                  <Text className="text-white">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity className="h-10 w-40 rounded-md bg-red-500 flex items-center justify-center" onPress={handleConfirmExit}>
                  <Text className="text-white">Confirmar</Text>
                </TouchableOpacity>
              </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}