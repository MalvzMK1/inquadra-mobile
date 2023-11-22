import { zodResolver } from "@hookform/resolvers/zod";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { CheckBox } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import MaskInput, { Masks } from "react-native-mask-input";
import { z } from "zod";
import useRegisterUser from "../../hooks/useRegisterUser";
import validateCpf from "../../utils/validateCPF";

const formSchema = z.object({
  name: z.string().nonempty("O nome não pode estar vazio!"),
  email: z
    .string()
    .nonempty("O E-mail não pode estar vazio!")
    .includes("@", {
      message: "O E-mail passado não é válido",
    })
    .max(254, "O E-mail passado não é válido"),
  phoneNumber: z
    .string()
    .nonempty("O número de telefone não pode estar vazio!")
    .max(15, "O número passado não é válido"),
  cpf: z
    .string()
    .nonempty("O CPF não pode estar vazio!")
    .max(14, "O CPF passado não é válido"),
  password: z.string().nonempty("O campo não pode estar vazio"),
  confirmPassword: z.string().nonempty("O campo não pode estar vazio"),
});

export default function ProfileEstablishmentRegistration() {
  const [registerUser, { data, error, loading }] = useRegisterUser();

  interface IFormDatas {
    name: string;
    email: string;
    phoneNumber: string;
    cpf: string;
    password: string;
    confirmPassword: string;
  }

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<IFormDatas>({
    resolver: zodResolver(formSchema),
  });

  const [isChecked, setIsChecked] = useState(false);
  const [samePasswords, setSamePasswords] = useState(true);
  const [validCpf, setValidCpf] = useState(true);

  function handleGoToNextRegisterPage(data: IFormDatas): void {
    let result = false;
    if (data.confirmPassword == data.password) {
      result = true;
      if (isChecked) {
        if (validateCpf(data.cpf)) {
          navigation.navigate("EstablishmentRegister", {
            username: data.name,
            cpf: data.cpf,
            email: data.email,
            password: data.password,
            phone_number: data.phoneNumber,
            role: "4",
          });
        } else setValidCpf(false);
      } else {
        if (!isChecked)
          Alert.alert(
            "Termos de Uso e Política de Privacidade",
            "É necessario aceitar os termos e condições para prosseguir",
          );
      }
    }
    setSamePasswords(result);
  }

  return (
    <View className="flex-1 bg-white h-screen">
      <ScrollView>
        <View className="items-center mt-9 p-4">
          <Text className="text-3xl text-center font-extrabold text-gray-700">
            Cadastro Pessoal
          </Text>
        </View>
        <View className="h-screen">
          <View className="p-5 gap-7 flex flex-col justify-between">
            <View>
              <Text className="text-xl p-1">Qual é o seu nome?</Text>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange } }) => (
                  <TextInput
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
              <Text className="text-xl p-1">Qual é o seu email?</Text>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: true,
                  maxLength: 254,
                }}
                render={({ field: { onChange } }) => (
                  <TextInput
                    textContentType="emailAddress"
                    keyboardType="email-address"
                    maxLength={254}
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
              <Text className="text-xl p-1">CPF</Text>
              <Controller
                name="cpf"
                control={control}
                rules={{
                  required: true,
                  minLength: 11,
                  maxLength: 11,
                }}
                render={({ field: { onChange } }) => (
                  <MaskInput
                    mask={Masks.BRL_CPF}
                    maskAutoComplete={true}
                    value={getValues("cpf")}
                    keyboardType="numeric"
                    maxLength={14}
                    onChange={() => setValidCpf(true)}
                    onChangeText={(masked, unmasked, obfuscated) =>
                      onChange(unmasked)
                    }
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
                <Text className="text-red-400 text-sm">
                  {errors.cpf.message}
                </Text>
              )}
              {!validCpf && !errors.cpf && (
                <Text className="text-red-400 text-sm">
                  Digite um CPF valido
                </Text>
              )}
            </View>
            <View>
              <Text className="text-xl p-1">Telefone para Contato</Text>
              <Controller
                name={"phoneNumber"}
                control={control}
                rules={{
                  required: true,
                  minLength: 11,
                  maxLength: 11,
                }}
                render={({ field: { onChange } }) => (
                  <MaskInput
                    mask={Masks.BRL_PHONE}
                    maskAutoComplete={true}
                    value={getValues("phoneNumber")}
                    textContentType="telephoneNumber"
                    keyboardType="phone-pad"
                    maxLength={15}
                    onChangeText={(masked, unmasked, obfuscated) =>
                      onChange(unmasked)
                    }
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
          </View>
          <View className="p-5 gap-7 flex flex-col">
            <View>
              <Text className="text-xl p-1">Criar Senha para acesso</Text>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: true,
                  minLength: 6,
                }}
                render={({ field: { onChange } }) => (
                  <TextInput
                    textContentType="password"
                    onChangeText={onChange}
                    className={
                      errors.password || !samePasswords
                        ? "p-4 border border-red-400 rounded"
                        : "p-4 border border-neutral-400 rounded"
                    }
                    placeholder="**********"
                    secureTextEntry
                  />
                )}
              />
              {errors.password && (
                <Text className="text-red-400 text-sm">
                  {errors.password.message}
                </Text>
              )}
              {!samePasswords && (
                <Text className="text-red-400 text-sm">
                  As senha devem ser iguais
                </Text>
              )}
            </View>
            <View>
              <Text className="text-xl p-1">Repita sua nova senha</Text>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: true,
                  minLength: 6,
                }}
                render={({ field: { onChange } }) => (
                  <TextInput
                    textContentType="password"
                    onChangeText={onChange}
                    className={
                      errors.confirmPassword || !samePasswords
                        ? "p-4 border border-red-400 rounded"
                        : "p-4 border border-neutral-400 rounded"
                    }
                    placeholder="**********"
                    secureTextEntry
                  />
                )}
              />
              {errors.confirmPassword && (
                <Text className="text-red-400 text-sm">
                  {errors.confirmPassword.message}
                </Text>
              )}
              {!samePasswords && (
                <Text className="text-red-400 text-sm">
                  As senha devem ser iguais
                </Text>
              )}
            </View>
          </View>
        </View>
        <View className="px-5 pt-6">
          <View className="flex flex-row w-4/5">
            <CheckBox
              className=""
              checked={isChecked}
              onPress={() => setIsChecked(!isChecked)}
            />
            <View className="flex">
              <Text className="text-base">
                Li e estou de acordo com o{" "}
                <Text
                  className="text-[#3D58DB]"
                  onPress={() => navigation.navigate("TermsOfService")}
                >
                  Termo de Uso e Política de Privacidade
                </Text>{" "}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="h-14 w-full rounded-md bg-orange-500 flex items-center justify-center mb-3"
            onPress={handleSubmit(handleGoToNextRegisterPage)}
          >
            <Text className="text-gray-50">Continuar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
