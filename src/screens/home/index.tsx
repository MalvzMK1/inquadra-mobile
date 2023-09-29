import { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import FilterComponent from '../../components/FilterComponent';
import { View, TouchableOpacity, ActivityIndicator, Text, Alert } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { BottomNavigationBar } from '../../components/BottomNavigationBar';
import HomeBar from '../../components/BarHome';
import SportsMenu from '../../components/SportsMenu';
import CourtBallon from '../../components/CourtBalloon';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useGetUserById } from "../../hooks/useUserById";
import { HOST_API } from '@env';
import useEstablishmentCardInformations from "../../hooks/useEstablishmentCardInformations";
import { calculateDistance } from '../../utils/calculateDistance';
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useSportTypes } from '../../hooks/useSportTypesFixed';
import customMapStyle from '../../utils/customMapStyle';
import storage from '../../utils/storage';
import BottomBlackMenu from '../../components/BottomBlackMenu';

interface Props extends NativeStackScreenProps<RootStackParamList, 'Home'> {
    menuBurguer: boolean;
}

interface EstablishmentObject {
    id: string,
    latitude: number,
    longitude: number,
    name: string,
    type: string,
    image: string,
    distance: number,
}

export default function Home({ menuBurguer, route, navigation }: Props) {
    const [userGeolocation, setUserGeolocation] = useState<{ latitude: number, longitude: number }>()
    const [userId, setUserId] = useState("")
    const pointerMap = require('../../assets/pointerMap.png');
    useEffect(() => {
        storage.load<{ latitude: number, longitude: number }>({
            key: 'userGeolocation'
        }).then(data => setUserGeolocation(data))

        storage.load<UserInfos>({
            key: 'userInfos'
        }).then(data => {
            setUserId(data.userId)
        })
    }, [])

    const { data, loading, error } = useEstablishmentCardInformations()
    const { data: userHookData, loading: userHookLoading, error: userHookError } = useGetUserById(route?.params?.userID)

    const [establishments, setEstablishments] = useState<Array<{
        id: string,
        latitude: number,
        longitude: number,
        name: string,
        type: string,
        image: string,
        distance: number,
    }>>([]);
    const [sportTypes, setSportTypes] = useState<Array<SportType>>([]);
    const [sportSelected, setSportSelected] = useState<string>()
    const { data: availableSportTypes, loading: availableSportTypesLoading, error: availableSportTypesError } = useSportTypes()

    const HandleSportSelected = (nameSport: string) => {
        setSportSelected(nameSport)
    }

    useEffect(() => {
        if (menuBurguer)
            setIsDisabled(false)
    }, [menuBurguer])

    useFocusEffect(
        React.useCallback(() => {
            setEstablishments([]);
            if (!error && !loading) {
                const newEstablishments = data?.establishments.data
                    .filter(establishment => (
                        establishment?.attributes?.photos.data &&
                        establishment?.attributes?.photos.data.length > 0 &&
                        establishment?.attributes?.courts.data
                    ))
                    .map((establishment => {
                        let establishmentObject: EstablishmentObject;

                        let courtTypes = establishment?.attributes?.courts.data!
                            .filter(court => court?.attributes?.court_types.data.length > 0)
                            .map(court => court?.attributes?.court_types.data)
                            .map(courtType => courtType.map(type => type?.attributes?.name))

                        if (!courtTypes) courtTypes = []

                        if (userGeolocation) {
                            establishmentObject = {
                                id: establishment.id,
                                name: establishment?.attributes?.corporateName,
                                latitude: Number(establishment?.attributes?.address.latitude),
                                longitude: Number(establishment?.attributes?.address.longitude),
                                distance: calculateDistance(
                                    userGeolocation.latitude,
                                    userGeolocation.longitude,
                                    Number(establishment?.attributes?.address.latitude),
                                    Number(establishment?.attributes?.address.longitude)
                                ) / 1000,
                                image: HOST_API + establishment?.attributes?.logo?.data?.attributes?.url,
                                type: courtTypes.length > 0 ? courtTypes.join(' & ') : '',
                            }
                        }

                        return establishmentObject
                    }));

                if (newEstablishments) {
                    setEstablishments(newEstablishments);
                }

                navigation.setParams({
                    userPhoto: userHookData?.usersPermissionsUser?.data?.attributes?.photo?.data?.attributes?.url ?? ""
                });
            }
        }, [data, loading, userHookLoading, userHookData, error])
    );
    const [isDisabled, setIsDisabled] = useState<boolean>(true);

    useEffect(() => {
        const newAvailableSportTypes: SportType[] = [];

        availableSportTypes?.courtTypes.data.forEach(courtType => {
            const sportAlreadyAdded = newAvailableSportTypes.some(sport => sport.id === courtType.id);

            if (!sportAlreadyAdded) {
                newAvailableSportTypes.push({ id: courtType.id, name: courtType?.attributes?.name });
            }
        });

        setSportTypes(newAvailableSportTypes);
    }, [availableSportTypes, availableSportTypesError]);

    return (
        <View className="flex-1 flex flex-col justify-center items-center">
            {
                availableSportTypesLoading ? <ActivityIndicator size='small' color='#FF6112' /> :
                    isDisabled && !menuBurguer && <SportsMenu sports={sportTypes} callBack={HandleSportSelected} sportSelected={sportSelected} />
            }

            <View className='flex-1'>

                {userGeolocation && (
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        loadingEnabled
                        className='w-screen flex-1'
                        onPress={() => setIsDisabled(false)}
                        customMapStyle={customMapStyle}
                        showsCompass={false}
                        showsMyLocationButton
                        showsUserLocation
                        initialRegion={{
                            latitude: userGeolocation.latitude,
                            longitude: userGeolocation.longitude,
                            latitudeDelta: 0.004,
                            longitudeDelta: 0.004,
                        }}
                    >
                        {
                            establishments.filter(item => { return item.distance <= 5 }).filter(item => {
                                if (sportSelected) {
                                    return item.type.split(" & ").includes(sportSelected)
                                } else {
                                    return true
                                }
                            }).map((item) => (
                                <Marker
                                    coordinate={{
                                        latitude: item.latitude,
                                        longitude: item.longitude,
                                    }}
                                    icon={pointerMap}
                                    title={item.name}
                                    description={item.name}
                                >
                                    <Callout key={item.id} tooltip onPress={() => navigation.navigate('EstablishmentInfo', {
                                        establishmentId: item.id,
                                        userId: userId,
                                        userPhoto: undefined
                                    })}>
                                        <CourtBallon
                                            id={item.id}
                                            key={item.id}
                                            name={item.name}
                                            distance={item.distance}
                                            image={item.image}
                                            type={item.type}
                                            userId={route?.params?.userID ?? ""}
                                            liked={true}
                                        />
                                    </Callout>
                                </Marker>
                            ))
                        }
                    </MapView>
                )}

                {!isDisabled && (
                    <TouchableOpacity className={`absolute left-3 top-3`} onPress={() => setIsDisabled((prevState) => !prevState)}>
                        <AntDesign name="left" size={30} color="black" />
                    </TouchableOpacity>
                )}
                {menuBurguer && <FilterComponent />}
            </View>

            {
                isDisabled && !menuBurguer && <HomeBar
                    chosenType={sportSelected}
                    courts={establishments}
                    userName={userHookData?.usersPermissionsUser?.data?.attributes?.username}
                    HandleSportSelected={HandleSportSelected}
                />
            }

            <View className={`absolute bottom-0 left-0 right-0`}>
                <BottomBlackMenu
                    screen="Home"
                    userID={route?.params?.userID}
                    userPhoto={userHookData?.usersPermissionsUser?.data?.attributes?.photo?.data?.attributes?.url ? HOST_API + userHookData.usersPermissionsUser.data.attributes.photo.data?.attributes.url : ''}
                    key={1}
                    isDisabled={!isDisabled}
                    paddingTop={2}
                />
            </View>

        </View>
    );
}