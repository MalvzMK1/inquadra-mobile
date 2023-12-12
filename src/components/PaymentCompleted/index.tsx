import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";

enum EStatus {
  processing,
  completed,
  failed,
}

export type TPaymentStatus = keyof typeof EStatus;

interface IPaymentCompletedProps {
  name: string;
  image: string;
  status: keyof typeof EStatus;
}

const COUNTDOWN_START_VALUE = 5;

export default function PaymentCompleted({
  name,
  image,
  status,
}: IPaymentCompletedProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [failedCountDown, setFailedCountDown] = useState<number>(
    COUNTDOWN_START_VALUE,
  );

  useEffect(() => {
    if (status !== "failed") return;

    const timeout = setTimeout(navigation.goBack, 1000 * COUNTDOWN_START_VALUE);
    const interval = setInterval(() => {
      setFailedCountDown(currentCountdown => currentCountdown - 1);
    }, 1000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [status]);

  return (
    <View
      className={
        "w-full h-screen absolute z-50 flex-1 flex items-center justify-center bg-white"
      }
    >
      {status === "processing" ? (
        <View className="flex flex-col items-center justify-center gap-y-32">
          <Image
            className="w-24"
            source={require("../../../assets/icon.png")}
          />
          <Text className="text-xl font-bold">Pagamento em Processamento</Text>
        </View>
      ) : status === "completed" ? (
        <View className="flex flex-col items-center justify-center px-12 gap-y-6">
          <View className="flex flex-col items-center justify-center gap-y-3">
            <Text className="font-bold text-xl">{name}</Text>
            <View className="w-[300px] h-52 rounded-xl overflow-hidden">
              <Image className="w-full h-full" source={{ uri: image }} />
            </View>
            <Text className="font-bold text-xl">Local Reservado</Text>
          </View>
          <View className="flex flex-row items-center">
            <Text className="font-bold text-xl text-center flex flex-row">
              Você pode verificar sua reserva no ícone
              <Text
                className="font-bold text-xl text-center flex flex-row text-orange-500"
                onPress={() => navigation.navigate("InfoReserva")}
              >
                {" calendário"}
              </Text>
            </Text>
          </View>
        </View>
      ) : (
        <View className="flex flex-col items-center justify-center px-12 gap-y-6">
          <Ionicons size={128} color={"#d01d1d"} name="close-circle-outline" />
          <View className="flex flex-col gap-y-2 items-center justify-center">
            <Text className="font-bold text-xl text-center">
              Não foi possível realizar o pagamento
            </Text>
            <Text className="font-bold text-xl text-center">
              Você será redirecionado em {failedCountDown}...
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
