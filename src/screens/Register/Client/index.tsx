import { useApolloClient } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import MaskInput, { Masks } from "react-native-mask-input";
import { z } from "zod";
import { RegisterHeader } from "../../../components/RegisterHeader";
import {
  UserByCpfResponse,
  UserByCpfVariables,
  userByCpfQuery,
} from "../../../graphql/queries/userByCpf";
import {
  IUserByEmailResponse,
  IUserByEmailVariables,
  userByEmailQuery,
} from "../../../graphql/queries/userByEmail";
import {
  UserByUsernameResponse,
  UserByUsernameVariables,
  userByUsernameQuery,
} from "../../../graphql/queries/userByUsername";
import validateCpf from "../../../utils/validateCPF";

interface IFormDatas {
  name: string;
  email: string;
  phoneNumber: string;
  cpf: string;
}

const formSchema = z.object({
  name: z.string().nonempty("O nome não pode estar vazio!"),
  email: z
    .string()
    .nonempty("O E-mail não pode estar vazio!")
    .email("O E-mail passado não é válido")
    .max(254, "O E-mail passado não é válido"),
  phoneNumber: z
    .string()
    .nonempty("O número de telefone não pode estar vazio!")
    .max(15, "O número passado não é válido"),
  cpf: z
    .string()
    .nonempty("O CPF não pode estar vazio!")
    .max(14, "O CPF passado não é válido")
    .refine(cpf => validateCpf(cpf), "CPF Inválido"),
});

export default function Register({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Register">) {
  const apolloClient = useApolloClient();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormDatas>({
    resolver: zodResolver(formSchema),
  });

  const handleGoToNextRegisterPage = handleSubmit(async data => {
    try {
      const [{ data: emailData }, { data: usernameData }, { data: cpfData }] =
        await Promise.all([
          apolloClient.query<IUserByEmailResponse, IUserByEmailVariables>({
            fetchPolicy: "network-only",
            query: userByEmailQuery,
            variables: {
              email: data.email,
            },
          }),
          apolloClient.query<UserByUsernameResponse, UserByUsernameVariables>({
            fetchPolicy: "network-only",
            query: userByUsernameQuery,
            variables: {
              username: data.name,
            },
          }),
          apolloClient.query<UserByCpfResponse, UserByCpfVariables>({
            fetchPolicy: "network-only",
            query: userByCpfQuery,
            variables: {
              cpf: data.cpf,
            },
          }),
        ]);

      if (emailData.usersPermissionsUsers.data.length > 0) {
        return Alert.alert("Erro", "Este e-mail já está em uso.");
      }

      if (usernameData.usersPermissionsUsers.data.length > 0) {
        return Alert.alert("Erro", "Este nome já está em uso.");
      }

      if (cpfData.usersPermissionsUsers.data.length > 0) {
        return Alert.alert("Erro", "Este cpf já está em uso.");
      }

      navigation.navigate("RegisterPassword", {
        data,
        flow: route.params.flow,
      });
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro inesperado.");
    }
  });

  return (
    <ScrollView className="flex-1 bg-white p-2">
      <View className="h-full p-4">
        <RegisterHeader
          title="Cadastro"
          subtitle="Vamos precisar de alguns dados seus..."
        />

        <View className="gap-4 flex flex-col  justify-between">
          <View>
            <Text className="text-base mb-2">Qual é o seu nome?</Text>
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  className={
                    errors.name
                      ? "p-4 border border-red-400 rounded"
                      : "p-4 border border-neutral-400 rounded"
                  }
                  placeholder="Ex.: João"
                />
              )}
            />
            {errors.name && (
              <Text className="text-red-400 text-sm">
                {errors.name.message}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-base mb-2">Qual é o seu email?</Text>
            <Controller
              name="email"
              control={control}
              rules={{
                required: true,
                maxLength: 254,
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  maxLength={254}
                  value={value}
                  onChangeText={onChange}
                  className={
                    errors.email
                      ? "p-4 border border-red-400 rounded"
                      : "p-4 border border-neutral-400 rounded"
                  }
                  placeholder="exemplo@mail.com.br"
                />
              )}
            />
            {errors.email && (
              <Text className="text-red-400 text-sm">
                {errors.email.message}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-base mb-2">Telefone para contato</Text>
            <Controller
              name={"phoneNumber"}
              control={control}
              rules={{
                required: true,
                minLength: 11,
                maxLength: 11,
              }}
              render={({ field: { onChange, value } }) => (
                <MaskInput
                  mask={Masks.BRL_PHONE}
                  maskAutoComplete={true}
                  value={value}
                  textContentType="telephoneNumber"
                  keyboardType="phone-pad"
                  maxLength={15}
                  onChangeText={(masked, unmasked, obfuscated) => {
                    onChange(unmasked);
                  }}
                  className={
                    errors.phoneNumber
                      ? "p-4 border border-red-400 rounded"
                      : "p-4 border border-neutral-400 rounded"
                  }
                  placeholder="(00) 00000-0000"
                />
              )}
            />
            {errors.phoneNumber && (
              <Text className="text-red-400 text-sm">
                {errors.phoneNumber.message}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-base mb-2">CPF</Text>
            <Controller
              name="cpf"
              control={control}
              rules={{
                required: true,
                minLength: 11,
                maxLength: 11,
              }}
              render={({ field: { onChange, value } }) => (
                <MaskInput
                  mask={Masks.BRL_CPF}
                  maskAutoComplete={true}
                  value={value}
                  keyboardType="numeric"
                  maxLength={14}
                  onChangeText={(masked, unmasked, obfuscated) => {
                    onChange(unmasked);
                  }}
                  className={
                    errors.cpf
                      ? "p-4 border border-red-400 rounded"
                      : "p-4 border border-neutral-400 rounded"
                  }
                  placeholder="000.000.000-00"
                />
              )}
            />
            {errors.cpf && (
              <Text className="text-red-400 text-sm">{errors.cpf.message}</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          disabled={isSubmitting}
          className="h-14 w-81 rounded-md bg-orange-500 flex items-center justify-center m-6"
          onPress={handleGoToNextRegisterPage}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white text-base font-semibold">
              Continuar
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
