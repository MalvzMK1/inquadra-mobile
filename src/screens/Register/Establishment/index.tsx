import {View, Text, TouchableOpacity, TextInput, Image, FlatList, ActivityIndicator, Platform} from "react-native";

import React, {useEffect, useState} from "react";
import MaskInput, { Masks } from 'react-native-mask-input';
import { ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from 'zod'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import useAllAmenities from "../../../hooks/useAllAmenities";

interface IFormSchema {
	name: string,
	cnpj: string,
	phone: string,
	address: Omit<Address, 'id' | 'latitude' | 'longitude'>,
	amenities?: Amenitie[]
}

const formSchema = z.object({
	name: z.string()
		.nonempty('Esse campo não pode estar vazio!'),
	cnpj: z.string()
		.nonempty('Esse campo não pode estar vazio!')
		.min(14, 'Deve ser informado um CNPJ válido!'),
	phone: z.string()
		.nonempty('Esse campo não pode estar vazio!')
		.min(11, 'Deve ser informado um número de telefone válido!'),
	address: z.object({
		cep: z.string()
			.nonempty('Esse campo não pode estar vazio!')
			.min(8, 'Deve ser informado um CEP válido!'),
		number: z.string()
			.nonempty('Esse campo não pode estar vazio!'),
		streetName: z.string()
			.nonempty('Esse campo não pode estar vazio!'),
	}),
	amenities: z.optional(z.array(z.object({
		id: z.string(),
		name: z.string()
	})))
})

export default function RegisterEstablishment({navigation, route}: NativeStackScreenProps<RootStackParamList, 'EstablishmentRegister'>) {
	const {
		control,
		handleSubmit,
		formState: {errors},
		getValues
	} = useForm<IFormSchema>({
		resolver: zodResolver(formSchema)
	})

	const [profilePicture, setProfilePicture] = useState(null);
	const [photos, setPhotos] = useState<Array<{uri: string}>>([]);
	const [selected, setSelected] = useState<Array<string>>([]);
	const [selectAmenitiesData, setSelectAmenitiesData] = useState<Array<{key: string, value: string}>>([])

	function handleAmenitieClick(providedAmenitieId: Array<string>): void {
		console.log(providedAmenitieId);
	}

	const {
		data: amenitiesData,
		loading: amenitiesLoading,
		error: amenitiesError
	} = useAllAmenities();

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
				allowsMultipleSelection: true, // Habilita a seleção múltipla de fotos
				base64: true,
			});

			if (!result.canceled) {
				if (photos.length > 0)
					setPhotos([...photos, { uri: result.uri }]);
				else
					setPhotos([{uri: result.uri}])
			}
		} catch (error) {
			console.log('Erro ao carregar a imagem: ', error);
		}
	};

	function transformBase64ToBinary(base64: string): void {
		// TODO: TRANSFORM BASE64 IMAGE TO BINARY
	}

	const handleDeletePhoto = (index) => {
		const newPhotos = [...photos];
		newPhotos.splice(index, 1);
		setPhotos(newPhotos);
	};

	function submitForm(data: IFormSchema) {
		console.log({data, amenities: selected})

		navigation.navigate('RegisterCourt', {
			photos: undefined,
			cnpj: data.cnpj,
			address: data.address,
			phoneNumber: data.phone,
			corporateName: data.name
		})
	}

	useEffect(() => {
		if (!amenitiesLoading && !amenitiesError && amenitiesData?.amenities.data) {
			const updatedAmenitiesData = amenitiesData?.amenities.data.map(amenitie => ({
				key: amenitie.id,
				value: amenitie.attributes.name,
			}));

			console.log(selectAmenitiesData, updatedAmenitiesData)

			selectAmenitiesData.forEach(amenitie => {
				updatedAmenitiesData.forEach((newAmenitie, index) => {
					if (amenitie.key === newAmenitie.key) updatedAmenitiesData.splice(index, index)
				})
			})

			setSelectAmenitiesData(prevState => [...prevState, ...updatedAmenitiesData]);
		}
	}, [amenitiesData])

	return (
		<ScrollView className="h-fit bg-white flex-1">
			{/*{errors && <Text>{JSON.stringify(errors)}</Text>}*/}
			{amenitiesLoading && selectAmenitiesData.length === 0 ? <ActivityIndicator size='large' color='#F5620F' /> :
				<View>
					<View className="items-center mt-9 p-4">
					<Text className="text-3xl text-center font-extrabold text-gray-700">Cadastro{'\n'}Estabelecimento</Text>
				</View>
						<View className='h-fit'>
							<View className='p-5 gap-7 flex flex-col justify-between'>
								<View>
									<Text className='text-xl p-1'>Nome do Estabelecimento</Text>
									<Controller
										name='name'
										control={control}
										render={({field: {onChange}}) => (
											<TextInput
												className='p-5 border border-neutral-400 rounded'
												placeholder='Ex.: Quadra do Zeca'
												onChangeText={onChange}
											/>
										)}
									/>
					{errors.name && <Text className='text-red-400 text-sm'>{errors.name.message}</Text> }
					</View>
						<View>
							<Text className="text-xl p-1">CNPJ</Text>
							<Controller
								name='cnpj'
								control={control}
								render={({field: {onChange}}) => (
									<MaskInput
										className='p-5 border border-neutral-400 rounded'
										placeholder='00.000.000/0001-00.'
										value={getValues('cnpj')}
										maxLength={18}
										keyboardType={'numeric'}
										onChangeText={(masked, unmasked) => onChange(unmasked)}
										mask={Masks.BRL_CNPJ}
									/>
								)}
							/>
							{errors.cnpj && <Text className='text-red-400 text-sm'>{errors.cnpj.message}</Text>}
						</View>
						<View>
							<Text className="text-xl p-1">Telefone para Contato</Text>
							<Controller
								name='phone'
								control={control}
								render={({field: {onChange}}) => (
									<MaskInput
										className='p-5 border border-neutral-400 rounded'
										placeholder='(00) 0000-0000'
										value={getValues('phone')}
										maxLength={15}
										keyboardType={'numeric'}
										onChangeText={(masked, unmasked) => onChange(unmasked)}
										mask={Masks.BRL_PHONE}
									/>
								)}
							/>
							{errors.phone && <Text className='text-red-400 text-sm'>{errors.phone.message}</Text>}
						</View>
						<View>
							<Text className='text-xl p-1'>Endereço</Text>
							<Controller
								name='address.streetName'
								control={control}
								render={({field: {onChange}}) => (
									<TextInput
										className='p-5 border border-neutral-400 rounded'
										placeholder='Rua Rufus'
										onChangeText={onChange}
									/>
								)}
							/>
							{errors.address?.streetName && <Text className='text-red-400 text-sm'>{errors.address?.streetName.message}</Text>}
						</View>
						<View className="flex flex-row justify-between">
							<View>
								<Text className='text-xl p-1'>Número</Text>
								<Controller
									name='address.number'
									control={control}
									render={({field: {onChange}}) => (
										<TextInput
											className='p-5 border border-neutral-400 rounded'
											placeholder='123'
											onChangeText={onChange}
											keyboardType={'numbers-and-punctuation'}
										/>
									)}
								/>
								{errors.address?.number && <Text className='text-red-400 text-sm'>{errors.address?.number.message}</Text>}
							</View>
							<View>
								<Text className='text-xl p-1'>CEP</Text>
								<Controller
									name='address.cep'
									control={control}
									render={({field: {onChange}}) => (
										<MaskInput
											className='p-5 border border-neutral-400 rounded w-44'
											placeholder='0000-000'
											value={getValues('address.cep')}
											onChangeText={onChange}
											maxLength={9}
											keyboardType={'numeric'}
											mask={Masks.ZIP_CODE}
										/>
									)}
								/>
								{errors.address?.cep && <Text className='text-red-400 text-sm'>{errors.address?.cep.message}</Text>}
							</View>
						</View>
					</View>
						<View>
							<Text className="text-xl p-1">Amenidades do Local</Text>
							<Controller
								name='amenities'
								control={control}
								render={({field: {onChange}}) => (
									<MultipleSelectList
										setSelected={(val: Array<string>) => setSelected(val)}
										// @ts-ignore
										data={selectAmenitiesData}
										save={'key'}
										placeholder="Selecione aqui..."
										label="Amenidades escolhidas:"
										boxStyles={{borderRadius: 4, minHeight: 55}}
										inputStyles={{color: "#FF6112", alignSelf: "center"}}
										searchPlaceholder="Procurar"
										badgeStyles={{ backgroundColor: "#FF6112"}}
										closeicon={<Ionicons name="close" size={20} color="#FF6112" />}
										searchicon={<Ionicons name="search" size={18} color="#FF6112" style={{ marginEnd: 10 }} />}
										arrowicon={<AntDesign name="down" size={13} color="#FF6112" style={{marginEnd: 2, alignSelf: "center"}} />}
									/>
								)}
							/>
							{errors.amenities && <Text className='text-red-400 text-sm'>{errors.amenities.message}</Text>}
						</View>
						<View>
							<Text className="text-xl p-1">Fotos do estabelecimento</Text>

							<View className="border rounded relative">
								<View className="flex flex-row">
									<Text className="text-base text-gray-400 font-bold m-6" onPress={handleProfilePictureUpload}>Carregue as fotos do Estabelecimento. {"\n"} Ex: frente, o bar, o vestiário e afins. </Text>
									<Ionicons name="star-outline" size={20} color="#FF6112" style = {{ marginTop: 35, marginLeft: 15 }} onPress={handleProfilePictureUpload} />
								</View>

								<FlatList
									className="h-max"
									data={photos}
									renderItem={({ item, index }) => (
										<View style={{ flexDirection: 'row', alignItems: 'center' }}>
											<Image source={{ uri: item.uri }} style={{ width: 100, height: 100, margin: 10}} />
											<TouchableOpacity style={{ position: 'absolute', right: 0, left: 0, bottom: 0, top: 0, justifyContent: 'center', alignItems: 'center' }} onPress={() => handleDeletePhoto(index)}>
												<Ionicons name="trash" size={20} color="orange" />
											</TouchableOpacity>
										</View>
									)}
									keyExtractor={(item, index) => index.toString()}
									horizontal
								/>
							</View>
						</View>
						<View>
							<TouchableOpacity className='h-14 w-81 rounded-md bg-[#FF6112] items-center justify-center' onPressIn={handleSubmit(submitForm)}>
								<Text className='text-gray-50'>Continuar</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			}
		</ScrollView>
	);
}
