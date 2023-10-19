import { AntDesign, Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { ScrollView } from "react-native-gesture-handler";
import MaskInput, { Masks } from "react-native-mask-input";
import { z } from "zod";
import useAllAmenities from "../../../hooks/useAllAmenities";
import useRegisterEstablishment from "../../../hooks/useRegisterEstablishment";
import storage from "../../../utils/storage";

const formSchema = z.object({
  corporateName: z
    .string({ required_error: "Esse campo não pode estar vazio!" })
    .nonempty("Esse campo não pode estar vazio!"),
  cnpj: z
    .string({ required_error: "Informe um CNPJ válido!" })
    .nonempty("Esse campo não pode estar vazio!")
    .min(14, "Deve ser informado um CNPJ válido!"),
  phone: z
    .string({ required_error: "Informe um número de telefone válido!" })
    .nonempty("Esse campo não pode estar vazio!")
    .min(11, "Deve ser informado um número de telefone válido!"),
  address: z.object({
    cep: z
      .string({ required_error: "Informe um CEP válido!" })
      .nonempty("Esse campo não pode estar vazio!")
      .min(8, "Deve ser informado um CEP válido!"),
    number: z
      .string({ required_error: "Esse campo não pode estar vazio!" })
      .nonempty("Esse campo não pode estar vazio!"),
    streetName: z
      .string({ required_error: "Esse campo não pode estar vazio!" })
      .nonempty("Esse campo não pode estar vazio!"),
  }),
});

type IFormSchema = z.infer<typeof formSchema>;

export default function RegisterEstablishment({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "EstablishmentRegister">) {
  const [photos, setPhotos] = useState<{ uri: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data: allAmenitiesData } = useAllAmenities();
  const [addEstablishment] = useRegisterEstablishment();
  const [amenities, setAmenities] = useState<string[]>([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormSchema>({
    resolver: zodResolver(formSchema),
  });

  async function submitForm(values: IFormSchema) {
    if (amenities.length === 0) {
      return Alert.alert("Erro", "Cadastre uma amenidade antes de continuar.");
    }
    try {
      const userGeolocation = await storage.load<{
        latitude: number;
        longitude: number;
      }>({ key: "userGeolocation" });

      const establishmentRegisterData = {
        amenities: amenities,
        cellphone_number: values.phone,
        cnpj: values.cnpj,
        cep: values.address.cep,
        corporate_name: values.corporateName,
        phone_number: values.phone,
        street_name: values.address.streetName,
        photos: [],
        latitude: userGeolocation.latitude.toString(),
        longitude: userGeolocation.longitude.toString(),
        // ownerId: route.params.id,
      }

      // await AsyncStorage.setItem(
      //   "@inquadra/registering-establishment-id",
      //   data.createEstablishment.data.id,
      // );

      navigation.navigate("RegisterCourts", {
        profileInfos: route.params,
        establishmentInfos: establishmentRegisterData,
        cnpj: values.cnpj,
        address: values.address,
        corporateName: values.corporateName,
        phoneNumber: values.phone,
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
          <View className="flex-row justify-between space-x-6">
            <View className="flex-1">
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
            <View className="flex-1">
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

            <MultipleSelectList
              setSelected={(value: any) => setAmenities(value)}
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
              closeicon={<Ionicons name="close" size={20} color="#FF6112" />}
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
          </View>
          {/* <View>
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
                      source={{ uri: item.uri }}
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
          </View> */}
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
