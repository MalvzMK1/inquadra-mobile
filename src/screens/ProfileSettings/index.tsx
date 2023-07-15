import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Picker, Modal, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function ProfileSettings() {
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
    // Lógica para excluir a conta aqui
    setShowDeleteConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handleExitApp = () => {
    setShowExitConfirmation(true);
  };

  const handleConfirmExit = () => {
    // Lógica para sair do aplicativo aqui
    setShowExitConfirmation(false);
  };

  const handleCancelExit = () => {
    setShowExitConfirmation(false);
  };

  const countries = ['Brasil', 'Estados Unidos', 'Canadá', 'Reino Unido'];

  return (
    <View style={{ flex: 1, backgroundColor: 'white', height: '100%' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 10 }}>
        <TouchableOpacity style={{ alignItems: 'center', marginTop: 20 }}>
          <Image source={require('../../assets/picture.png')} style={{ width: 100, height: 100, borderRadius: 50 }} />
          <Text style={{ marginTop: 10, fontSize: 16, color: 'gray' }}>Trocar foto de perfil</Text>
        </TouchableOpacity>

        <View style={{ padding: 6, gap: 10 }}>
          <View>
            <Text style={{ fontSize: 17 }}>Nome</Text>
            <TextInput style={{ padding: 4, borderWidth: 1, borderColor: 'gray', borderRadius: 5, height: 45 }} placeholder='Larissa' placeholderTextColor="#d3d3d3" />
          </View>

          <View>
            <Text style={{ fontSize: 17 }}>E-mail</Text>
            <TextInput style={{ padding: 4, borderWidth: 1, borderColor: 'gray', borderRadius: 5, height: 45 }} placeholder='larissa@mail.com.br' placeholderTextColor="#d3d3d3" />
          </View>

          <View>
            <Text style={{ fontSize: 17 }}>Telefone</Text>
            <TextInput style={{ padding: 4, borderWidth: 1, borderColor: 'gray', borderRadius: 5, height: 45 }} placeholder='(00) 00000-0000' placeholderTextColor="#d3d3d3" />
          </View>

          <View>
            <Text style={{ fontSize: 17 }}>CPF</Text>
            <TextInput style={{ padding: 4, borderWidth: 1, borderColor: 'gray', borderRadius: 5, height: 45 }} placeholder='000.000000-00' placeholderTextColor="#d3d3d3" />
          </View>

          <TouchableOpacity onPress={handleCardClick}>
            <Text style={{ fontSize: 17 }}>Dados Cartão</Text>
            <View style={{ height: 45, borderWidth: 1, borderColor: 'gray', borderRadius: 5 }}>
              <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <IconButton
                  icon={showCameraIcon ? 'camera' : 'credit-card-plus'}
                  size={25}
                  style={{ marginRight: 5, alignItems: 'center' }}
                />
                <Text style={{ flex: 1, fontSize: 17, textAlign: 'right', marginBottom: 5 }}>
                  {showCard ? <Icon name="camera" size={25} color="orange" /> : 'Adicionar Cartão'}
                </Text>
                <Icon name={showCard ? 'chevron-up' : 'chevron-down'} size={25} color="orange" style={{ marginLeft: 'auto' }} />
              </View>
            </View>
          </TouchableOpacity>

          {showCard && (
            <View style={{ borderWidth: 1, borderColor: 'gray', borderRadius: 5, padding: 10, marginTop: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, marginRight: 5 }}>
                  <Text style={{ fontSize: 17, color: '#FF4715' }}>Data venc.</Text>
                  <TextInput
                    style={{ padding: 4, borderWidth: 1, borderColor: 'gray', borderRadius: 5, height: 40 }}
                    placeholderTextColor="#d3d3d3"
                    value={cardData.expirationDate}
                    onChangeText={text => handleCardDataChange('expirationDate', text)}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 5 }}>
                  <Text style={{ fontSize: 17, color: "#FF4715" }}>CVV</Text>
                  <TextInput
                    style={{ padding: 4, borderWidth: 1, borderColor: 'gray', borderRadius: 5, height: 40 }}
                    placeholderTextColor="#d3d3d3"
                    value={cardData.cvv}
                    onChangeText={text => handleCardDataChange('cvv', text)}
                  />
                </View>
              </View>
              <View style={{ marginLeft: 5 }}>
                <Text style={{ fontSize: 17, color: "#FF4715" }}>País</Text>
                <Picker
                  selectedValue={cardData.country}
                  onValueChange={value => handleCardDataChange('country', value)}
                  style={{ height: 40, borderWidth: 1, borderColor: 'gray', borderRadius: 5 }}
                >
                  {countries.map((country, index) => (
                    <Picker.Item key={index} label={country} value={country} />
                  ))}
                </Picker>
              </View>
              <View style={{ padding: 2, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={handleSaveCard} style={{ height: 40, width: 280, borderRadius: 5, backgroundColor: '#FF4715', alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                  <Text style={{ color: 'white' }}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={{ padding: 5, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={handleDeleteAccount} style={{ margin: 6, height: 40, width: 280, borderRadius: 5, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: 'white' }}>Excluir essa conta</Text>
            </TouchableOpacity>
          </View>

          <View style={{ padding: 2, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={handleExitApp} style={{ height: 40, width: 280, borderRadius: 5, backgroundColor: '#FF4715', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: 'white' }}>Sair do App</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal de confirmação de exclusão */}
        <Modal visible={showDeleteConfirmation} animationType="fade" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Deseja realmente excluir essa conta?</Text>
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: 'red' }]} onPress={handleConfirmDelete}>
                  <Text style={styles.modalButtonText}>Sim</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: 'gray' }]} onPress={handleCancelDelete}>
                  <Text style={styles.modalButtonText}>Não</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal de confirmação de saída */}
        <Modal visible={showExitConfirmation} animationType="fade" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Deseja realmente sair do aplicativo?</Text>
              <View style={styles.modalButtonsContainer}>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: 'red' }]} onPress={handleConfirmExit}>
                  <Text style={styles.modalButtonText}>Sim</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, { backgroundColor: 'gray' }]} onPress={handleCancelExit}>
                  <Text style={styles.modalButtonText}>Não</Text>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    marginBottom: 10,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    borderRadius: 5,
    padding: 10,
    width: 100,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
  },
});
