import { useApolloClient } from "@apollo/client";
import { AntDesign } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, TouchableOpacity, View } from "react-native";
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
  const { goBack } = useNavigation();
  const apolloClient = useApolloClient();
  const [noUserFound, setNoUserFound] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormData>({
    resolver: zodResolver(formSchema),
  });

  const handleSendCodePassword = handleSubmit(async (data) => {
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

      if (!userData.usersPermissionsUsers.data.length) {
        return setNoUserFound(true);
      }

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

      if (!response.data?.sendResetPasswordTokenCustom.success) {
        throw response.data;
      }

      navigation.navigate("InsertResetCode", {
        username: userInfos.attributes.name,
        email: userInfos.attributes.email,
      });
    } catch (error) {
      console.error(error);
      const msgError = JSON.stringify(error, null, 2);
      if (process.env.APP_DEBUG_VERBOSE) {
        Alert.alert("Erro", msgError);
      } else {
        Alert.alert("Erro", "Não foi possível enviar o e-mail.");
      }
    }
  });

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
          disabled={isSubmitting}
          onPress={handleSendCodePassword}
        >
          {isSubmitting ? (
            <ActivityIndicator size={20} color="white" />
          ) : (
            <Text className="text-white font-semibold text-base">Enviar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
