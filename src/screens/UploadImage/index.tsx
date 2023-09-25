import React, { useState } from 'react';
import { View, Text, Button, Image, TouchableOpacity, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons'; // Certifique-se de que o pacote Ionicons está instalado

import axios from 'axios';

const UploadImage = () => {
    const [photos, setPhotos] = useState([]);

    const handleProfilePictureUpload = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permissão de acesso à galeria necessária!');
            return;
        }

        // const result = await ImagePicker.launchImageLibraryAsync({
        //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //     allowsEditing: true,
        //     quality: 1,
        //     allowsMultipleSelection: true,
        // });

        // if (!result.canceled) {
        //     setPhotos([...photos, result.uri]);
        // }
    };

    const handleDeletePhoto = (index: any) => {
        const newPhotos = [...photos];
        newPhotos.splice(index, 1);
        setPhotos(newPhotos);
    };

    const uploadImage = async () => {
        const apiUrl = 'https://inquadra-api-uat.qodeless.io';

        try {
            const formData = new FormData();

            // Suponhamos que photos seja uma matriz de URIs de imagens
            photos.forEach(async (uri, index) => {
                try {
                    const response = await fetch(uri);
                    const blob = await response.blob();
                    formData.append("files", blob, `image${index}.jpg`);
                } catch (error) {
                    console.error("Erro ao carregar imagem:", error);
                }
            });

            const response = await axios.post(`${apiUrl}/api/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Imagens enviadas com sucesso!', response.data);
        } catch (error) {
            console.error('Erro ao enviar imagens:', error);
        }
    };

    return (
        <View>
            <Text style={{ fontSize: 18, padding: 10 }}>Fotos da quadra</Text>
            <View style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8 }}>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: 130,
                        margin: 6,
                    }}
                    onPress={handleProfilePictureUpload}
                >
                    <Text style={{ fontSize: 16, color: '#888', fontWeight: 'bold', margin: 6 }}>
                        Carregue suas fotos aqui.
                    </Text>
                    <Ionicons name="star-outline" size={20} color="#FF6112" style={{ marginEnd: 20 }} onPress={handleProfilePictureUpload} />
                </TouchableOpacity>
                <FlatList
                    data={photos}
                    horizontal
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={{ uri: item }} style={{ width: 100, height: 100, margin: 10 }} />
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    right: 0,
                                    left: 0,
                                    bottom: 0,
                                    top: 0,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                onPress={() => handleDeletePhoto(index)}
                            >
                                <Ionicons name="trash" size={25} color="#FF6112" />
                            </TouchableOpacity>
                        </View>
                    )}
                />
                {photos.length > 0 && <Button title="Salvar imagens" onPress={uploadImage} />}
            </View>
        </View>
    );
};

export default UploadImage;
