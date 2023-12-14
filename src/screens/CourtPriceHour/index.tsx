import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { addDays } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import CourtAvailibilityDay from "../../components/CourtAvailibilityDay";
import SetCourtAvailibility from "../../components/SetCourtAvailibility";
import { useAsyncStorageState } from "../../hooks/useAsyncStorageState";
import { AsyncStorageKeys } from "../../utils/constants";
import { formatLocaleWeekDayName, getWeekDays } from "../../utils/getWeekDates";
import { useNavigation } from "@react-navigation/native";
import { BackHandler } from "react-native";

export interface Appointment {
  startsAt: string;
  endsAt: string;
  price: string;
}

export default function CourtPriceHour({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "CourtPriceHour">) {
  const [selectedDay, setSelectedDay] = useState<number | null>(0);
  const [handleHasLowerPrice, setHandleHasLowerPrice] = useState<boolean | null>(null)
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  // todos os horários de todos os dias
  const [allAppointments, setAllAppointments, isLoadingInitialAllAppointments] =
    useAsyncStorageState<Appointment[][]>(
      AsyncStorageKeys.CourtPriceHourAllAppointments,
      [
        [], // domingo
        [], // segunda
        [], // terça
        [], // quarta
        [], // quinta
        [], // sexta
        [], // sábado
        [], // dia especial
      ],
    );






  const navigationNative = useNavigation()

  useEffect(() => {
    const hasLowerPrice = allAppointments.some((dayAppointments) =>
      dayAppointments.some((appointment) => {
        const formattedPrice = appointment.price.replace("R$ ", "").replace(",", ".");
        const parsedPrice = parseFloat(formattedPrice);
        const priceInCents = !isNaN(parsedPrice) ? Math.round(parsedPrice * 100) : null;

        return priceInCents !== null && priceInCents < Number(route.params.minimumCourtPrice);
      }
      )
    )
    setHandleHasLowerPrice(hasLowerPrice)
  }, [allAppointments])


  console.log(route.params.minimumCourtPrice)

  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        if (handleHasLowerPrice) {
          setInfoModalVisible(true)
          return true;
        }
        return false;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [navigation, handleHasLowerPrice]);


  navigation.setOptions({
    headerTitle: "Definir hora/valor",
    headerLeft: () => (
      <TouchableOpacity
        style={{ marginLeft: 10 }}  
        onPress={() => {
          console.log("in touchable:", handleHasLowerPrice)
          if (handleHasLowerPrice) {
            null
            setInfoModalVisible(true)
          } else {
            navigation.goBack();
          }
        }}
      >
        <Icon name="arrow-back" size={25} color="black" />
      </TouchableOpacity>
    ),
  });


  const [dayUse, setDayUse, isLoadingInitialDayUse] = useAsyncStorageState<
    boolean[]
  >(AsyncStorageKeys.CourtPriceHourDayUse, [
    false, // domingo
    false, // segunda
    false, // terça
    false, // quarta
    false, // quinta
    false, // sexta
    false, // sábado
    false, // dia especial
  ]);

  const [copiedAppointments, setCopiedAppointments] = useState<
    Appointment[] | null
  >(null);

  if (isLoadingInitialAllAppointments || isLoadingInitialDayUse) {
    return (
      <View className="justify-center bg-[#292929] flex-1 items-center">
        <ActivityIndicator size={48} color="#FF6112" />
      </View>
    );
  }

  const weekDays = getWeekDays(new Date());

  weekDays.push({
    dayName: "Special Day",
    day: (Number(weekDays[weekDays.length - 1].day) - 1).toString(),
    localeDayInitial: "D.E.",
    localeDayName: "Dia Especial",
    date: addDays(new Date(weekDays[weekDays.length - 1].date), 1),
  });

  const formattedWeekDayNames = formatLocaleWeekDayName(weekDays);

  formattedWeekDayNames.forEach((formattedDayName, index) => {
    weekDays[index].localeDayName = formattedDayName;
  });

  function handleToggleOpen(index: number) {
    setSelectedDay(currentSelectedDay => {
      if (currentSelectedDay === index) {
        return null;
      }

      return index;
    });
  }

  return (
    <View className="flex-1">
      <ScrollView
        className="bg-[#292929]"
        contentContainerStyle={{ padding: 16 }}
      >
        <View className="flex-1 items-center">
          <Text className="text-white font-black text-xs">Selecione o dia</Text>
          <View className="w-full h-fit flex-row flex-wrap items-center justify-between gap-y-[5px] mt-[10px]">
            {weekDays.map((day, index) => (
              <TouchableOpacity
                key={day.dayName}
                className="h-[40px] w-[90px] bg-white border border-[#FF6112] rounded-[5px] items-center justify-center"
                onPress={() => handleToggleOpen(index)}
              >
                <Text className="font-normal text-[#FF6112] text-[11px]">
                  {day.localeDayName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="w-full h-full mt-[15px]">
            <Modal
              visible={infoModalVisible}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setInfoModalVisible(false)}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#FF6112",
                    padding: 20,
                    borderRadius: 10,
                  }}
                >
                  <Text className="text-white font-semibold text-base">
                    O valor/hora da sua quadra deve ser maior que o valor do sinal
                    mínimo para alocação.
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setInfoModalVisible(false);
                    }}
                  >
                    <Text className="text-black font-semibold text-base mt-2">
                      Fechar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            {weekDays.map((day, index) => (
              <CourtAvailibilityDay
                key={day.dayName}
                day={day.localeDayName}
                isOpen={selectedDay === index}
                onToggleOpen={() => handleToggleOpen(index)}
              >
                <SetCourtAvailibility
                  infoModalVisible={infoModalVisible}
                  setInfoModalVisible={setInfoModalVisible}
                  minimumCourtPrice={route.params.minimumCourtPrice}
                  appointments={allAppointments[index]}
                  hasCopy={Boolean(copiedAppointments)}
                  isDayUse={dayUse[index]}
                  setDayUse={isDayUse => {
                    setDayUse(currentDayUse => {
                      const newDayUse = [...currentDayUse];
                      newDayUse.splice(index, 1, isDayUse);
                      return newDayUse;
                    });
                  }}
                  onCopy={() => {
                    setCopiedAppointments(allAppointments[index]);
                  }}
                  onPaste={() => {
                    if (!copiedAppointments) return;
                    setAllAppointments(currentAllAppointments => {
                      const newAllAppointments = [...currentAllAppointments];
                      newAllAppointments.splice(index, 1, copiedAppointments);
                      return newAllAppointments;
                    });

                    setCopiedAppointments(null);
                  }}
                  onAddNewAppointment={() => {
                    setAllAppointments(currentAllAppointments => {
                      const newAllAppointments = [...currentAllAppointments];
                      newAllAppointments.splice(index, 1, [
                        ...newAllAppointments[index],
                        {
                          startsAt: "",
                          endsAt: "",
                          price: "",
                        },
                      ]);

                      return newAllAppointments;
                    });
                  }}
                  setStartsAt={(value, appointmentIndex) => {
                    setAllAppointments(currentAllAppointments => {
                      const newAllAppointments = [...currentAllAppointments];
                      const newAppointments = [...newAllAppointments[index]];
                      newAppointments.splice(appointmentIndex, 1, {
                        ...newAppointments[appointmentIndex],
                        startsAt: value,
                      });

                      newAllAppointments.splice(index, 1, newAppointments);
                      return newAllAppointments;
                    });
                  }}
                  setEndsAt={(value, appointmentIndex) => {
                    setAllAppointments(currentAllAppointments => {
                      const newAllAppointments = [...currentAllAppointments];
                      const newAppointments = [...newAllAppointments[index]];
                      newAppointments.splice(appointmentIndex, 1, {
                        ...newAppointments[appointmentIndex],
                        endsAt: value,
                      });

                      newAllAppointments.splice(index, 1, newAppointments);
                      return newAllAppointments;
                    });
                  }}
                  setPrice={(value, appointmentIndex) => {
                    setAllAppointments(currentAllAppointments => {
                      const newAllAppointments = [...currentAllAppointments];
                      const newAppointments = [...newAllAppointments[index]];
                      newAppointments.splice(appointmentIndex, 1, {
                        ...newAppointments[appointmentIndex],
                        price: value,
                      });

                      newAllAppointments.splice(index, 1, newAppointments);
                      return newAllAppointments;
                    });
                  }}
                  onDeleteAppointment={appointmentIndex => {
                    setAllAppointments(currentAllAppointments => {
                      const newAllAppointments = [...currentAllAppointments];
                      const newAppointments = [...newAllAppointments[index]];
                      newAppointments.splice(appointmentIndex, 1);
                      newAllAppointments.splice(index, 1, newAppointments);
                      return newAllAppointments;
                    });
                  }}
                />
              </CourtAvailibilityDay>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
