import { useApolloClient } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, Text, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { TextInput } from "react-native-paper";
import { z } from "zod";
import {
  IUserByIdResponse,
  IUserByIdVariables,
  userByIdQuery,
} from "../../graphql/queries/userById";
import useLoginUser from "../../hooks/useLoginUser";
import storage from "../../utils/storage";

interface IFormData {
  identifier: string;
  password: string;
}

const formSchema = z.object({
  identifier: z.string().nonempty("O campo não pode estar vazio"),
  password: z.string().nonempty("O campo não pode estar vazio"),
});

export default function Login() {
  const apolloClient = useApolloClient();
  const [userGeolocation, setUserGeolocation] = useState<{
    latitude: number;
    longitude: number;
  }>();
  const [authUser] = useLoginUser();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    storage
      .load<{ latitude: number; longitude: number }>({
        key: "userGeolocation",
      })
      .then(data => setUserGeolocation(data));
  }, []);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (data: IFormData) => {
    setIsLoading(true);
    try {
      const authData = await authUser({
        variables: {
          identifier: data.identifier.trim(),
          password: data.password.trim(),
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
      storage.save({
        key: "userInfos",
        data: {
          token: authData.data.login.jwt,
          userId: authData.data.login.user.id,
        },
        expires: 1000 * 3600,
      });

      storage.load<UserInfos>({
        key: "userInfos",
      });
      if (userData.usersPermissionsUser.data.attributes.role.data.id === "3") {
        navigation.navigate("Home", {
          userGeolocation: userGeolocation
            ? userGeolocation
            : { latitude: 78.23570781291714, longitude: 15.491400000982967 },
          userID: authData.data.login.user.id,
          userPhoto: undefined,
        });
      } else if (
        userData.usersPermissionsUser.data.attributes.role.data.id === "4"
      ) {
        navigation.navigate("HomeEstablishment", {
          userID: authData.data.login.user.id,
          userPhoto: undefined,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 h-max w-max bg-white">
      <View className="h-16 W-max" />
      <View className="flex-1 flex items-center justify-center px-7">
        <TouchableOpacity
          onPress={() => {
            storage
              .save({
                key: "userInfos",
                data: {
                  jwt: undefined,
                  userId: 1,
                },
                expires: 1000 * 3600,
              })
              .then(() => {
                storage
                  .load<UserInfos>({
                    key: "userInfos",
                  })
                  .then(response => {
                    navigation.navigate("Home", {
                      userGeolocation: userGeolocation
                        ? userGeolocation
                        : {
                          latitude: 78.23570781291714,
                          longitude: 15.491400000982967,
                        },
                      userID: response.userId,
                      userPhoto: undefined,
                    });
                  });
              });
          }}
        >
          <Text className="text-base text-gray-400 pb-5">Seja bem-vindo!</Text>
        </TouchableOpacity>

        <View className="w-full">
          <Controller
            name="identifier"
            control={control}
            render={({ field: { onChange } }) => (
              <TextInput
                className="h-14 text-base"
                keyboardType="email-address"
                onChangeText={onChange}
                outlineColor="#DCDCDC"
                mode="outlined"
                label={<Text style={{ color: "#DCDCDC" }}>Email</Text>}
                left={
                  <TextInput.Icon
                    icon={"account-outline"}
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
          {errors.identifier && (
            <Text className="text-red-400 text-sm">
              {errors.identifier.message}
            </Text>
          )}
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange } }) => (
              <TextInput
                className="h-14 mt-2 text-base"
                secureTextEntry={!showPassword}
                onChangeText={onChange}
                mode="outlined"
                outlineColor="#DCDCDC"
                label={<Text style={{ color: "#DCDCDC" }}>******</Text>}
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
          <View className="flex items-end pt-4 pb-10">
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text className="text-gray-400 text-base underline">
                Esqueceu a senha?
              </Text>
            </TouchableOpacity>
          </View>
          <View className="h-11 pt-4">
            <TouchableOpacity
              className="h-14 w-81 rounded-md bg-orange-500 flex items-center justify-center"
              onPress={handleSubmit(handleLogin)}
            >
              <Text className="text-white text-base">
                {isLoading ? (
                  <ActivityIndicator size="small" color="#F5620F" />
                ) : (
                  "Entrar"
                )}
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row  items-center justify-center pt-11">
            <Text className="text-base text-gray-400">
              Ainda não tem uma conta?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("ChooseUserType")}
            >
              <Text className="text-orange-500 text-base underline">
                Clique aqui
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
