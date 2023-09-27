import React, { useEffect, useState } from 'react'
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useLoginUser from "../../hooks/useLoginUser";
import storage from "../../utils/storage";
import { useGetUserById } from '../../hooks/useUserById';

interface IFormData {
    identifier: string
    password: string
}

const formSchema = z.object({
    identifier: z.string()
        .nonempty('O campo não pode estar vazio'),
    password: z.string()
        .nonempty('O campo não pode estar vazio')
})

export default function Login() {
    const [userGeolocation, setUserGeolocation] = useState<{ latitude: number, longitude: number }>()
    const [authUser, { data, loading, error }] = useLoginUser()
    const [userId, setUserId] = useState<string>("0")
    const [roleUser, setRoleUser] = useState<string>()
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { data: userData, loading: userLoading, error: userError } = useGetUserById(userId);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { control, handleSubmit, formState: { errors } } = useForm<IFormData>({
        resolver: zodResolver(formSchema)
    })


    useEffect(() => {
        if (userId && userId !== "0") {
            if (userId && userData) {
                setRoleUser(userData?.usersPermissionsUser.data.attributes.role.data.id);
            }
        }
    }, [userId, userData]);

    useEffect(() => {
        if (userId && userId !== "0") {
            if (!isLoading && userId && userData) {
                if (roleUser === "3") {
                    navigation.navigate('Home', {
                        userGeolocation: userGeolocation ? userGeolocation : { latitude: 78.23570781291714, longitude: 15.491400000982967 },
                        userID: userId,
                        userPhoto: undefined
                    });
                } else if (roleUser === "4") {
                    navigation.navigate('HomeEstablishment', {
                        userID: userId,
                        userPhoto: undefined
                    });
                }
            }
        }

        storage.save({
            key: 'userInfos',
            data: {
                token: "",
                userId: "",
            },
            expires: 1000 * 3600,
        })
    }, [roleUser, isLoading]);


    storage.load<{ latitude: number, longitude: number }>({
        key: 'userGeolocation'
    }).then(data => setUserGeolocation(data))

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const handleLogin = (data: IFormData): void => {
        setIsLoading(true);
        authUser({
            variables: {
                identifier: data.identifier.trim(),
                password: data.password.trim(),
            },
        }).then(authData => {
            if (authData.data) {
                storage.save({
                    key: 'userInfos',
                    data: {
                        token: authData.data.login.jwt,
                        userId: authData.data.login.user.id,
                    },
                    expires: 1000 * 3600,
                });

                setUserId(authData.data.login.user.id);

                storage.load<UserInfos>({
                    key: 'userInfos',
                })
            }
        }).catch(err => {
            console.error(err)
            setUserId("0")
        }).finally(() => setIsLoading(false));
    }

    return (
        <ScrollView className='flex-1 h-max w-max bg-white'>
            <View className='h-16 W-max'></View>
            <View className="flex-1 flex items-center justify-center px-7">
                <TouchableOpacity onPress={() => {
                    storage.save({
                        key: 'userInfos',
                        data: {
                            jwt: undefined,
                            userId: 11,
                        },
                        expires: 1000 * 3600
                    }).then(() => {
                        storage.load<UserInfos>({
                            key: 'userInfos'
                        }).then(response => {
                            navigation.navigate('Home', {
                                userGeolocation: userGeolocation ? userGeolocation : {
                                    latitude: 78.23570781291714,
                                    longitude: 15.491400000982967
                                },
                                userID: response.userId,
                                userPhoto: undefined
                            })
                        })
                    })
                }}>
                    <Text className='text-base text-gray-400 pb-5'>Seja bem vindo</Text>
                </TouchableOpacity>

                <View className="w-full">
                    <Controller
                        name='identifier'
                        control={control}
                        render={({ field: { onChange } }) => (
                            <TextInput
                                className="h-14 text-base"
                                keyboardType='email-address'
                                onChangeText={onChange}
                                outlineColor='#DCDCDC'
                                mode='outlined'
                                label={<Text style={{ color: '#DCDCDC' }}>Email</Text>}
                                left={
                                    <TextInput.Icon
                                        icon={'account-outline'}
                                        color="#DCDCDC"
                                        style={{ marginTop: 15 }}
                                    />}
                                theme={{
                                    colors: {
                                        placeholder: '#DCDCDC',
                                        primary: '#DCDCDC',
                                        text: '#DCDCDC',
                                        background: 'white'
                                    }
                                }}
                            />
                        )}
                    />
                    {errors.identifier && <Text className='text-red-400 text-sm'>{errors.identifier.message}</Text>}
                    <Controller
                        name='password'
                        control={control}
                        render={({ field: { onChange } }) => (
                            <TextInput
                                className="h-14 text-base"
                                secureTextEntry={!showPassword}
                                onChangeText={onChange}
                                mode='outlined'
                                outlineColor='#DCDCDC'
                                label={<Text style={{ color: '#DCDCDC' }}>******</Text>}
                                left={
                                    <TextInput.Icon
                                        icon={'lock-outline'}
                                        color="#DCDCDC"
                                        style={{ marginTop: 15 }}
                                    />}
                                right={
                                    <TextInput.Icon
                                        icon={!showPassword ? 'eye-off-outline' : 'eye-outline'}
                                        color="#DCDCDC"
                                        style={{ marginTop: 15 }}
                                        onPress={handleShowPassword}
                                    />
                                }
                                theme={{
                                    colors: {
                                        placeholder: '#DCDCDC',
                                        primary: '#DCDCDC',
                                        text: '#DCDCDC',
                                        background: 'white'
                                    }
                                }}
                            />
                        )}
                    />
                    {errors.password && <Text className='text-red-400 text-sm'>{errors.password.message}</Text>}
                    <View className='flex items-end pt-4 pb-10'>
                        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                            <Text className='text-gray-400 text-base'>esqueceu a senha?</Text>
                        </TouchableOpacity>
                    </View>
                    <View className='h-11 pt-4'>

                        <TouchableOpacity
                            className='h-14 w-81 rounded-md bg-orange-500 flex items-center justify-center'
                            onPress={handleSubmit(handleLogin)}>
                            <Text className='text-gray-50'>{isLoading ? <ActivityIndicator size='small' color='#F5620F' /> : 'Entrar'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View className='flex-row  items-center justify-center pt-11'>
                        <Text className='text-base text-gray-400'>Ainda não tem uma conta?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('ChooseUserType')}>
                            <Text className='text-orange-500 text-base'>Clique aqui</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView >
    );
}
