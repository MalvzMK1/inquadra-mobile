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
  ResetPasswordResponse,
  ResetPasswordVariables,
  resetPasswordMutation,
} from "../../graphql/mutations/reset-password";

interface IFormData {
  password: string;
  confirmPassword: string;
}

const formSchema = z
  .object({
    password: z
      .string()
      .nonempty("Este campo não pode estar vazio.")
      .min(6, "A senha precisa ter no mínimo 6 caracteres"),
    confirmPassword: z
      .string()
      .nonempty("Este campo não pode estar vazio.")
      .min(6, "A senha precisa ter no mínimo 6 caracteres"),
  })
  .superRefine(({ password, confirmPassword }, context) => {
    if (password !== confirmPassword) {
      context.addIssue({
        code: "custom",
        message: "As senhas não coincidem.",
        path: ["confirmPassword"],
      });
    }
  });

export function SetNewPassword({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "SetNewPassword">) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    resolver: zodResolver(formSchema),
  });

  const { goBack } = useNavigation();
  const apolloClient = useApolloClient();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  async function handleResetPassword(values: IFormData) {
    setIsLoading(true);
    try {
      const { data } = await apolloClient.mutate<
        ResetPasswordResponse,
        ResetPasswordVariables
      >({
        mutation: resetPasswordMutation,
        variables: {
          password: values.password,
          token: route.params.code,
        },
      });
      if (data?.resetUserPasswordCustom.success) {
        navigation.navigate("Login");
      } else {
        Alert.alert("Erro", "Não foi possível alterar a senha.");
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View className="h-full w-screen bg-white flex justify-center items-center px-4">
      <View className="absolute left-4 top-16">
        <TouchableOpacity onPress={goBack}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text className="text-xl font-semibold text-gray-900">
        Definir nova senha
      </Text>
      <View className="my-12 w-full h-fit flex">
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange } }) => (
            <TextInput
              className="h-14 text-base"
              keyboardType="numbers-and-punctuation"
              onChangeText={onChange}
              secureTextEntry={!showPassword}
              outlineColor="#DCDCDC"
              mode="outlined"
              label={<Text style={{ color: "#DCDCDC" }}>Senha</Text>}
              left={
                <TextInput.Icon
                  icon={"lock-outline"}
                  color="#DCDCDC"
                  style={{ marginTop: 15 }}
                />
              }
              right={
                <TextInput.Icon
                  icon={!showPassword ? "eye-off-outline" : "eye-outline"}
                  color="#DCDCDC"
                  style={{ marginTop: 15 }}
                  onPress={handleShowPassword}
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
        {errors.password && (
          <Text className="text-red-400 text-sm">
            {errors.password.message}
          </Text>
        )}
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field: { onChange } }) => (
            <TextInput
              className="h-14 text-base mt-2"
              keyboardType="numbers-and-punctuation"
              secureTextEntry={!showPassword}
              onChangeText={onChange}
              outlineColor="#DCDCDC"
              mode="outlined"
              label={
                <Text style={{ color: "#DCDCDC" }}>Confirme sua senha</Text>
              }
              left={
                <TextInput.Icon
                  icon={"lock-outline"}
                  color="#DCDCDC"
                  style={{ marginTop: 15 }}
                />
              }
              right={
                <TextInput.Icon
                  icon={!showPassword ? "eye-off-outline" : "eye-outline"}
                  color="#DCDCDC"
                  style={{ marginTop: 15 }}
                  onPress={handleShowPassword}
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
        {errors.confirmPassword && (
          <Text className="text-red-400 text-sm">
            {errors.confirmPassword.message}
          </Text>
        )}

        {errors.root?.message}
      </View>
      <View className={"w-full"}>
        <TouchableOpacity
          className="h-14 mt-6 rounded-md bg-orange-500 flex items-center justify-center"
          onPress={handleSubmit(handleResetPassword)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size={20} color="white" />
          ) : (
            <Text className="text-white text-base font-semibold">
              Confirmar
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
