import { useApolloClient } from "@apollo/client";
import { AntDesign } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ActivityIndicator, TextInput } from "react-native-paper";
import { z } from "zod";
import {
  SendResetPasswordTokenResponse,
  SendResetPasswordTokenVariables,
  sendResetPasswordTokenMutation,
} from "../../graphql/mutations/send-reset-password-token";
import {
  IUserByEmailResponse,
  IUserByEmailVariables,
  userByEmailQuery,
} from "../../graphql/queries/userByEmail";

interface IFormData {
  email: string;
}

const formSchema = z.object({
  email: z
    .string()
    .nonempty({ message: "Este campo não pode estar vazio" })
    .max(256, "Insira um E-mail válido")
    .email({ message: "Insira um E-mail válido" }),
});

export default function ForgotPassword({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "ForgotPassword">) {
  const [noUserFound, setNoUserFound] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const apolloClient = useApolloClient();
  const { goBack } = useNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    resolver: zodResolver(formSchema),
  });

  async function handleSendCodePassword(data: IFormData) {
    setIsLoading(true);
    try {
      const { data: userData } = await apolloClient.query<
        IUserByEmailResponse,
        IUserByEmailVariables
      >({
        query: userByEmailQuery,
        variables: {
          email: data.email,
        },
      });

      if (userData && userData.usersPermissionsUsers.data.length > 0) {
        const userInfos = userData.usersPermissionsUsers.data[0];
        const response = await apolloClient.mutate<
          SendResetPasswordTokenResponse,
          SendResetPasswordTokenVariables
        >({
          mutation: sendResetPasswordTokenMutation,
          variables: {
            email: data.email,
          },
        });
        if (
          response.data &&
          response.data.sendResetPasswordTokenCustom.success
        ) {
          navigation.navigate("InsertResetCode", {
            id: userInfos.id,
            username: userInfos.attributes.username,
            email: userInfos.attributes.email,
          });
        } else {
          Alert.alert("Erro", "Não foi possível enviar o e-mail.");
        }
      } else {
        setNoUserFound(true);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível enviar o e-mail.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="h-full w-screen bg-white flex-1 justify-center items-center p-4">
      <View className="absolute left-4 top-16">
        <TouchableOpacity onPress={goBack}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text className="text-xl font-bold text-gray-900">Esqueceu a senha?</Text>
      <Text className="text-base mt-4 text-gray-900 text-center">
        Digite seu email para enviarmos seu código de recuperação.
      </Text>
      <View className="w-full">
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange } }) => (
            <TextInput
              className="h-14 mt-4 text-base"
              keyboardType="email-address"
              onChangeText={onChange}
              outlineColor="#DCDCDC"
              mode="outlined"
              label={<Text style={{ color: "#DCDCDC" }}>E-mail</Text>}
              left={
                <TextInput.Icon
                  icon={"lock-outline"}
                  color="#DCDCDC"
                  style={{ marginTop: 15 }}
                />
              }
              theme={{
                colors: {
                  placeholder: "#DCDCDC",
                  primary: "#DCDCDC",
                  text: "#DCDCDC",
                  background: "white",
                },
              }}
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-600 text-sm mt-4">
            {errors.email.message}
          </Text>
        )}
        {noUserFound && (
          <Text className="text-red-600 text-sm mt-4">
            Nenhum usuário encontrado
          </Text>
        )}
      </View>
      <View className={"w-full"}>
        <TouchableOpacity
          className="h-14 rounded-md bg-orange-500 mt-6 flex items-center justify-center"
          onPress={handleSubmit(handleSendCodePassword)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size={20} color="white" />
          ) : (
            <Text className="text-white font-semibold text-base">Enviar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
