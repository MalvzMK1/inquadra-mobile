import { HOST_API } from "@env";
import { useFocusEffect } from "@react-navigation/native";
import { format, parseISO } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { TextInput } from "react-native-paper";
import { NativeStackScreenProps } from "react-native-screens/lib/typescript/native-stack/types";
import BottomBlackMenu from "../../components/BottomBlackMenu";
import { IgetHistoricOfReserveOnResponse } from "../../graphql/queries/historicReserveOn";
import { useGetHistoricReserveOn } from "../../hooks/useHistoricReserveOn";
import { useGetMenuUser } from "../../hooks/useMenuUser";
import { UserGeolocation } from "../../types/UserGeolocation";
import { API_BASE_URL } from "../../utils/constants";
import storage from "../../utils/storage";
import { courtAvailabilityByHourQuery } from "../../graphql/queries/schedulingByHour";

function formatDateTime(dateTimeString: string): string {
  try {
    const parsedDateTime = parseISO(dateTimeString);
    const formattedDate = format(parsedDateTime, "dd/MM/yyyy");
    const formattedTime = format(parsedDateTime, "HH:mm");
    return `${formattedDate} às ${formattedTime}`;
  } catch (error) {
    console.error("Erro ao converter a data:", error);
    return "Data inválida";
  }
}

type Scheduling =
  IgetHistoricOfReserveOnResponse["usersPermissionsUser"]["data"]["attributes"]["schedulings"]["data"][number];

export default function InfoReserva({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "InfoReserva">) {
  let userId = route?.params?.userId;
  const { data: dataUser } = useGetMenuUser(userId);
  const [userPicture, setUserPicture] = useState<string | undefined>();
  const [userGeolocation, setUserGeolocation] = useState<UserGeolocation>();
  const { data, loading, refetch } = useGetHistoricReserveOn(userId);

  useFocusEffect(
    useCallback(() => {
      refetch();

      if (
        dataUser &&
        dataUser.usersPermissionsUser.data &&
        dataUser?.usersPermissionsUser.data.attributes.photo.data
      ) {
        setUserPicture(
          `${API_BASE_URL}${dataUser.usersPermissionsUser.data.attributes.photo.data.attributes.url}`,
        );
      }
    }, [refetch]),
  );

  useEffect(() => {
    storage
      .load<UserGeolocation>({ key: "userGeolocation" })
      .then(setUserGeolocation);
  }, []);

  const schedulings = useMemo((): {
    active: Scheduling[];
    done: Scheduling[];
  } => {
    const active: Scheduling[] = [];
    const done: Scheduling[] = [];

    if (
      data &&
      data.usersPermissionsUser.data
    )
      data.usersPermissionsUser.data.attributes.schedulings.data.forEach(
        scheduling => {
          if (scheduling.attributes.status) {
            active.push(scheduling);
          } else {
            done.push(scheduling);
          }
        },
      );

    return {
      active,
      done,
    };
  }, [data]);

  return (
    <View className="h-full w-max bg-zinc-600 flex-1">
      <View className="h-11 w-max bg-zinc-900"></View>
      <View className="h-16 w-max bg-zinc-900 flex-row item-center justify-between px-5">
        <View className="flex item-center justify-center">
          <TouchableOpacity
            className="h-6 w-6"
            onPress={() => {
              if (userGeolocation) {
                navigation.navigate("Home", {
                  userID: userId,
                  userPhoto: undefined,
                  userGeolocation: userGeolocation,
                });
              }
            }}
          >
            <TextInput.Icon icon="chevron-left" size={25} color="white" />
          </TouchableOpacity>
        </View>
        <View className="w-max flex item-center justify-center">
          <Text className="text-lg font-semibold text-white">
            Histórico de reservas
          </Text>
        </View>
        <View className="h-max w-max flex justify-center items-center">
          <TouchableOpacity className="h-max w-max">
            <Image
              source={{ uri: userPicture! }}
              style={{ width: 46, height: 46 }}
              borderRadius={100}
            />
          </TouchableOpacity>
        </View>
      </View>
      {/* Div maior para carregar todos os itens inseridos do historico*/}
      <ScrollView>
        {userId && (
          <View className="h-max w-max bg-zinc-600 flex-1">
            <View className="flex items-start w-max pl-4 mt-2">
              <Text className="text-base font-semibold text-white">
                Reservas ativas
              </Text>
            </View>
            {/* Div para carregar todas as informações do histórico*/}
            <View className="items-center p-4">
              <View
                className="w-full h-max bg-zinc-900 rounded-lg p-2"
                style={{ elevation: 8 }}
              >
                {/* Div para inserção dos cards*/}
                {loading ? (
                  <View className="justify-center mt-2">
                    <ActivityIndicator size={40} color="white" />
                  </View>
                ) : (
                  <View className="w-max h-max px-3">
                    {(
                      !schedulings.active.length
                    ) ? (
                      <Text className="text-white">
                        Não há reservas aqui...
                      </Text>
                    ) : (
                      schedulings.active.map(courtInfo => {
                        const percentagePaid = Math.floor(
                          (Number(courtInfo.attributes.valuePayed) /
                            (Number(
                              courtInfo.attributes.court_availability.data?.attributes.value ?? 0,
                            ))) *
                          100,
                        );

                        return (
                          <TouchableOpacity
                            key={courtInfo.id}
                            onPress={() => {
                              navigation.navigate("DescriptionReserve", {
                                userId: userId,
                                scheduleId: courtInfo.id,
                              });
                            }}
                          >
                            <View className="flex-row items-start justify-start w-max h-max pt-2">
                              <View className="self-center mr-2">
                                <Image
                                  source={
                                    (
                                      courtInfo.attributes.court_availability.data &&
                                      courtInfo.attributes.court_availability.data.attributes.court.data &&
                                      courtInfo.attributes.court_availability.data.attributes.court.data.attributes.photo.data[0]
                                    ) ? {
                                      uri:
                                        HOST_API +
                                        courtInfo.attributes.court_availability.data.attributes
                                          .court.data.attributes.photo.data[0].attributes.url,
                                    } : require('../../assets/default-user-image.png')
                                  }
                                  style={{ width: 138, height: 90 }}
                                  borderRadius={5}
                                />
                              </View>
                              <View className="flex justify-start items-start pl-1 flex-1">
                                <View>
                                  <Text className="font-black text-base text-orange-600">
                                    {
                                      courtInfo.attributes.court_availability.data?.
                                        attributes.court.data
                                        ?.attributes?.fantasy_name
                                    }
                                  </Text>
                                </View>
                                <View>
                                  <Text className="font-normal text-xs text-white">
                                    {
                                      courtInfo?.attributes?.court_availability
                                        ?.data?.attributes?.court?.data
                                        ?.attributes?.name
                                    }
                                  </Text>
                                </View>
                                <View className="flex-1 flex-row pt-1">
                                  <View className="w-40 h-5 border border-green-500 flex-row justify-center items-center rounded-sm relative">
                                    <View
                                      className="bg-green-500 absolute top-0 bottom-0 left-0 -z-10"
                                      style={{
                                        width: `${Math.min(
                                          percentagePaid,
                                          100,
                                        )}%`,
                                      }}
                                    />
                                    <Text className="font-black text-xs text-white">
                                      R$
                                      {courtInfo?.attributes?.valuePayed.toString()}
                                    </Text>
                                    <Text className="font-black text-xs text-white">
                                      {" "}
                                      /{" "}
                                    </Text>
                                    <Text className="font-black text-xs text-white">
                                      R$
                                      {`${Number(
                                        courtInfo?.attributes
                                          ?.court_availability?.data
                                          ?.attributes?.value,
                                      )
                                        }`}
                                    </Text>
                                  </View>
                                </View>
                                <Text className="font-black text-xs text-white mt-1">
                                  {percentagePaid}%
                                </Text>
                                <Text
                                  numberOfLines={1}
                                  className="font-black text-xs text-white pt-1"
                                >
                                  Reserva feita em{" "}
                                  {formatDateTime(
                                    courtInfo?.attributes?.createdAt.toString(),
                                  )}
                                </Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      })
                    )}
                    {/*<View className="flex items-start w-max mt-6 p-4">*/}
                    {/*  <Text className="text-lg text-white">*/}
                    {/*    Reservas finalizadas*/}
                    {/*  </Text>*/}
                    {/*</View>*/}
                    {/*{!schedulings.done.length ? (*/}
                    {/*  <Text className="text-white">*/}
                    {/*    Não há reservas aqui...*/}
                    {/*  </Text>*/}
                    {/*) : (*/}
                    {/*  schedulings.done.map(courtInfo => {*/}
                    {/*    return (*/}
                    {/*      <TouchableOpacity*/}
                    {/*        key={courtInfo.id}*/}
                    {/*        onPress={() => {*/}
                    {/*          navigation.navigate("DescriptionReserve", {*/}
                    {/*            userId: userId,*/}
                    {/*            scheduleId: courtInfo.id,*/}
                    {/*          });*/}
                    {/*        }}*/}
                    {/*      >*/}
                    {/*        <View className="flex-row items-start justify-start w-max h-max pt-2">*/}
                    {/*          <View>*/}
                    {/*            <Image*/}
                    {/*              source={{*/}
                    {/*                uri:*/}
                    {/*                  HOST_API +*/}
                    {/*                  courtInfo?.attributes?.court_availability*/}
                    {/*                    ?.data?.attributes?.court?.data*/}
                    {/*                    ?.attributes?.photo?.data[0]?.attributes*/}
                    {/*                    ?.url,*/}
                    {/*              }}*/}
                    {/*              style={{ width: 138, height: 90 }}*/}
                    {/*              borderRadius={5}*/}
                    {/*            />*/}
                    {/*          </View>*/}
                    {/*          <View className="h-max w-max pl-1">*/}
                    {/*            <View>*/}
                    {/*              <Text className="font-black text-base text-orange-600">*/}
                    {/*                {*/}
                    {/*                  courtInfo.attributes.court_availability*/}
                    {/*                    .data.attributes.court.data.attributes*/}
                    {/*                    .fantasy_name*/}
                    {/*                }*/}
                    {/*              </Text>*/}
                    {/*            </View>*/}

                    {/*            <View>*/}
                    {/*              <Text className="font-normal text-xs text-white">*/}
                    {/*                {*/}
                    {/*                  courtInfo.attributes.court_availability*/}
                    {/*                    .data.attributes.court.data.attributes*/}
                    {/*                    .name*/}
                    {/*                }*/}
                    {/*              </Text>*/}
                    {/*            </View>*/}

                    {/*            <View className="w-max h-5 flex-row">*/}
                    {/*              <View>*/}
                    {/*                <Text className="font-normal text-xs text-white">*/}
                    {/*                  Status:{" "}*/}
                    {/*                </Text>*/}
                    {/*              </View>*/}

                    {/*              <View>*/}
                    {/*                {courtInfo.attributes.payedStatus ===*/}
                    {/*                "payed" ? (*/}
                    {/*                  <Text className="font-normal text-xs text-white">*/}
                    {/*                    Finalizado{" "}*/}
                    {/*                  </Text>*/}
                    {/*                ) : courtInfo.attributes.payedStatus ===*/}
                    {/*                  "waiting" ? (*/}
                    {/*                  <Text className="font-normal text-xs text-white">*/}
                    {/*                    Em aberto{" "}*/}
                    {/*                  </Text>*/}
                    {/*                ) : (*/}
                    {/*                  <Text className="font-normal text-xs text-white">*/}
                    {/*                    Cancelado{" "}*/}
                    {/*                  </Text>*/}
                    {/*                )}*/}
                    {/*              </View>*/}

                    {/*              <View>*/}
                    {/*                <Text className="font-black text-xs text-white">*/}
                    {/*                  R$*/}
                    {/*                  {courtInfo.attributes.court_availability.data.attributes.value.toString()}*/}
                    {/*                </Text>*/}
                    {/*              </View>*/}
                    {/*            </View>*/}

                    {/*            <View>*/}
                    {/*              <Text className="font-black text-xs text-white">*/}
                    {/*                Ultima Reserva{" "}*/}
                    {/*                {formatDateTime(*/}
                    {/*                  courtInfo?.attributes?.createdAt.toString(),*/}
                    {/*                )}*/}
                    {/*              </Text>*/}
                    {/*            </View>*/}
                    {/*          </View>*/}
                    {/*        </View>*/}
                    {/*      </TouchableOpacity>*/}
                    {/*    );*/}
                    {/*  })*/}
                    {/*)}*/}
                  </View>
                )}
              </View>
            </View>
            <View className="flex items-start w-max pl-4 mt-2">
              <Text className="text-base font-semibold text-white">
                Reservas Finalizadas
              </Text>
            </View>
            {/* Div para carregar todas as informações do histórico*/}
            <View className="items-center p-4">
              <View
                className="w-full h-max bg-zinc-900 rounded-lg p-2"
                style={{ elevation: 8 }}
              >
                {/* Div para inserção dos cards*/}
                {loading ? (
                  <View className="justify-center mt-2">
                    <ActivityIndicator size={40} color="white" />
                  </View>
                ) : (
                  <View className="w-max h-max px-3 py-3">
                    {!schedulings.done.length ? (
                      <Text className="text-white">
                        Não há reservas aqui...
                      </Text>
                    ) : (
                      schedulings.done.map(courtInfo => {
                        return (
                          <TouchableOpacity
                            key={courtInfo.id}
                            onPress={() => {
                              navigation.navigate("DescriptionReserve", {
                                userId: userId,
                                scheduleId: courtInfo.id,
                              });
                            }}
                          >
                            <View className="flex-row items-start justify-start w-max h-max pt-2">
                              <View>
                                <Image
                                  source={{
                                    uri:
                                      HOST_API +
                                      courtInfo?.attributes?.court_availability
                                        ?.data?.attributes?.court?.data
                                        ?.attributes?.photo?.data[0]?.attributes
                                        ?.url,
                                  }}
                                  style={{ width: 138, height: 90 }}
                                  borderRadius={5}
                                />
                              </View>
                              <View className="h-max w-max pl-1">
                                <View>
                                  <Text className="font-black text-base text-orange-600">
                                    {
                                      courtInfo.attributes.court_availability
                                        .data.attributes.court.data.attributes
                                        .fantasy_name
                                    }
                                  </Text>
                                </View>

                                <View>
                                  <Text className="font-normal text-xs text-white">
                                    {
                                      courtInfo.attributes.court_availability
                                        .data.attributes.court.data.attributes
                                        .name
                                    }
                                  </Text>
                                </View>

                                <View className="w-max h-5 flex-row">
                                  <View>
                                    <Text className="font-normal text-xs text-white">
                                      Status:{" "}
                                    </Text>
                                  </View>

                                  <View>
                                    {courtInfo.attributes.payedStatus ===
                                      "payed" ? (
                                      <Text className="font-normal text-xs text-white">
                                        Finalizado{" "}
                                      </Text>
                                    ) : courtInfo.attributes.payedStatus ===
                                      "waiting" ? (
                                      <Text className="font-normal text-xs text-white">
                                        Em aberto{" "}
                                      </Text>
                                    ) : (
                                      <Text className="font-normal text-xs text-white">
                                        Cancelado{" "}
                                      </Text>
                                    )}
                                  </View>

                                  <View>
                                    <Text className="font-black text-xs text-white">
                                      R$
                                      {courtInfo.attributes.court_availability.data.attributes.value.toString()}
                                    </Text>
                                  </View>
                                </View>

                                <View>
                                  <Text className="font-black text-xs text-white">
                                    Ultima Reserva{" "}
                                    {formatDateTime(
                                      courtInfo?.attributes?.createdAt.toString(),
                                    )}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      })
                    )}
                  </View>
                )}
              </View>
            </View>
            <View className='h-20' />
          </View>
        )}
        {!userId && (
          <View className="w-full h-fit flex items-center justify-center mt-[8px]">
            <Text className="text-[18px] text-center text-white">
              FAÇA{" "}
              <Text
                onPress={() => navigation.navigate("Login")}
                className="text-[18px] text-white flex items-center justify-center underline"
              >
                LOGIN
              </Text>{" "}
              NO APP PARA PODER VISUALIZAR E/OU EFETUAR UMA RESERVA!
            </Text>
          </View>
        )}
      </ScrollView>
      <View className="absolute bottom-0 left-0 right-0">
        <BottomBlackMenu
          screen="Historic"
          userID={userId}
          userPhoto={
            dataUser?.usersPermissionsUser?.data?.attributes?.photo?.data
              ?.attributes?.url
              ? HOST_API +
              dataUser?.usersPermissionsUser?.data?.attributes?.photo?.data
                ?.attributes?.url
              : ""
          }
          key={1}
          isDisabled={true}
          paddingTop={2}
        />
      </View>
    </View>
  );
}
