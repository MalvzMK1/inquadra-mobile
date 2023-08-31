import React, { useState } from 'react';
import { View, Text, Button, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import axios from 'axios';

const UploadImage = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Função para escolher uma imagem da galeria
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permissão de acesso à galeria necessária!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.uri);
    }
  };

  const uploadImage = async () => {
    const apiUrl = 'https://inquadra-api-uat.qodeless.io';
    
    const formData = new FormData();
    formData.append('files', {
      uri: selectedImage,
      name: 'image.jpg', 
      type: 'image/jpeg', 
    });

    try {
      const response = await axios.post(`${apiUrl}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Imagem enviada com sucesso!', response.data);
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
    }
  };

  return (
    <View>
      {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: 600, height: 200 }} />}
      <Button title="Escolher Imagem" onPress={pickImage} />
      {selectedImage && <Button title="Enviar Imagem" onPress={uploadImage} />}
    </View>
  );
};

export default UploadImage;
