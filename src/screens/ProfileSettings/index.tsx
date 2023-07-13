import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProfileSettings() {
  const navigation = useNavigation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };


  return (
    <View style={{ flex: 1, backgroundColor: 'white', height: '100%' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={25} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Perfil</Text>
        <TouchableOpacity style={{ paddingRight: 10 }}>
          <Image source={require('../../assets/picture.png')} style={{ width: 30, height: 30, borderRadius: 15 }} />
        </TouchableOpacity>
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
            
        </View>

        <View style={{ padding: 5, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={{ margin: 6, height: 45, width: 280, borderRadius: 5, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.navigate('RegisterPassword')}>
            <Text style={{ color: 'white' }}>Excluir essa conta</Text>
          </TouchableOpacity>
        </View>

        <View style={{ padding: 2, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={{ height: 45, width: 280, borderRadius: 5, backgroundColor: '#FF4715', alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.navigate('RegisterPassword')}>
            <Text style={{ color: 'white' }}>Sair do App</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}
