import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import useRegisterCourt from "../../hooks/useRegisterCourt";
import axios from "axios";
import {HOST_API} from '@env';
import useRegisterCourtAvailability from "../../hooks/useRegisterCourtAvailability";
import useRegisterUser from "../../hooks/useRegisterUser";
import useRegisterEstablishment from "../../hooks/useRegisterEstablishment";
import {useState} from "react";
import {ApolloError} from "@apollo/client";
import {IRegisterUserVariables} from "../../graphql/mutations/register";
import {IRegisterEstablishmentVariables} from "../../graphql/mutations/registerEstablishment";
import useDeleteUser from "../../hooks/useDeleteUser";
import useDeleteEstablishment from "../../hooks/useDeleteEstablishment";
import useDeleteCourtAvailability from "../../hooks/useDeleteCourtAvailability";

export default function AllVeryWell({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "AllVeryWell">) {
  const { goBack } = useNavigation();
  const [addCourt] = useRegisterCourt();
  const [registerCourtAvailability] = useRegisterCourtAvailability();
  const [deleteCourtAvailability] = useDeleteCourtAvailability();
  const [registerUser] = useRegisterUser()
  const [deleteUser] = useDeleteUser();
  const [registerEstablishment] = useRegisterEstablishment()
  const [deleteEstablishment] = useDeleteEstablishment();
  const [userId, setUserId] = useState<string>();
  const [establishmentId, setEstablishmentId] = useState<string>();
  const [uploadedImagesIds, setUploadedImagesIds] = useState<Array<string | number>>();
  const [courtAvailabilitiesIds, setCourtAvailabilitiesIds] = useState<Array<string | number>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const courts = route.params.courtArray;

  const indexToWeekDayMap: Record<number, string> = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "SpecialDays",
  };

  console.log(courts[0])

  const uploadImages = async (photos: {uri: string}[]) => {
    const formData = new FormData();

    for (let index = 0; index < photos.length; index++) {
      const { uri } = photos[index];
      const response = await fetch(uri);
      const blob = await response.blob();
      formData.append("files", {
        uri,
        type: blob.type,
        name: `image${index}.jpg`,
      } as any);
    }

    const response = await axios.post<Array<{ id: string }>>(
      `${HOST_API}/api/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    const uploadedImageIDs = response.data.map(image => image.id);
    console.log("Imagens enviadas com sucesso!", response.data);
    return uploadedImageIDs;
  };

  interface IRegisterUserPersonalInfosProps {
    username: string;
    cpf: string;
    email: string;
    password: string;
    phone_number: string;
    role: string;
  }

  interface IRegisterEstablishmentInfosProps {
    amenities: string[];
    cellphone_number: string;
    cnpj: string;
    cep: string;
    corporate_name: string;
    phone_number: string;
    street_name: string;
    photos: string[];
    latitude: string;
    longitude: string;
  }

  async function registerUserPersonalInfos(data: IRegisterUserPersonalInfosProps): Promise<string> {
    const {data: registeredUser, errors} = await registerUser({
      variables: {
        ...data
      }
    })

    if (errors || !registeredUser) throw new Error('Unable to register user\'s personal infos')
    else {
      const {id} = registeredUser.createUsersPermissionsUser.data;
      return id;
    }
  }

  async function registerEstablishmentInfos(ownerId: string, data: IRegisterEstablishmentInfosProps): Promise<string> {
    const {data: registeredEstablishment, errors} = await registerEstablishment({
      variables: {
        ...data,
        ownerId,
        publishedAt: new Date().toISOString()
      }
    });

    if (errors || !registeredEstablishment) throw new Error('Unable to register user\'s personal infos')
    else {
      const {id} = registeredEstablishment.createEstablishment.data;
      return id;
    }
  }

  async function removeRegisteredInfos(): Promise<void> {
    if (userId) deleteUser({
      variables: {
        user_id: userId
      }
    }).then(console.log)

    if (establishmentId) deleteEstablishment({
      variables: {
        establishment_id: establishmentId
      }
    }).then(console.log)

    if (uploadedImagesIds) uploadedImagesIds.forEach(id => deleteCourtAvailability(id))
  }

  async function handleComplete(): Promise<void> {
    console.log({profile_infos: route.params.profileInfos})
    console.log({establishment_infos: route.params.establishmentInfos})
    console.log({courts: route.params.courtArray[0].court_availabilities[0][0]})

    try {
      const registerUserPayload: IRegisterUserVariables = {
        ...route.params.profileInfos
      }
      const {data: newUserData, errors: newUserErrors} = await registerUser({
        variables: registerUserPayload
      })

      if (!newUserData) throw new Error('Não foi possível criar o usuário', {cause: newUserErrors?.map(error => error)});

      setUserId(newUserData.createUsersPermissionsUser.data.id)

      const registerEstalishmentPayload: IRegisterEstablishmentVariables = {
        ownerId: newUserData.createUsersPermissionsUser.data.id,
        ...route.params.establishmentInfos,
        publishedAt: new Date().toISOString()
      }
      const {data: establishmentData, errors: establishmentErrors} = await registerEstablishment({
        variables: registerEstalishmentPayload
      });

      if (!establishmentData) throw new Error('Não foi possível criar o estabelecimento', {cause: establishmentErrors?.map(error => error)})

      setEstablishmentId(establishmentData.createEstablishment.data.id)

      for (const court of route.params.courtArray) {
        const [newPhotosIds, courtAvailabilityIds] = await Promise.all([
          uploadImages(court.photos),
          Promise.all(
            court.court_availabilities.flatMap((availabilities, index) => {
              return availabilities.map(async availability => {
                console.log('veio até aqui...')
                const registerCourtAvailabilityPayload = {
                  status: true,
                  starts_at: `${availability.startsAt}:00.000`,
                  day_use_service: court.dayUse[index],
                  ends_at: `${availability.endsAt}:00.000`,
                  value: Number(
                    availability.price
                      .replace("R$", "")
                      .replace(".", "")
                      .replace(",", ".")
                      .trim(),
                  ),
                  week_day: indexToWeekDayMap[index],
                  publishedAt: new Date().toISOString(),
                }

                const {data, errors} = await registerCourtAvailability({
                  variables: registerCourtAvailabilityPayload,
                });
                if (data) return data?.createCourtAvailability.data.id
                else throw new Error('Não foi possível criar as disponibilidades de quadra')
              });
            }),
          ),
        ]);

        setUploadedImagesIds(newPhotosIds)

        addCourt({
          variables: {
            court_name: court.fantasyName,
            courtTypes: court.courtType,
            court_availabilities: courtAvailabilityIds,
            minimum_value: court.minimum_value,
            current_date: court.currentDate,
            photos: newPhotosIds,
            establishmentId: establishmentData.createEstablishment.data.id,
            fantasyName: court.fantasyName
          }
        }).then(() => {
          console.log('cadastrou tudo certinho de fato')
          Promise.all([
            AsyncStorage.removeItem('@inquadra/court-price-hour_day-use'),
            AsyncStorage.removeItem(
              "@inquadra/court-price-hour_all-appointments",
            )
          ]).then(() => navigation.navigate('CompletedEstablishmentRegistration'))
        }).catch(error => {
          if (error instanceof ApolloError)
            throw new Error(`Não foi possível criar a quadra\n${error.name}\n${error.message}`)
        })
      }
    } catch (err) {
      if (err instanceof ApolloError) {
        console.log({message: err.message, client: err.clientErrors, graphql: err.graphQLErrors})
        Alert.alert('Erro no cadastro', err.message)
        navigation.navigate('Register', {
          flow: 'establishment'
        })
      } else if (err instanceof Error) {
        console.log({message: err.message})
        Alert.alert('Erro no cadastro', err.message)
        navigation.navigate('Register', {
          flow: 'establishment'
        })
      }
      removeRegisteredInfos().then(() => console.log('Informações deletadas com sucesso'))
    } finally {
      console.log(userId, establishmentId)
    }
    // setIsLoading(true);
    // try {
    //   const userId = await registerUserPersonalInfos(route.params.profileInfos);
    //   const establishmentId = await registerEstablishmentInfos(userId, route.params.establishmentInfos);
    //
    //   setUserId(userId)
    //
    //   for (const court of route.params.courtArray) {
    //     const [uploadedImageIds, courtAvailabilityIds] = await Promise.all([
    //       uploadImages(court.photos),
    //       Promise.all(
    //         court.court_availabilities.flatMap((availabilities, index) => {
    //           return availabilities.map(async availability => {
    //             const { data } = await registerCourtAvailability({
    //               variables: {
    //                 status: true,
    //                 title: "O que deve vir aqui?",
    //                 day_use_service: court.dayUse[index],
    //                 starts_at: `${availability.startsAt}:00.000`,
    //                 ends_at: `${availability.endsAt}:00.000`,
    //                 value: Number(
    //                   availability.price
    //                     .replace("R$", "")
    //                     .replace(".", "")
    //                     .replace(",", ".")
    //                     .trim(),
    //                 ),
    //                 week_day: indexToWeekDayMap[index],
    //                 publishedAt: new Date().toISOString(),
    //               },
    //             });
    //
    //             if (!data) {
    //               throw new Error("No data");
    //             }
    //
    //             return data.createCourtAvailability.data.id;
    //           });
    //         }),
    //       ),
    //     ]);
    //
    //     addCourt({
    //       variables: {
    //         court_name: court.fantasyName,
    //         courtTypes: court.courtType,
    //         court_availabilities: courtAvailabilityIds,
    //         minimum_value: court.minimum_value,
    //         current_date: court.currentDate,
    //         photos: uploadedImageIds,
    //         establishmentId,
    //         fantasyName: court.fantasyName
    //       }
    //     }).then(() => {
    //       Promise.all([
    //         AsyncStorage.removeItem('@inquadra/court-price-hour_day-use'),
    //         AsyncStorage.removeItem(
    //           "@inquadra/court-price-hour_all-appointments",
    //         )
    //       ]).then(() => navigation.navigate('CompletedEstablishmentRegistration'))
    //     }).catch((error) => console.error('Unexpected error: ', error))
    //   }
    // } catch (error) {
    //   console.log("Erro externo:", error);
    //   console.log(userId)
    //   Alert.alert("Erro", "Não foi possível cadastrar as quadras");
    // } finally {
    //   setIsLoading(false);
    // }
  }

  return (
    <View className="flex-1 pt-12">
      <View className="px-4 gap-3 flex-1 bg-white">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={goBack}>
            <Icon name="arrow-back" size={24} color="#4E4E4E" />
          </TouchableOpacity>

          <Text className="text-[32px] text-[#4E4E4E] font-semibold -translate-x-3">
            Tudo Certo?
          </Text>

          <View />
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("CourtDetails", {
              courtArray: courts,
            });
          }}
        >
          <View>
            <Text className="text-xl p-2">Detalhes Gerais</Text>

            <View className="border rounded border-orange-400 p-5">
              <Text className="text-base">
                {courts.length} quadras cadastradas
              </Text>

              <Text className="text-base">
                Total de{" "}
                {courts.reduce(
                  (totalPhotos, court) => totalPhotos + court.photos.length,
                  0,
                )}{" "}
                fotos
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <FlatList
          data={courts}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item: court }) => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("CourtDetails", { courtArray: courts });
              }}
            >
              <View>
                <Text className="text-xl p-2">{court.court_name}</Text>

                <View className="border rounded border-orange-400 p-5">
                  {court.photos.length > 1 ? (
                    <Text className="text-base">
                      Total de {court.photos.length} fotos cadastradas
                    </Text>
                  ) : (
                    <Text className="text-base">
                      Total de {court.photos.length} foto cadastrada
                    </Text>
                  )}
                  {court.court_availabilities.length > 0 ? (
                    <Text className="text-base">
                      Valores e horários editados
                    </Text>
                  ) : (
                    <Text className="text-base">
                      Valores e horarios não editados
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <View className="bg-white">
        <TouchableOpacity
          className="h-14 w-81 m-6 rounded-md bg-[#FF6112] flex items-center justify-center"
          onPress={handleComplete}
          disabled={isLoading}
        >
          {
            !isLoading ?
              <Text className="text-gray-50">Concluir</Text>
              :
              <ActivityIndicator size={'small'} color={'#F5620F'} />
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}
