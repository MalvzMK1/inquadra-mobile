import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, Image, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
import {useState} from "react";

export default function CourtDetails({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "CourtDetails">) {
  const courts = route.params.courtArray;

  function calculateHourRange(courtAppointmentsHour: { startsAt: string, endsAt: string }[][]): { startsAt: string, endsAt: string } | undefined {
    let startsAt: string = '9999';
    let endsAt: string = '0';

    courtAppointmentsHour.forEach(appointmentHour => {
      appointmentHour.forEach(hour => {
        const parsedStartsAt = hour.startsAt.split(':').join('');
        const parsedEndsAt = hour.endsAt.split(':').join('');

        if (Number(parsedEndsAt) > Number(endsAt)) endsAt = parsedEndsAt;
        if (Number(parsedStartsAt) < Number(startsAt)) startsAt = parsedStartsAt;
      });
    });

    if (startsAt !== '9999' && endsAt !== '0') {
      startsAt = parseFlatHours(startsAt);
      endsAt = parseFlatHours(endsAt);

      return { startsAt, endsAt };
    }
    return;
  }

  function parseFlatHours(time: string): string {
    if (time.length === 4) {
      if (!Number.isNaN(time)) {
        const hours = time.slice(0, 2);
        const minutes = time.slice(2);

        return `${hours}:${minutes}`;
      } else throw new Error('Couldn\'t parse hour to number, please, provide only numbers');
    } else throw new Error('The provided hour is invalid, please provide a hour like "1200"');
  }

  return (
    <View className="flex-1 pt-12">
      <View className="flex-row justify-between items-center">
        <TouchableOpacity onPress={navigation.goBack}>
          <Icon name="arrow-back" size={24} color="#4E4E4E" />
        </TouchableOpacity>

        <Text className="text-[32px] text-[#4E4E4E] font-semibold -translate-x-3">
          Tudo Certo ?
        </Text>

        <View />
      </View>

      <Text className="p-2 pt-6 text-2xl">Detalhes Quadra</Text>

      <FlatList
        data={courts}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item: court }) => {

          const courtAppointmentsHour = court.court_availabilities.map(availability => {
            return availability.map(appointment => {
              return {
                startsAt: appointment.startsAt,
                endsAt: appointment.endsAt,
              }
            })
          })

          const hourRange: {startsAt: string, endsAt: string} | undefined = calculateHourRange(courtAppointmentsHour);

          return (
            <View className="bg-[#292929]">
              <View className="flex flex-row pl-5 pt-5 pb-5">
                <Image
                  className="w-2/5"
                  source={court.photos[0]}
                />

                <View className="w-4/6 pr-5">
                  <View className="flex flex-row pr-2">
                    <Text className="text-[#FF6112] font-bold pl-2 flex-grow">
                      {court.fantasyName}
                    </Text>

                    <Ionicons
                      size={20}
                      name="pencil"
                      color="#FF6112"
                      onPress={() => navigation.pop(2)}
                    />
                  </View>

                  <Text className="text-white font-bold pl-2">
                    Valor inicial: {court.minimum_value} reais
                  </Text>

                  <Text className="text-white font-bold pl-2">
                    Locação de:
                  </Text>

                  <Text className="text-white font-bold pl-2">
                    Day User: {court.dayUse.includes(true) ? 'Habilitado' : 'Desabilitado'}
                  </Text>

                  {
                    hourRange && (
                      <Text className="text-white font-bold pl-2">
                        Horário: das {hourRange.startsAt} as {hourRange.endsAt}
                      </Text>
                    )
                  }
                </View>
              </View>
            </View>
          )
        }}
      />

      <TouchableOpacity
        className="h-14 w-81 m-6 rounded-md bg-[#FF6112] flex items-center justify-center"
        onPress={navigation.goBack}
      >
        <Text className="text-gray-50">Concluir</Text>
      </TouchableOpacity>
    </View>
  );
}
