import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Modal } from 'react-native';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Picker from 'react-native-picker';

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

  const countries = [
    { name: 'Brasil' },
    { name: 'Estados Unidos' },
    { name: 'Canadá' },
    { name: 'Reino Unido' }
  ];

  return (
    <View className="flex-1 bg-white h-full">
      <View className="flex-row justify-between items-center p-4">
        {/* Content here */}
      </View>

      <ScrollView className="flex-grow p-4">
        <TouchableOpacity className="items-center mt-20">
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
            <View className="h-45 border border-gray-500 rounded-md">
              <View className="flex-row justify-center items-center">
                <IconButton
                  icon={showCameraIcon ? 'camera' : 'credit-card-plus'}
                  size={25}
                  className="items-flex-end"
                />
                <Text className="flex-1 text-base text-right mb-5">
                  {showCard ? <Icon name="camera" size={25} color="#FF4715" /> : 'Adicionar Cartão'}
                </Text>
                <Icon name={showCard ? 'chevron-up' : 'chevron-down'} size={25} color="#FF4715" className="ml-auto" />
              </View>
            </View>
          </TouchableOpacity>

          {showCard && (
            <View className="border border-gray-500 rounded-md p-4 mt-10">
              <View className="flex-row justify-between">
                <View className="flex-1 mr-5">
                  <Text className="text-base text-red-500">Data venc.</Text>
                  <TextInput
                    className="p-4 border border-gray-500 rounded-md h-40"
                    placeholderTextColor="#d3d3d3"
                    value={cardData.expirationDate}
                    onChangeText={text => handleCardDataChange('expirationDate', text)}
                  />
                </View>
                <View className="flex-1 ml-5">
                  <Text className="text-base text-red-500">CVV</Text>
                  <TextInput
                    className="p-4 border border-gray-500 rounded-md h-40"
                    placeholderTextColor="#d3d3d3"
                    value={cardData.cvv}
                    onChangeText={text => handleCardDataChange('cvv', text)}
                  />
                </View>
              </View>
              <View className="ml-5">
                <Text className="text-base text-red-500">País</Text>
                {/* <Picker
                  selectedValue={cardData.country}
                  onValueChange={value => handleCardDataChange('country', value)}
                  className="h-40 border border-gray-500 rounded-md"
                >
                  {countries.map((country, index) => (
                    <Picker.Item key={index} label={country.name} value={country.name} />
                  ))}
                </Picker> */}
              </View>
              <View className="p-2 justify-center items-center">
                <TouchableOpacity onPress={handleSaveCard} className="h-40 w-280 rounded-md bg-red-500 items-center justify-center m-20">
                  <Text className="text-white">Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View className="pt-15 justify-center items-center">
            <TouchableOpacity onPress={handleDeleteAccount} className="h-40 w-280 rounded-md bg-red-500 items-center justify-center">
              <Text className="text-white">Excluir essa conta</Text>
            </TouchableOpacity>
          </View>

          <View className="justify-center items-center">
            <TouchableOpacity onPress={handleExitApp} className="h-40 w-280 rounded-md bg-red-500 items-center justify-center">
              <Text className="text-white">Sair do App</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal visible={showDeleteConfirmation} animationType="fade" transparent={true}>
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white rounded-md p-20 items-center">
              <Text className="mb-10">Confirmar exclusão da conta?</Text>
              <View className="flex-col">
                <TouchableOpacity className="bg-black mb-6 w-250 rounded-md" onPress={handleCancelDelete}>
                  <Text className="text-white">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-red-500 w-250 rounded-md" onPress={handleConfirmDelete}>
                  <Text className="text-white">Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={showExitConfirmation} animationType="fade" transparent={true}>
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white rounded-md p-20 items-center">
              <Text className="mb-10">Deseja realmente sair do aplicativo?</Text>
              <View className="flex-col">
                <TouchableOpacity className="bg-black mb-6 w-250 rounded-md" onPress={handleCancelExit}>
                  <Text className="text-white">Não</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-red-500 w-250 rounded-md" onPress={handleConfirmExit}>
                  <Text className="text-white">Sim</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}