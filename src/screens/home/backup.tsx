import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Platform, ScrollView, TouchableOpacity, View } from "react-native";
import { Text, TextInput } from "react-native-paper";
import useAllEstablishments from "../../hooks/useGetEstablishmentByCorporateName";
import { useUser } from "../../context/userContext";
import { APP_DEBUG_VERBOSE, HOST_API } from "@env";

export function Backup() {
    const [establishmentsInfos, setEstablishmentsInfos] = useState<
        Array<{
            establishmentsId: string;
            corporateName: string;
        }>
    >([]);
    const [corporateName, setCorporateName] = useState<string>("");
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const navigation = useNavigation()
    const { data: allEstablishments } = useAllEstablishments();
    const [isUserInfosLoading, setIsUserInfosLoading] = useState<boolean>(
        false,
    );
    const { userData } = useUser();
    const [userGeolocation, setUserGeolocation] = useState<{
        latitude: number;
        longitude: number;
    }>();

    useEffect(() => {
        if (corporateName === "") setEstablishmentsInfos([]);
        else if (allEstablishments) {
            const establishments = allEstablishments.establishments.data.map(
                (establishment: { id: any; attributes: { corporateName: any } }) => {
                    return {
                        establishmentsId: establishment.id,
                        corporateName: establishment.attributes.corporateName,
                    };
                },
            );
            const filteredEstablishments = establishments.filter(
                (establishment: { corporateName: string }) => {
                    return establishment.corporateName
                        .toLowerCase()
                        .includes(corporateName.toLowerCase());
                },
            );
            setEstablishmentsInfos(filteredEstablishments);
        }
    }, [corporateName]);

    useEffect(() => {
        try {
            setIsUserInfosLoading(true);
            if (userData) {
                if (userData.id) {
                    setUserId(userData.id);
                } else {
                    //navigation.setParams({
                    //userPhoto: undefined,
                    //});
                }

                userData.geolocation && setUserGeolocation(userData.geolocation);
            } else {
                setUserId(undefined);
                //navigation.setParams({
                //userPhoto: undefined,
                //});
            }
        } catch (error) {
            if (APP_DEBUG_VERBOSE) alert(JSON.stringify(error, null, 2));
            console.error(JSON.stringify(error, null, 2));
        } finally {
            setIsUserInfosLoading(false);
        }
    }, [userData]);

    return (
        <View>
            {Platform.OS === "ios" ? (
                <View className="w-[63vw]">
                    <TextInput
                        theme={{ colors: { placeholder: "#e9e9e9" } }}
                        placeholder="O que você está procurando?"
                        underlineColorAndroid="transparent"
                        underlineColor="transparent"
                        className="bg-white rounded-2xl w-full flex h-[40px] mb-[0.5] placeholder:text-[#e9e9e9] text-sm outline-none"
                        right={<TextInput.Icon icon={"magnify"} />}
                        onChangeText={e => {
                            setCorporateName(e);
                        }}
                    />
                </View>
            ) : (
                <TextInput
                    theme={{ colors: { placeholder: "#e9e9e9" } }}
                    placeholder="O que você está procurando?"
                    underlineColorAndroid="transparent"
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    className="bg-white rounded-2xl flex-1 mx-3 flex items-center justify-center h-[50px] placeholder:text-[#e9e9e9] text-sm outline-none"
                    right={<TextInput.Icon icon={"magnify"} />}
                    onChangeText={e => {
                        setCorporateName(e);
                    }}
                />
            )}
            {establishmentsInfos && establishmentsInfos.length > 0 && (
                <View className="flex top-[30px] h-48 w-full">
                    <ScrollView>
                        {establishmentsInfos.map(item => {
                            return (
                                <TouchableOpacity
                                    key={item.establishmentsId}
                                    className="h-[35px] w-full bg-white justify-center border-b-2 border-neutral-300 pl-1"
                                    onPress={() => {
                                        //if (userId) 
                                        //{
                                        //navigation.navigate("EstablishmentInfo", {
                                        //establishmentId: item.establishmentsId,
                                        //userPhoto: userPicture,
                                        //});
                                        //setCorporateName("");
                                        //} else navigation.navigate("Login");
                                    }}
                                >
                                    <Text className="text-sm outline-none">
                                        {item.corporateName}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
            )}

        </View>
    )
}