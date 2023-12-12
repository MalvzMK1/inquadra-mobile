import { ApolloError, useApolloClient } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { z } from "zod";
import { RegisterHeader } from "../../../components/RegisterHeader";
import { useUser } from "../../../context/userContext";
import type { IRegisterUserVariables } from "../../../graphql/mutations/register";
import {
  IUserByIdResponse,
  IUserByIdVariables,
  userByIdQuery,
} from "../../../graphql/queries/userById";
import useLoginUser from "../../../hooks/useLoginUser";
import useRegisterUser from "../../../hooks/useRegisterUser";

type RegisterPasswordProps = NativeStackScreenProps<
  RootStackParamList,
  "RegisterPassword"
>;

interface IFormData {
  password: string;
  confirmPassword: string;
}

const formSchema = z
  .object({
    password: z.string().nonempty("O campo não pode estar vazio"),
    confirmPassword: z.string().nonempty("O campo não pode estar vazio"),
  })
  .superRefine((values, context) => {
    if (values.password !== values.confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "As senhas devem ser iguais",
      });
    }
  });

export default function Password({ route, navigation }: RegisterPasswordProps) {
  const { userData: storageUserData, setUserData } = useUser();
  const apolloClient = useApolloClient();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IFormData>({
    resolver: zodResolver(formSchema),
  });
  const [registerUser] = useRegisterUser();
  const [authUser] = useLoginUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleConfirmShowPassword = () => {
    setShowConfirmedPassword(!showConfirmedPassword);
  };

  const [isTermChecked, setIsTermChecked] = useState(false);
  const [isTermCheckedError, setIsTermCheckedError] = useState<boolean>(false);
  // const [isCaptchaCheckedError, setIsCaptchaCheckedError] =
  //   useState<boolean>(false);

  const handleSignup = handleSubmit(async (data: IFormData) => {
    try {
      if (!isTermChecked) {
        return setIsTermCheckedError(true);
      }

      if (route.params.flow === "normal") {
        const registerData: IRegisterUserVariables = {
          password: data.password,
          cpf: route.params.data.cpf,
          email: route.params.data.email,
          username: route.params.data.email,
          role: "3",
          phone_number: route.params.data.phoneNumber,
          name: route.params.data.name,
        };

        const registerResponse = await registerUser({
          variables: registerData,
        });

        if (!registerResponse.data) {
          throw new Error("No register data");
        }

        const authData = await authUser({
          variables: {
            identifier: registerData.email,
            password: registerData.password,
          },
        });

        if (!authData.data) {
          throw new Error("No auth data.");
        }

        const { data: userData } = await apolloClient.query<
          IUserByIdResponse,
          IUserByIdVariables
        >({
          query: userByIdQuery,
          variables: {
            id: authData.data.login.user.id,
          },
        });

        if (!userData) {
          throw new Error("No user data.");
        }

        const newUserId = authData.data.login.user.id;
        const newUserJwt = authData.data.login.jwt;

        setUserData({
          id: newUserId,
          jwt: newUserJwt,
          geolocation: storageUserData?.geolocation,
        }).then(() => {
          navigation.navigate("RegisterSuccess", {
            nextRoute: "Home",
            routePayload: {
              userGeolocation: storageUserData?.geolocation ?? undefined,
              userID: newUserId,
              userPhoto: undefined,
            },
          });
        });
      } else if (route.params.flow === "establishment") {
        navigation.navigate("EstablishmentRegister", {
          role: "4",
          password: data.password,
          cpf: route.params.data.cpf,
          name: route.params.data.name,
          email: route.params.data.email,
          phone_number: route.params.data.phoneNumber,
        });
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
    }
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      style={{ flex: 1 }}
    >
      <ScrollView className="h-fit min-h-full">
        <View className="flex flex-col bg-white h-screen items-center p-5">
          <View>
            <RegisterHeader
              title="Senha"
              subtitle="Antes de concluir escolha uma senha de acesso."
            />
          </View>

          <View className="gap-2 flex flex-col justify-between items-center w-full mt-2">
            <View className="w-full">
              <Text className="text-base mb-2">Escolha uma senha</Text>
              <View
                className={
                  errors.password
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
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      textContentType="password"
                      value={value}
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
            </View>

            <View className="w-full">
              <Text className="text-base mt-4 mb-2">
                Repita a senha escolhida
              </Text>
              <View
                className={
                  errors.confirmPassword
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
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      textContentType="password"
                      value={value}
                      secureTextEntry={!showConfirmedPassword}
                      onChangeText={onChange}
                      className="p-4 flex-1"
                      placeholder="**********"
                      onSubmitEditing={handleSignup}
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
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text className="text-red-400 text-sm">
                  {errors.confirmPassword.message}
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
          </View>
          <View className="flex-1 mb-14 flex w-full items-center justify-center">
            <TouchableOpacity
              disabled={isSubmitting}
              className="h-14 w-full rounded-md bg-orange-500 flex items-center justify-center"
              onPress={handleSignup}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">
                  Continuar
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
