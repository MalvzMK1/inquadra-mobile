import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { ScrollView } from "react-native-gesture-handler";
import MaskInput, { Masks } from "react-native-mask-input";
import { z } from "zod";
import useAllAmenities from "../../../hooks/useAllAmenities";

interface IFormSchema {
  corporateName: string;
  cnpj: string;
  phone: string;
  address: Omit<Address, "id" | "latitude" | "longitude">;
  amenities?: Amenitie[];
}

const formSchema = z.object({
  corporateName: z.string().nonempty("Esse campo não pode estar vazio!"),
  cnpj: z
    .string()
    .nonempty("Esse campo não pode estar vazio!")
    .min(14, "Deve ser informado um CNPJ válido!"),
  phone: z
    .string()
    .nonempty("Esse campo não pode estar vazio!")
    .min(11, "Deve ser informado um número de telefone válido!"),
  address: z.object({
    cep: z
      .string()
      .nonempty("Esse campo não pode estar vazio!")
      .min(8, "Deve ser informado um CEP válido!"),
    number: z.string().nonempty("Esse campo não pode estar vazio!"),
    streetName: z.string().nonempty("Esse campo não pode estar vazio!"),
  }),
  amenities: z.optional(
    z.array(
      z.object({
        id: z.string(),
        name: z.string(),
      }),
    ),
  ),
});

export default function RegisterEstablishment({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "EstablishmentRegister">) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<IFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      corporateName: "Quadra do Zeca",
      amenities: [],
      cnpj: "89.498.498/4949-84",
      phone: "(22) 9 9999-9999",
      address: {
        streetName: "Rua teste",
        cep: "99999-999",
        number: "30",
      },
    },
  });

  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = React.useState([]);
  const { data: allAmenitiesData } = useAllAmenities();
  const [isLoading, setIsLoading] = useState(false);

  const handleProfilePictureUpload = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Erro", "É necessário permissão para acessar a galeria.");
        return;
      }
    } catch (error) {
      console.log("Erro ao carregar a imagem: ", error);
    }
  };

  const uploadImage = async () => {
    setIsLoading(true);
    const apiUrl = "https://inquadra-api-uat.qodeless.io";

    const formData = new FormData();
    photos.forEach((uri, index) => {
      fetch(uri)
        .then(response => response.blob())
        .then(blob => {
          formData.append(`files`, blob, `image${index}.jpg`);
        });
    });

    try {
      const response = await axios.post<Array<{ id: string }>>(
        `${apiUrl}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const uploadedImageIDs = response.data.map(image => image.id);

      console.log("Imagens enviadas com sucesso!", response.data);

      setIsLoading(false);

      return uploadedImageIDs;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const handleDeletePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);
  };

  async function submitForm(data: IFormSchema) {
    try {
      // const uploadedImageIDs = await uploadImage();
      const uploadedImageIDs: string[] = [];

      console.log({ data, amenities: selected, personalInfos: route.params });
      navigation.navigate("RegisterCourts", {
        cnpj: data.cnpj,
        address: data.address,
        photos: uploadedImageIDs,
        corporateName: data.corporateName,
        phoneNumber: data.phone,
      });
    } catch (error) {
      console.error("Erro: ", error);
      Alert.alert("Erro", "Não foi possível continuar.");
    }
  }

  const amenitiesOptions = useMemo(() => {
    if (!allAmenitiesData) {
      return [];
    }

    return allAmenitiesData.amenities.data.map(amenity => {
      return {
        key: amenity.id,
        value: amenity.attributes.name,
      };
    });
  }, [allAmenitiesData]);

  return (
    <ScrollView className="bg-white flex-1">
      <View className="items-center mt-2 p-4">
        <Text className="text-3xl text-center font-semibold text-gray-700">
          Cadastro{"\n"}Estabelecimento
        </Text>
      </View>
      <View className="h-fit">
        <View className="p-5 gap-2 flex flex-col justify-between">
          <View>
            <Text className="text-base mb-2 p-1">Nome do estabelecimento</Text>
            <Controller
              name="corporateName"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  className="p-5 border border-neutral-400 rounded"
                  placeholder="Ex.: Quadra do Zeca"
                  onChangeText={onChange}
                />
              )}
            />
            {errors.corporateName && (
              <Text className="text-red-400 text-sm">
                {errors.corporateName.message}
              </Text>
            )}
          </View>
          <View>
            <Text className="text-base mb-2 p-1">CNPJ</Text>
            <Controller
              name="cnpj"
              control={control}
              render={({ field: { onChange, value } }) => (
                <MaskInput
                  className="p-5 border border-neutral-400 rounded"
                  placeholder="00.000.000/0001-00."
                  value={value}
                  maxLength={18}
                  keyboardType={"numeric"}
                  onChangeText={(masked, unmasked) => onChange(unmasked)}
                  mask={Masks.BRL_CNPJ}
                />
              )}
            />
            {errors.cnpj && (
              <Text className="text-red-400 text-sm">
                {errors.cnpj.message}
              </Text>
            )}
          </View>
          <View>
            <Text className="text-base mb-2 p-1">Telefone para contato</Text>
            <Controller
              name="phone"
              control={control}
              render={({ field: { onChange, value } }) => (
                <MaskInput
                  className="p-5 border border-neutral-400 rounded"
                  placeholder="(00) 0000-0000"
                  value={value}
                  maxLength={15}
                  keyboardType={"numeric"}
                  onChangeText={(masked, unmasked) => onChange(unmasked)}
                  mask={Masks.BRL_PHONE}
                />
              )}
            />
            {errors.phone && (
              <Text className="text-red-400 text-sm">
                {errors.phone.message}
              </Text>
            )}
          </View>
          <View>
            <Text className="text-base mb-2 p-1">Endereço</Text>
            <Controller
              name="address.streetName"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="p-5 border border-neutral-400 rounded"
                  placeholder="Rua Rufus"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.address?.streetName && (
              <Text className="text-red-400 text-sm">
                {errors.address?.streetName.message}
              </Text>
            )}
          </View>
          <View className="flex-row w-full justify-center space-x-6">
            <View className="w-40">
              <Text className="text-base mb-2 p-1">Número</Text>
              <Controller
                name="address.number"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="p-5 border border-neutral-400 rounded"
                    placeholder="123"
                    onChangeText={onChange}
                    value={value}
                    keyboardType={"numbers-and-punctuation"}
                  />
                )}
              />
              {errors.address?.number && (
                <Text className="text-red-400 text-sm">
                  {errors.address?.number.message}
                </Text>
              )}
            </View>
            <View className="w-40">
              <Text className="text-base mb-2 p-1">CEP</Text>
              <Controller
                name="address.cep"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <MaskInput
                    className="p-5 border border-neutral-400 rounded"
                    placeholder="00000-000"
                    value={value}
                    onChangeText={onChange}
                    maxLength={9}
                    keyboardType={"numeric"}
                    mask={Masks.ZIP_CODE}
                  />
                )}
              />
              {errors.address?.cep && (
                <Text className="text-red-400 text-sm">
                  {errors.address?.cep.message}
                </Text>
              )}
            </View>
          </View>
          <View>
            <Text className="text-base mb-2 p-1">Amenidades do local</Text>
            <Controller
              name="amenities"
              control={control}
              render={({ field: { onChange } }) => (
                <MultipleSelectList
                  setSelected={(value: any) => setSelected(value)}
                  data={amenitiesOptions}
                  save={"key"}
                  placeholder="Selecione aqui..."
                  label="Amenidades escolhidas:"
                  boxStyles={{ borderRadius: 4, minHeight: 55 }}
                  inputStyles={{
                    color: "#FF6112",
                    alignSelf: "center",
                    fontWeight: "400",
                  }}
                  searchPlaceholder="Procurar"
                  badgeStyles={{ backgroundColor: "#FF6112" }}
                  closeicon={
                    <Ionicons name="close" size={20} color="#FF6112" />
                  }
                  searchicon={
                    <Ionicons
                      name="search"
                      size={18}
                      color="#FF6112"
                      style={{ marginEnd: 10 }}
                    />
                  }
                  arrowicon={
                    <AntDesign
                      name="down"
                      size={13}
                      color="#FF6112"
                      style={{ marginEnd: 2, alignSelf: "center" }}
                    />
                  }
                />
              )}
            />
            {errors.amenities && (
              <Text className="text-red-400 text-sm">
                {errors.amenities.message}
              </Text>
            )}
          </View>
          <View>
            <Text className="text-base mb-2 p-1">Fotos do estabelecimento</Text>

            <View className="border-dashed border border-gray-400 relative">
              <View className="flex flex-row">
                <Text
                  className="text-base text-gray-400 m-4"
                  onPress={handleProfilePictureUpload}
                >
                  Carregue as fotos do estabelecimento. {"\n"} Ex: frente, o
                  bar, o vestiário e etc.{" "}
                </Text>
                <TouchableOpacity
                  className="mt-2"
                  onPress={handleProfilePictureUpload}
                >
                  <Feather name="star" size={24} color="#FF6112" />
                </TouchableOpacity>
              </View>

              <FlatList
                className="h-max"
                data={photos}
                renderItem={({ item, index }) => (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={{ uri: item }}
                      style={{ width: 100, height: 100, margin: 10 }}
                    />
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        right: 0,
                        left: 0,
                        bottom: 0,
                        top: 0,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => handleDeletePhoto(index)}
                    >
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
            <TouchableOpacity
              className="h-14 w-full mt-4 mb-4 rounded-md bg-[#FF6112] items-center justify-center"
              onPress={handleSubmit(submitForm)}
            >
              <Text className="text-white text-base font-semibold">
                Continuar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
