import { HOST_API } from "@env";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";
import BottomBlackMenu from "../../components/BottomBlackMenu";
import CourtAvailibility from "../../components/CourtAvailibility";
import FilterDate from "../../components/FilterDateCourtAvailability";
import { useUser } from "../../context/userContext";
import useCourtAvailability from "../../hooks/useCourtAvailability";
import { useGetUserById } from "../../hooks/useUserById";
import useAllBlockedAvailabilitiesFromCourt from "../../hooks/useAllBlockedAvailabilitiesFromCourt";
import getDatesRange from "../../utils/getDatesRange";
import getHoursRange from "../../utils/getHoursRange";
import getWeekDayByDateISOString from "../../utils/getWeekDayFromDate";
import {EWeekDays} from "../../graphql/mutations/availabilityByWeekDay";

interface ICourtAvailabilityInfoProps
  extends NativeStackScreenProps<RootStackParamList, "CourtAvailabilityInfo"> {}

LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],
  dayNames: [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje",
};

const dayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function CourtAvailabilityInfo({
  navigation,
  route,
}: ICourtAvailabilityInfoProps) {
  const {
    data: courtAvailability,
    loading: isCourtAvailabilityLoading,
    refetch: refetchCourtAvailability,
  } = useCourtAvailability(route.params.courtId);
  const {
    data: blockedCourtAvailabilityData,
  } = useAllBlockedAvailabilitiesFromCourt(route.params.courtId);

  const [blockedAvailabilities, setBlockedAvailabilities] = useState<Array<{
    date: Array<string>;
    time: Array<string>;
  }>>([]);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString());

  useEffect(() => {
    if (blockedCourtAvailabilityData) {
      const {data} = blockedCourtAvailabilityData.blockedAvailabilities;
      const arrayPayload: Array<{date: string[], time: string[]}> = []

      data.forEach((blocked, index) => {
        const [startsAtDate, startsAtTime] = blocked.attributes.startAt.split('T');
        const [endsAtDate, endsAtTime] = blocked.attributes.endAt.split('T');

        const dateRange = getDatesRange(startsAtDate, endsAtDate);
        const hourRange = getHoursRange(startsAtDate, startsAtTime, endsAtDate, endsAtTime);

        if (
          dateRange.length < 1 &&
          startsAtDate === endsAtDate
        ) dateRange.push(startsAtDate);

        arrayPayload.push({date: dateRange, time: hourRange});
      })

      setBlockedAvailabilities(prevState => [...prevState, ...arrayPayload])
    }
  }, [blockedCourtAvailabilityData, selectedDate])

  useFocusEffect(
    useCallback(() => {
      refetchCourtAvailability();
    }, [refetchCourtAvailability]),
  );

  const [dateSelector, setDateSelector] = useState(() => {
    return format(new Date(), "dd/MM/yyyy");
  });

  const [selectedWeekDate, setSelectedWeekDate] = useState<string>();

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedTime, setSelectedTime] = useState<{
    id: string;
    value: number;
  } | null>(null);

  LocaleConfig.defaultLocale = "pt-br";

  useEffect(() => {
    setSelectedDate(new Date().toISOString());
    setSelectedWeekDate(dayNames[new Date().getDay() - 1]);
  }, []);

  function handleCalendarClick(data: DateData) {
    const date = new Date(data.dateString);
    const dayOfWeek = date.getDay();
    const dayName = dayNames[dayOfWeek];

    setSelectedWeekDate(dayName);
    setSelectedDate(date.toISOString());
    setDateSelector(
      `${String(date.getDate() + 1).padStart(2, "0")}/${String(
        date.getMonth() + 1,
      ).padStart(2, "0")}/${date.getFullYear()}`,
    );
  }

  const toggleTimeSelection = (id: string, value: any) => {
    if (id && value) {
      if (selectedTime?.id === id) {
        setSelectedTime(null);
      } else {
        setSelectedTime({ id, value });
      }
    }
  };

  const { userData } = useUser();
  const { data: dataUser } = useGetUserById(userData?.id ?? "");

  return (
    <SafeAreaView className="flex flex-col justify-between  h-full">
      {isCourtAvailabilityLoading ? (
        <ActivityIndicator size="large" color="#F5620F" />
      ) : (
        <>
          <ScrollView className=" h-screen flex flex-col">
            <ImageBackground
              className="h-[215px] w-full"
              source={{
                uri: route.params.courtImage,
              }}
            />

            <View className=" h-fit mt-2.5">
              <View className="flex h-fit items-center">
                <Text className="text-xl font-black">
                  {route.params.courtName}
                </Text>
                {!showCalendar && (
                  <View className="h-fit w-full p-[15px] items-center justify-around flex flex-row">
                    <FilterDate
                      dateSelector={dateSelector}
                      setDateSelector={setDateSelector}
                      handleClick={handleCalendarClick}
                    />
                  </View>
                )}
                {showCalendar && (
                  <Calendar
                    className="h-fit w-96"
                    current={new Date().toISOString().split("T")[0]}
                    onDayPress={handleCalendarClick}
                    minDate={new Date().toISOString()}
                    selectedDate={selectedDate}
                    markedDates={{
                      [selectedDate.split("T")[0]]: {
                        selected: true,
                        disableTouchEvent: true,
                        selectedColor: "#FF6112",
                      },
                    }}
                    theme={{
                      arrowColor: "#FF6112",
                      todayTextColor: "#FF6112",
                    }}
                  />
                )}
                <TouchableOpacity
                  onPress={() => setShowCalendar(!showCalendar)}
                  className="bg-[#959595] h-[4px] w-[30px] rounded-[5px]"
                />
              </View>
            </View>
            <ScrollView className="h-full w-full pl-[10px] pr-[10px] mt-[15px] flex">
              {!userData?.id ? (
                <>
                  <FlatList
                    data={
                      courtAvailability?.court.data.attributes
                        .court_availabilities.data
                    }
                    keyExtractor={availability => availability.id}
                    ListEmptyComponent={() => (
                      <Text className="text-xl font-black text-center">
                        No momento não é possível Alugar essa quadra
                      </Text>
                    )}
                    renderItem={({ item }) => {
                      console.log( 'APARECE DESGRAÇ')
                      const startsAt = item.attributes.startsAt.split(":");
                      const endsAt = item.attributes.endsAt.split(":");

                      let isBusy = !item.attributes.status;

                      if (
                        item.attributes.schedulings.data.some(scheduling => {
                          return (
                            selectedDate.split("T")[0] ===
                            scheduling.attributes.date
                          );
                        })
                      ) {
                        const blocked = blockedAvailabilities.filter(availabilities => {
                          console.warn(availabilities.time.includes(item.attributes.startsAt));
                          return availabilities.time.includes(item.attributes.startsAt)
                        })

                        console.error({blocked});
                        isBusy = true;
                      }

                      if (selectedWeekDate !== item.attributes.weekDay) {
                        return null;
                      }

                      const isBlocked = (blockedAvailabilities.some(blocked => {
                        return (
                          blocked.time.includes(item.attributes.startsAt || item.attributes.endsAt) &&
                          blocked.date.includes(selectedDate.split('T')[0])
                        )
                      }))

                      return (
                        <CourtAvailibility
                          key={item.id}
                          id={item.id}
                          startsAt={`${startsAt[0]}:${startsAt[1]}`}
                          endsAt={`${endsAt[0]}:${endsAt[1]}`}
                          price={item.attributes.value}
                          busy={isBusy}
                          isBlocked={isBlocked}
                          selectedTimes={selectedTime}
                          toggleTimeSelection={toggleTimeSelection}
                        />
                      );
                    }}
                  />
                  <Text className="text-lg font-bold text-center">
                    FAÇA{" "}
                    <Text
                      onPress={() => navigation.navigate("Login")}
                      className="text-lg text-[#ffa363] text-center underline"
                    >
                      LOGIN
                    </Text>{" "}
                    NO APP PARA REALIZAR A SUA RESERVA!
                  </Text>
                </>
              ) : (
                <FlatList
                  data={
                    courtAvailability?.court.data.attributes
                      .court_availabilities.data
                  }
                  keyExtractor={availability => availability.id}
                  ListEmptyComponent={() => (
                    <Text className="text-xl font-black text-center">
                      No momento não é possível Alugar essa quadra
                    </Text>
                  )}
                  renderItem={({ item }) => {
                    const startsAt = item.attributes.startsAt.split(":");
                    const endsAt = item.attributes.endsAt.split(":");

                    let isBusy = !item.attributes.status;

                    if (
                      item.attributes.schedulings.data.some(scheduling => {
                        return (
                          selectedDate.split("T")[0] ===
                          scheduling.attributes.date
                        );
                      })
                    ) {
                      isBusy = true;
                    }

                    if (selectedWeekDate !== item.attributes.weekDay) {
                      return null;
                    }

                    const isBlocked = (blockedAvailabilities.some(blocked => {
                      return (
                        (
                          blocked.time.includes(item.attributes.startsAt) ||
                          blocked.time.includes(item.attributes.endsAt)
                        ) &&
                        blocked.date.includes(selectedDate.split('T')[0])
                      )
                    }))

                    return (
                      <CourtAvailibility
                        key={item.id}
                        id={item.id}
                        startsAt={`${startsAt[0]}:${startsAt[1]}`}
                        endsAt={`${endsAt[0]}:${endsAt[1]}`}
                        price={item.attributes.value}
                        busy={isBusy}
                        isBlocked={isBlocked}
                        selectedTimes={selectedTime}
                        toggleTimeSelection={toggleTimeSelection}
                      />
                    );
                  }}
                />
              )}
            </ScrollView>
            {userData?.id ? (
              <View className="h-fit w-full p-[15px] mt-[30px]">
                <TouchableOpacity
                  className={`h-14 w-full rounded-md  ${
                    !selectedTime ? "bg-[#ffa363]" : "bg-orange-500"
                  } flex items-center justify-center`}
                  disabled={
                    !selectedTime ||
                    !courtAvailability?.court.data.attributes
                      .court_availabilities.data.length
                  }
                  onPress={() => {
                    if (userData && userData.id && selectedTime) {
                      navigation.navigate("ReservationPaymentSign", {
                        courtName: route.params.courtName,
                        courtImage: route.params.courtImage,
                        courtId: route.params.courtId,
                        amountToPay: selectedTime.value,
                        courtAvailabilities: selectedTime.id,
                        courtAvailabilityDate: selectedDate,
                        userPhoto: route.params.userPhoto,
                      });
                    } else {
                      navigation.navigate("Login");
                    }
                  }}
                >
                  <Text className="text-white">RESERVAR</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <View className="h-20"></View>
          </ScrollView>
          <View className="absolute bottom-0 left-0 right-0">
            <BottomBlackMenu
              screen="any"
              userPhoto={
                dataUser?.usersPermissionsUser?.data?.attributes?.photo?.data
                  ?.attributes?.url
                  ? HOST_API +
                    dataUser?.usersPermissionsUser?.data?.attributes?.photo
                      ?.data?.attributes?.url
                  : ""
              }
              key={1}
              isMenuVisible={false}
              paddingTop={2}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
