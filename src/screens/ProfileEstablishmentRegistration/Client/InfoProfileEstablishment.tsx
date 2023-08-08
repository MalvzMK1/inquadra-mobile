import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp } from "@react-navigation/native"
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import MaskInput, { Masks } from 'react-native-mask-input';
import { SelectList } from 'react-native-dropdown-select-list';
import useUpdateEstablishment from '../../../hooks/useUpdateEstablishment';
import { useGetUserEstablishmentInfos } from '../../../hooks/useGetUserEstablishmentInfos';
import { z } from 'zod';

const tora = {
  "establishment_id": 2,
  "corporate_name": "Teste Deu Tora",
  "cnpj": "56119122000123",
  "phone_number": "(99)9999-9999",
  "cep": "06233031",
  "latitude": "-23.514366416737303",
  "longitude": "-46.78709989124614",
  "street_name": "R. Calixto Da Tora",
  "amenities": ["1", "2"],
  "cellphone_number": "(99)09999-9999",
  "photos": ["2"]
}
const userId = "1"

export default function InfoProfileEstablishment() {
  const [updateEstablishmentHook, { data, error, loading }] = useUpdateEstablishment()
  const { data: userByEstablishmentData, error: userByEstablishmentError, loading: userByEstablishmentLoading } = useGetUserEstablishmentInfos(userId)
  console.log(userByEstablishmentData?.usersPermissionsUser.data.attributes.establishment.data.attributes)

  const [userName, setUserName] = useState(userByEstablishmentData?.usersPermissionsUser.data.attributes.username)
  const [userEmail, setUserEmail] = useState(userByEstablishmentData?.usersPermissionsUser.data.attributes.email)
  const [phoneNumber, setPhoneNumber] = useState(userByEstablishmentData?.usersPermissionsUser.data.attributes.phoneNumber)
  const [cpf, setCpf] = useState(userByEstablishmentData?.usersPermissionsUser.data.attributes.cpf)

  const [editFantasyNameModal, setEditFantasyNameModal] = useState(false);
  const closeEditFantasyNameModal = () => setEditFantasyNameModal(false)
  const [editAddressModal, setEditAddressModal] = useState(false)
  const closeEditAddressModal = () => setEditAddressModal(false)
  const [editCNPJModal, setEditCNPJModal] = useState(false)
  const closeEditCNPJModal = () => setEditCNPJModal(false)
  const [editPasswordModal, setEditPasswordModal] = useState(true)
  const closeEditPasswordModal = () => setEditPasswordModal(false)
  const [selected, setSelected] = useState("")

  // const setAllFalse = () => {
  //   setEditFantasyNameModal(false)
  //   setEditAddressModal(false)
  //   setEditCNPJModal(false)
  //   setEditPasswordModal(false)
  // }

  // const handleOptionChange = (option: string) => {
  //   console.log(option);

  //   setSelected(option)

  //   if (selected == "Nome Fantasia") {
  //     setAllFalse()
  //     setEditFantasyNameModal(true)
  //   }
  //   else if (selected == "Endereço") {
  //     setAllFalse()
  //     setEditAddressModal(true)
  //   }
  //   else if (selected == "CNPJ") {
  //     setAllFalse()
  //     setEditCNPJModal(true)
  //   }
  //   else {
  //     setAllFalse()
  //     setEditPasswordModal(true)
  //   }
  // }

  const updateEstablishment = async () => {
    await updateEstablishmentHook({
      variables: {
        establishment_id: 2,
        corporate_name: "Teste deu tora",
        cnpj: "56119122000123",
        phone_number: "(99)9999-9999",
        cep: "06233031",
        latitude: "-23.514366416737303",
        longitude: "-46.78709989124614",
        street_name: "R. Calixto Da Tora",
        amenities: ["1", "2"],
        cellphone_number: "(99)09999-9999",
        photos: ["2"]
      }
    })
  }

  const [expiryDate, setExpiryDate] = useState('');

  const handleExpiryDateChange = (formatted: string) => {
    setExpiryDate(formatted);
  };

  const [cvv, setCVV] = useState('');

  const dataEstablishment = [
    { key: '1', value: 'Razão Social' },
    { key: '2', value: 'Nome Fantasia' },
    { key: '3', value: 'Endereço' },
    { key: '4', value: 'CNPJ' },
    { key: '5', value: 'Alterar Senha' },
  ]

  const dataAmenities = [
    { key: '1', value: 'Estacionamento' },
    { key: '2', value: 'Bar & Restaurante' },
    { key: '3', value: 'Vestiário' },
    { key: '4', value: 'Espaço Kids' },
  ]

  const dataCourts = [
    { key: '1', value: 'Quadra 1' },
    { key: '2', value: 'Campo 1' },
    { key: '3', value: 'Quadra 2' },
    { key: '4', value: 'Campo 2' },
  ]


  const [profilePicture, setProfilePicture] = useState(userByEstablishmentData?.usersPermissionsUser.data.attributes.photo.data?.attributes.url);


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


  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const [showCard, setShowCard] = useState(false);

  const [showCameraIcon, setShowCameraIcon] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  const handleCardClick = () => {
    setShowCard(!showCard);
    setShowCameraIcon(false);
  };


  const [selectedValue, setSelectedValue] = useState('');

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
            <TextInput value={userName} onChangeText={setUserName} className="p-4 border border-gray-500 rounded-lg h-45" placeholder='Jhon' placeholderTextColor="#B8B8B8" />
          </View>

          <View>
            <Text className="text-base">E-mail</Text>
            <TextInput value={userEmail} onChangeText={setUserEmail} keyboardType='email-address' className="p-4 border border-gray-500 rounded-lg h-45" placeholder='Jhon@mail.com.br' placeholderTextColor="#B8B8B8" />
          </View>
          <View>
            <Text className="text-base">Telefone</Text>
            <MaskInput
              className='p-4 border border-gray-500 rounded-lg h-45'
              placeholder='Ex: (00) 0000-0000'
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              mask={Masks.BRL_PHONE}>
            </MaskInput>
          </View>

          <View>
            <Text className="text-base">CPF</Text>
            <MaskInput
              className='p-4 border border-gray-500 rounded-lg h-45'
              placeholder='Ex: 000.000.000-00'
              value={cpf}
              onChangeText={setCpf}
              mask={Masks.BRL_CPF}>
            </MaskInput>
          </View>

          <TouchableOpacity onPress={handleCardClick}>
            <Text className="text-base">Chave PIX</Text>
            <View className="h-12 border border-gray-500 rounded-lg">
              <View className="flex-row justify-center items-center m-2">
                <Text className="flex-1 text-base text-[#B8B8B8]"> Chaves Cadastradas
                </Text>

                <Icon name={showCard ? 'chevron-up' : 'chevron-down'} size={25} color="#FF4715" style={{ marginRight: 8 }} />
              </View>
            </View>
          </TouchableOpacity>

          {showCard && (
            <View className="border border-gray-500 p-4 ">
              <View className="flex-row justify-between">
                <View className="flex-1">
                  <Text className="text-base text-[#FF6112] mb-3">Chave PIX</Text>
                  <View>
                    <TextInput className="p-4 border border-gray-500 rounded-md" placeholder='Coloque sua chave PIX' placeholderTextColor="#B8B8B8" />
                  </View>
                </View>
              </View>

              <View className="p-2 justify-center items-center">
                <TouchableOpacity onPress={handleSaveCard} className="w-80 h-10 rounded-md bg-[#FF6112] flex items-center justify-center">
                  <Text className="text-white">Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <View>
            <View className="">
              <Text className='text-base mb-1'>Dados Estabelecimento</Text>
              <SelectList
                setSelected={(val: string) => setSelected(val)}
                data={dataEstablishment}
                save="value"
                placeholder='Selecione um dado'
                searchPlaceholder="Pesquisar..."
                dropdownTextStyles={{ color: "#FF6112" }}
                inputStyles={{ alignSelf: "center", height: 14, color: "#B8B8B8" }}
                closeicon={<Ionicons name="close" size={20} color="#FF6112" />}
                searchicon={<Ionicons name="search" size={18} color="#FF6112" style={{ marginEnd: 10 }} />}
                arrowicon={<AntDesign name="down" size={20} color="#FF6112" style={{ alignSelf: "center" }} />}

              />
            </View>

          </View>
          <View className="">
            <Text className='text-base mb-1'>Amenidades do Local</Text>
            <SelectList
              setSelected={(val: string) => setSelected(val)}
              data={dataAmenities}
              save="value"
              placeholder='Selecione um dado'
              searchPlaceholder="Pesquisar..."
              dropdownTextStyles={{ color: "#FF6112" }}
              inputStyles={{ alignSelf: "center", height: 14, color: "#B8B8B8" }}
              closeicon={<Ionicons name="close" size={20} color="#FF6112" />}
              searchicon={<Ionicons name="search" size={18} color="#FF6112" style={{ marginEnd: 10 }} />}
              arrowicon={<AntDesign name="down" size={20} color="#FF6112" style={{ alignSelf: "center" }} />}

            />
          </View>

          <View className="">
            <Text className='text-base mb-1'>Editar Quadra/Campo</Text>
            <SelectList
              setSelected={(val: string) => setSelected(val)}
              data={dataCourts}
              save="value"
              placeholder='Selecione um dado'
              searchPlaceholder="Pesquisar..."
              dropdownTextStyles={{ color: "#FF6112" }}
              inputStyles={{ alignSelf: "center", height: 14, color: "#B8B8B8" }}
              closeicon={<Ionicons name="close" size={20} color="#FF6112" />}
              searchicon={<Ionicons name="search" size={18} color="#FF6112" style={{ marginEnd: 10 }} />}
              arrowicon={<AntDesign name="down" size={20} color="#FF6112" style={{ alignSelf: "center" }} />}

            />
          </View>

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
              <TouchableOpacity className="h-10 w-40 rounded-md bg-red-500 flex items-center justify-center" onPress={handleConfirmDelete} onPressIn={() => navigation.navigate('DeleteAccountEstablishment')}>
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

        <Modal visible={editFantasyNameModal} animationType="fade" transparent={true} onRequestClose={closeEditFantasyNameModal}>
          <View className='h-full w-full justify-center items-center'>
            <View className='h-fit w-[350px] bg-[#f8f4f2] rounded-[5px] p-6'>

              <View className='w-full'>
                <Text className='text-[14px] font-bold'>Insira um novo nome fantasia:</Text>
                <TextInput
                  className='p-[5px] border border-neutral-400 rounded bg-white'
                />
              </View>

              <View className='w-full'>
                <Text className='text-[14px] font-bold'>Confirme o nome fantasia:</Text>
                <TextInput
                  className='p-[5px] border border-neutral-400 rounded bg-white'
                />
              </View>

              <View className="flex flex-row items-center mt-[10px]">
                <TouchableOpacity
                  onPress={() => {
                    closeEditFantasyNameModal()
                  }}
                  className='h-fit w-[146px] rounded-md bg-[#F0F0F0] items-center justify-center mr-[4px] p-[8px]'>
                  <Text className="font-medium text-[14px] text-[#8D8D8D]">Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  // closeConfirmCancelModal()
                  // setShowSuccessCancel(true)
                }} className='h-fit w-[146px] rounded-md bg-[#FF6112] flex items-center justify-center ml-[4px] p-[8px]'>
                  <Text className="font-medium text-[14px] text-white">Confirmar</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>

        <Modal visible={editAddressModal} animationType='fade' transparent={true} onRequestClose={closeEditAddressModal}>
          <View className='h-full w-full justify-center items-center'>
            <View className='h-fit w-[350px] bg-[#f8f4f2] rounded-[5px] p-6'>

              <View className='w-full'>
                <Text className='text-[14px] font-bold'>Insira o número do seu CEP:</Text>
                <MaskInput
                  className='p-[5px] border border-neutral-400 rounded bg-white'
                  mask={Masks.ZIP_CODE}
                  keyboardType='numeric'
                />
              </View>

              <View className='w-full'>
                <Text className='text-[14px] font-bold'>Insira o nome da sua rua:</Text>
                <TextInput
                  className='p-[5px] border border-neutral-400 rounded bg-white'
                />
              </View>

              <View className="flex flex-row items-center mt-[10px]">
                <TouchableOpacity
                  onPress={() => {
                    closeEditAddressModal()
                  }}
                  className='h-fit w-[146px] rounded-md bg-[#F0F0F0] items-center justify-center mr-[4px] p-[8px]'>
                  <Text className="font-medium text-[14px] text-[#8D8D8D]">Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  // closeConfirmCancelModal()
                  // setShowSuccessCancel(true)
                }} className='h-fit w-[146px] rounded-md bg-[#FF6112] flex items-center justify-center ml-[4px] p-[8px]'>
                  <Text className="font-medium text-[14px] text-white">Confirmar</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>

        <Modal visible={editCNPJModal} animationType='fade' transparent={true} onRequestClose={closeEditCNPJModal}>
          <View className='h-full w-full justify-center items-center'>
            <View className='h-fit w-[350px] bg-[#f8f4f2] rounded-[5px] p-6'>

              <View className='w-full'>
                <Text className='text-[14px] font-bold'>Seu CNPJ:</Text>
                <TextInput
                  className='p-[5px] border border-neutral-400 rounded bg-white'
                  value={userByEstablishmentData?.usersPermissionsUser.data.attributes.establishment.data.attributes.cnpj}
                  editable={false}
                />
              </View>

              <View className="flex flex-row items-center mt-[10px]">
                <TouchableOpacity onPress={() => {
                  closeEditCNPJModal()
                }} className='h-fit w-full rounded-md bg-[#FF6112] flex items-center justify-center ml-[4px] p-[8px]'>
                  <Text className="font-medium text-[14px] text-white">Confirmar</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>

        <Modal visible={editPasswordModal} animationType='fade' transparent={true} onRequestClose={closeEditPasswordModal}>
          <View className='h-full w-full justify-center items-center'>
            <View className='h-fit w-[350px] bg-[#f8f4f2] rounded-[5px] p-6'>

              <View className='w-full'>
                <Text className='text-[14px] font-bold'>Insira a sua senha atual:</Text>
                <TextInput
                  className='p-[5px] border border-neutral-400 rounded bg-white'
                />
              </View>

              <View className='w-full'>
                <Text className='text-[14px] font-bold'>Insira sua nova senha:</Text>
                <TextInput
                  className='p-[5px] border border-neutral-400 rounded bg-white'
                />
              </View>

              <View className='w-full'>
                <Text className='text-[14px] font-bold'>Confirme sua nova senha:</Text>
                <TextInput
                  className='p-[5px] border border-neutral-400 rounded bg-white'
                />
              </View>

              <View className="flex flex-row items-center mt-[10px]">
                <TouchableOpacity
                  onPress={() => {
                    closeEditPasswordModal()
                  }}
                  className='h-fit w-[146px] rounded-md bg-[#F0F0F0] items-center justify-center mr-[4px] p-[8px]'>
                  <Text className="font-medium text-[14px] text-[#8D8D8D]">Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  // closeConfirmCancelModal()
                  // setShowSuccessCancel(true)
                }} className='h-fit w-[146px] rounded-md bg-[#FF6112] flex items-center justify-center ml-[4px] p-[8px]'>
                  <Text className="font-medium text-[14px] text-white">Confirmar</Text>
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
