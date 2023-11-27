import { AntDesign } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TextInput } from "react-native-paper";
import { z } from "zod";

interface IFormData {
  code: string;
}

const formSchema = z.object({
  code: z.string().nonempty({ message: "Este campo não pode estar vazio" }),
});

export function InsertResetCode({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "InsertResetCode">) {
  const { goBack } = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormData>({
    resolver: zodResolver(formSchema),
  });

  const handleValidateCode = handleSubmit(data => {
    navigation.navigate("SetNewPassword", {
      code: data.code,
    });
  });

  return (
    <View className="h-full w-screen bg-white relative flex justify-center items-center p-4">
      <View className="absolute left-4 top-16">
        <TouchableOpacity onPress={goBack}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text className="text-xl font-bold text-gray-900">
        Código de verificação
      </Text>
      <Text className="text-base mt-4 text-gray-900s text-center">
        Enviamos um código de recuperação para o e-mail {route.params.email}
      </Text>
      <View className="w-full mt-4 flex">
        <Controller
          name="code"
          control={control}
          render={({ field: { onChange } }) => (
            <TextInput
              className="h-14 text-base"
              keyboardType="email-address"
              onChangeText={onChange}
              outlineColor="#DCDCDC"
              mode="outlined"
              returnKeyType="send"
              onSubmitEditing={handleValidateCode}
              label={<Text style={{ color: "#DCDCDC" }}>Código</Text>}
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
        {errors.code && (
          <Text className="text-red-400 text-sm">
            {errors.code.message === "Required"
              ? "Este campo não pode estar vazio!"
              : errors.code.message}
          </Text>
        )}
      </View>
      <View className={"w-full"}>
        <TouchableOpacity
          className="h-14 mt-6 rounded-md bg-orange-500 flex items-center justify-center"
          onPress={handleValidateCode}
        >
          <Text className="text-white text-base font-semibold">Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
