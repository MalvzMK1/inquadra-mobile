import { useApolloClient } from "@apollo/client";
import { AntDesign } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";
import {
  SchedulingsByRedeemCodeResponse,
  SchedulingsByRedeemCodeVariables,
  schedulingsByRedeemCodeQuery,
} from "../../graphql/queries/schedulingsByRedeemCode";

const formSchema = z.object({
  code: z
    .string({ required_error: "O código é obrigatório." })
    .min(1, "O código é obrigatório."),
});

interface InfoReservaRedeemCodeProps {}

export const InfoReservaRedeemCode: React.FC<
  InfoReservaRedeemCodeProps
> = () => {
  const apolloClient = useApolloClient();
  const { navigate } = useNavigation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    control,
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  function handleOpenModal() {
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
  }

  const handleNagivateToRedeemCode = handleSubmit(async values => {
    try {
      const { data } = await apolloClient.query<
        SchedulingsByRedeemCodeResponse,
        SchedulingsByRedeemCodeVariables
      >({
        fetchPolicy: "network-only",
        query: schedulingsByRedeemCodeQuery,
        variables: {
          redeemCode: values.code,
        },
      });

      if (data.schedulings.data.length === 0) {
        return setError("code", {
          message: "Não encontramos reserva com este código.",
        });
      }

      navigate("DescriptionReserve", {
        scheduleId: data.schedulings.data[0].id,
      });
      handleCloseModal();
    } catch (error) {
      console.error(error);
      console.error(JSON.stringify(error, null, 2));
      Alert.alert("Erro", "Não foi possível buscar a reserva.");
    }
  });

  return (
    <View className="px-4 mt-5">
      <TouchableOpacity
        onPress={handleOpenModal}
        style={{
          height: 50,
          width: "100%",
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FF6112",
        }}
      >
        <Text className="text-base text-white">RESGATAR CÓDIGO</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={isModalOpen}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View className="bg-black bg-opacity-10 flex-1 justify-center items-center">
          <View className="bg-[#292929] w-11/12 justify-center rounded-lg p-4">
            <TouchableOpacity
              onPress={handleCloseModal}
              className="bg-[#FF6112] rounded-full w-6 aspect-square items-center justify-center self-end"
            >
              <AntDesign name="close" size={20} color="white" />
            </TouchableOpacity>

            <View>
              <Text className="text-sm text-[#FF6112]">Código</Text>

              <Controller
                name="code"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <View className="mt-1">
                    <TextInput
                      value={field.value}
                      placeholder="5h1Bi"
                      autoCapitalize="none"
                      onChangeText={field.onChange}
                      className="p-3 border border-neutral-400 rounded bg-white"
                    />

                    {error?.message && (
                      <Text className="text-sm text-red-600 font-medium mt-0.5">
                        {error.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            <TouchableOpacity
              disabled={isSubmitting}
              onPress={handleNagivateToRedeemCode}
              style={{
                height: 50,
                width: "100%",
                marginTop: 20,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#FF6112",
              }}
            >
              {isSubmitting ? (
                <ActivityIndicator size={24} color="white" />
              ) : (
                <Text className="text-base text-white font-medium">
                  RESGATAR
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
