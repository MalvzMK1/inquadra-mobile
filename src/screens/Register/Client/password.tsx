import { ApolloError } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { z } from "zod";
import { RegisterHeader } from "../../../components/RegisterHeader";
import { CaptchaCard } from "../../../components/captchaCard";
import { IRegisterUserVariables } from "../../../graphql/mutations/register";
import useRegisterUser from "../../../hooks/useRegisterUser";

type RegisterPasswordProps = NativeStackScreenProps<
  RootStackParamList,
  "RegisterPassword"
>;

interface IFormData {
  password: string;
  confirmPassword: string;
}

const formSchema = z.object({
  password: z.string().nonempty("O campo não pode estar vazio"),
  confirmPassword: z.string().nonempty("O campo não pode estar vazio"),
});

export default function Password({ route, navigation }: RegisterPasswordProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "123456",
      confirmPassword: "123456",
    },
  });
  const [registerUser, { data, error, loading }] = useRegisterUser();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleConfirmShowPassword = () => {
    setShowConfirmedPassword(!showConfirmedPassword);
  };

  const [isTermChecked, setIsTermChecked] = useState(false);
  const [isCaptchaChecked, setIsCaptchaChecked] = useState(true);
  const [isTermCheckedError, setIsTermCheckedError] = useState<boolean>(false);
  const [isCaptchaCheckedError, setIsCaptchaCheckedError] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);

  async function handleSignup(data: IFormData) {
    setIsLoading(true);
    try {
      if (!isTermChecked) {
        return setIsTermCheckedError(true);
      }

      if (data.password !== data.confirmPassword) {
        return setPasswordsMatch(false);
      }

      const userData: IRegisterUserVariables = {
        password: data.password,
        cpf: route.params.data.cpf,
        email: route.params.data.email,
        role: "3",
        phone_number: route.params.data.phoneNumber,
        username: route.params.data.name,
      };

      // await registerUser({ variables: userData });

      if (route.params.flow === "normal") {
        navigation.navigate("RegisterSuccess");
      } else {
        navigation.navigate("EstablishmentRegister", userData);
      }
    } catch (error) {
      if (error instanceof ApolloError) {
        if (error.message === "Email already taken") {
          Alert.alert("Erro", "O e-mail já está em uso.");
        } else if (error.message === "This attribute must be unique") {
          Alert.alert("Erro", "O CPF já está em uso.");
        }
      }

      console.log(JSON.stringify(error, null, 2));
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="flex flex-col bg-white h-screen items-center p-5">
      <View>
        <RegisterHeader
          title="Senha"
          subtitle="Antes de concluir escolha uma senha de acesso."
        ></RegisterHeader>
      </View>

      <View className="gap-2 flex flex-col justify-between items-center w-full mt-2">
        <View className="w-full">
          <Text className="text-base mb-2">Escolha uma senha</Text>
          <View
            className={
              errors.password || !passwordsMatch
                ? "flex flex-row items-center justify-between border border-red-400 rounded"
                : "flex flex-row items-center justify-between border border-neutral-400 rounded"
            }
          >
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
                  secureTextEntry={!showPassword}
                  onChangeText={onChange}
                  className="p-4 flex-1"
                  placeholder="**********"
                />
              )}
            />
            <TouchableOpacity onPress={handleShowPassword}>
              <Image
                className="h-6 w-6 m-4"
                source={
                  !showPassword
                    ? require("../../../assets/eye.png")
                    : require("../../../assets/eye-slash.png")
                }
              ></Image>
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text className="text-red-400 text-sm">
              {errors.password.message}
            </Text>
          )}
          {!passwordsMatch && (
            <Text className="text-red-400 text-sm">
              As senha devem ser iguais
            </Text>
          )}
        </View>

        <View className="w-full">
          <Text className="text-base mt-4 mb-2">Repita a senha escolhida</Text>
          <View
            className={
              errors.confirmPassword || !passwordsMatch
                ? "flex flex-row items-center justify-between border border-red-400 rounded"
                : "flex flex-row items-center justify-between border border-neutral-400 rounded"
            }
          >
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
                  secureTextEntry={!showConfirmedPassword}
                  onChangeText={onChange}
                  className="p-4 flex-1"
                  placeholder="**********"
                  onSubmitEditing={handleSubmit(handleSignup)}
                  returnKeyType="send"
                />
              )}
            />
            <TouchableOpacity onPress={handleConfirmShowPassword}>
              <Image
                className="h-6 w-6 m-4"
                source={
                  !showConfirmedPassword
                    ? require("../../../assets/eye.png")
                    : require("../../../assets/eye-slash.png")
                }
              ></Image>
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && (
            <Text className="text-red-400 text-sm">
              {errors.confirmPassword.message}
            </Text>
          )}
          {!passwordsMatch && (
            <Text className="text-red-400 text-sm">
              As senha devem ser iguais
            </Text>
          )}
        </View>

        <View className="flex flex-row justify-start items-center w-full">
          <CheckBox
            checked={isTermChecked}
            onPress={() => setIsTermChecked(!isTermChecked)}
          />
          <Text className="text-base flex-wrap flex-1">
            Li e estou de acordo com o{" "}
            <Text
              className="text-[#3D58DB] flex-wrap"
              onPress={() => navigation.navigate("TermsOfService")}
            >
              Termo de Uso e Política de Privacidade
            </Text>{" "}
          </Text>
        </View>
        {isTermCheckedError && (
          <Text className="text-red-400 text-sm">Leia os termos</Text>
        )}

        <CaptchaCard
        // checked={true}
        // onChange={(checked) => {
        //     console.log(checked)
        // }}
        />
        {/*<View className="flex flex-row justify-between items-center w-5/6 border rounded-md border-[#CACACA] bg-[#F2F2F2] font-normal p-2">*/}
        {/*    <View className="flex flex-row items-center">*/}
        {/*        <CheckBox*/}
        {/*            checked={isCaptchaChecked}*/}
        {/*            onPress={() => setIsCaptchaChecked(!isCaptchaChecked)}*/}
        {/*            containerStyle={{*/}
        {/*                borderColor: isCaptchaCheckedError ? 'rgb(248 113 113)' : undefined*/}
        {/*            }}*/}
        {/*        />*/}
        {/*        <Text className="text-[#959595] text-base">Não sou um robô</Text>*/}
        {/*    </View>*/}
        {/*    <Image source={require('../../../assets/captcha.png')}></Image>*/}
        {/*</View>*/}
        {isCaptchaCheckedError && (
          <Text className="text-red-400 text-sm">
            Verifique se você é um humano
          </Text>
        )}
      </View>
      <View className="flex-1 mb-14 flex w-full items-center justify-center">
        <TouchableOpacity
          className="h-14 w-full rounded-md bg-orange-500 flex items-center justify-center"
          onPress={handleSubmit(handleSignup)}
        >
          <Text className="text-white font-semibold text-base">
            {isLoading ? (
              <ActivityIndicator size="small" color="#F5620F" />
            ) : (
              "Continuar"
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
