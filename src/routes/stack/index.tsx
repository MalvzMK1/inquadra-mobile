import {HOST_API} from "@env";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {useEffect, useState} from "react";
import {Image, TouchableOpacity, View} from "react-native";
import {Text} from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import {useUser} from "../../context/userContext";
import useAllEstablishments from "../../hooks/useGetEstablishmentByCorporateName";
import AllVeryWell from "../../screens/AllVeryWell";
import CourtDetails from "../../screens/AllVeryWell/CourtDetails";
import editCourt from "../../screens/AllVeryWell/CourtDetails/editCourt";
import CancelScheduling from "../../screens/CancelScheduling";
import ChooseUserType from "../../screens/ChooseUserType/";
import CompletedEstablishmentRegistration from "../../screens/CompletedEstablishmentRegistration";
import CourtAvailabilityInfo from "../../screens/CourtAvailabilityInfo";
import CourtPriceHour from "../../screens/CourtPriceHour";
import CourtSchedule from "../../screens/CourtSchedule";
import EditCourt from "../../screens/EditCourt";
import EstablishmentInfo from "../../screens/EstablishmentInfo";
import FavoriteEstablishments from "../../screens/FavoriteEstablishments";
import FinancialEstablishment from "../../screens/FinancialEstablishment";
import AmountAvailableWithdrawal from "../../screens/FinancialEstablishment/Client/AmountAvailableWithdrawal";
import DetailsAmountReceivable from "../../screens/FinancialEstablishment/Client/DetailsAmountReceivable";
import HistoryPayment from "../../screens/FinancialEstablishment/Client/HistoryPayment";
import WithdrawScreen from "../../screens/FinancialEstablishment/Client/WithdrawalScreen";
import ForgotPassword from "../../screens/ForgotPassword";
import {InsertResetCode} from "../../screens/ForgotPassword/insertResetCode";
import {SetNewPassword} from "../../screens/ForgotPassword/setNewPassword";
import HomeEstablishment from "../../screens/HomeEstablishment";
import InfoReserva from "../../screens/InfoReserva";
import DescriptionInvited from "../../screens/InfoReserva/descriptionInvited";
import DescriptionReserve from "../../screens/InfoReserva/descriptionReserve";
import Login from "../../screens/Login";
import PixScreen from "../../screens/Pix";
import registerEstablishmentProfile from "../../screens/ProfileEstablishmentRegistration";
import InfoProfileEstablishment from "../../screens/ProfileEstablishmentRegistration/Client/InfoProfileEstablishment";
import DeleteAccountEstablishment from "../../screens/ProfileEstablishmentRegistration/Client/deleteAccount";
import ProfileSettings from "../../screens/ProfileSettings";
import DeleteAccountSuccess from "../../screens/ProfileSettings/client/deleteAccount";
import Register from "../../screens/Register/Client";
import Password from "../../screens/Register/Client/password";
import RegisterSuccess from "../../screens/Register/Client/success";
import RegisterEstablishment from "../../screens/Register/Establishment";
import TermsOfService from "../../screens/Register/termsOfService";
import RegisterCourt from "../../screens/RegisterCourt";
import RegisterNewCourt from "../../screens/RegisterCourt/Client/newCourt";
import RegisterNewCourtAdded from "../../screens/RegisterCourt/newCourtAdded";
import ReservationPaymentSign from "../../screens/ReservationPaymentSign";
import Schedulings from "../../screens/Schedulings";
import UpdateSchedule from "../../screens/UpdateSchedule";
import PaymentScheduleUpdate from "../../screens/UpdateSchedule/updateSchedule";
import Home from "../../screens/home";

const { Navigator, Screen } = createStackNavigator<RootStackParamList>();

export default function () {
  const { userData } = useUser();
  const [menuBurguer, setMenuBurguer] = useState(false);
  const [corporateName, setCorporateName] = useState("");
  const { data: allEstablishments } = useAllEstablishments();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [EstablishmentsInfos, setEstablishmentsInfos] = useState<
    Array<{
      establishmentsId: string;
      corporateName: string;
    }>
  >([]);

  useEffect(() => {
    if (corporateName === "") setEstablishmentsInfos([]);
    else if (allEstablishments) {
      const establishments = allEstablishments.establishments.data.map(
        establishment => {
          return {
            establishmentsId: establishment.id,
            corporateName: establishment.attributes.corporateName,
          };
        },
      );

      const filteredEstablishments = establishments.filter(establishment => {
        return establishment.corporateName
          .toLowerCase()
          .includes(corporateName.toLowerCase());
      });
      setEstablishmentsInfos(filteredEstablishments);
    }
  }, [corporateName]);

  return (
    <Navigator>
      <Screen
        name="Home"
        options={({ route: { params } }) => ({
          headerShown: false,
        })}
      >
        {props => (
          <Home
            {...props}
            menuBurguer={menuBurguer}
            setMenuBurguer={setMenuBurguer}
          />
        )}
      </Screen>
      <Screen
        name="Login"
        component={Login}
        options={{
          headerTitle: () => (
            <Image source={require("../../assets/inquadra_logo.png")} />
          ),
          headerTitleAlign: "center",
          headerStyle: {
            height: 200,
            backgroundColor: "#292929",
          },
          headerLeft: () => <></>,
        }}
      />
      <Screen
        name="InfoProfileEstablishment"
        component={InfoProfileEstablishment}
        options={({ route: { params } }) => ({
          headerTintColor: "white",
          headerStyle: {
            height: 125,
            backgroundColor: "#292929",
          },
          headerTitleAlign: "center",
          headerTitle: () => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 18, fontWeight: "900" }}>
                PERFIL
              </Text>
            </View>
          ),
          headerRight: () => {
            return (
              <TouchableOpacity className="w-12 h-12 bg-gray-500 mr-3 rounded-full overflow-hidden">
                <Image
                  source={
                    params.establishmentPhoto
                      ? { uri: HOST_API + params.establishmentPhoto }
                      : require("../../assets/default-user-image.png")
                  }
                  className="w-full h-full"
                />
              </TouchableOpacity>
            );
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={25} color="white" />
            </TouchableOpacity>
          ),
        })}
      />
      <Screen
        name="ChooseUserType"
        component={ChooseUserType}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="TermsOfService"
        component={TermsOfService}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="HomeEstablishment"
        component={HomeEstablishment}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="UpdateSchedule"
        component={UpdateSchedule}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="EditCourt"
        component={EditCourt}
        options={({ route: { params } }) => ({
          headerTintColor: "white",
          headerStyle: {
            height: 125,
            backgroundColor: "#292929",
          },
          headerTitleAlign: "center",
          headerTitle: () => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 18, fontWeight: "900" }}>
                QUADRAS
              </Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity style={{ paddingRight: 10 }}>
              <Image
                source={
                  params.userPhoto
                    ? { uri: `${HOST_API}${params.userPhoto}` }
                    : require("../../assets/default-user-image.png")
                }
                style={{ width: 30, height: 30, borderRadius: 15 }}
              />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={navigation.goBack} className="ml-4">
              <Icon name="arrow-back" size={25} color="white" />
            </TouchableOpacity>
          ),
        })}
      />
      <Screen
        name="CancelScheduling"
        component={CancelScheduling}
        options={{
          headerTintColor: "white",
          headerStyle: {
            height: 80,
            backgroundColor: "#292929",
          },
          headerTitleAlign: "center",
          headerTitle: () => (
            <View className="flex-1 justify-center items-center">
              <Text className="text-white text-[18px] font-black">
                Reservas
              </Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity className="pr-[10px]">
              <Image
                source={require("../../assets/court_image.png")}
                className="w-[30px] h-[30px] rounded-[15px]"
              />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={25} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <Screen
        name="Schedulings"
        component={Schedulings}
        options={({ route: { params } }) => ({
          headerTintColor: "white",
          headerStyle: {
            height: 80,
            backgroundColor: "#292929",
          },
          headerTitleAlign: "center",
          headerTitle: () => (
            <View className="flex-1 justify-center items-center">
              <Text className="text-white text-[18px] font-black">
                Reservas
              </Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              className="w-12 h-12 bg-gray-500 mr-3 rounded-full overflow-hidden"
              onPress={() =>
                navigation.navigate("InfoProfileEstablishment", {
                  establishmentId: params.establishmentId,
                  establishmentPhoto:
                    HOST_API + params.establishmentPhoto ?? "",
                })
              }
            >
              <Image
                source={
                  params.establishmentPhoto
                    ? { uri: HOST_API + params.establishmentPhoto }
                    : require("../../assets/default-user-image.png")
                }
                className="w-full h-full"
              />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={25} color="white" />
            </TouchableOpacity>
          ),
        })}
      />
      <Screen
        name="CourtSchedule"
        component={CourtSchedule}
        options={({ route: { params } }) => ({
          headerTintColor: "white",
          headerStyle: {
            height: 125,
            backgroundColor: "#292929",
          },
          headerTitleAlign: "center",
          headerTitle: () => (
            <View className="flex-1 justify-center items-center">
              <Text className="text-white text-[18px] font-black">AGENDA</Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              className="w-12 h-12 bg-gray-500 mr-3 rounded-full overflow-hidden"
              onPress={() =>
                navigation.navigate("InfoProfileEstablishment", {
                  establishmentId: params.establishmentId,
                  establishmentPhoto:
                    HOST_API + params.establishmentPhoto ?? "",
                })
              }
            >
              <Image
                source={
                  params.establishmentPhoto
                    ? { uri: `${HOST_API}${params.establishmentPhoto}` }
                    : require("../../assets/default-user-image.png")
                }
                className="w-full h-full"
              />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={25} color="white" />
            </TouchableOpacity>
          ),
        })}
      />
      <Screen
        name="RegisterEstablishmentProfile"
        component={registerEstablishmentProfile}
        options={{
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={25} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Screen
        name="PixScreen"
        component={PixScreen}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="Register"
        component={Register}
        options={{
          title: "",
          headerLeft: () => (
            <TouchableOpacity className="ml-4" onPress={navigation.goBack}>
              <Icon name="arrow-back" size={25} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Screen
        name="RegisterNewCourt"
        component={RegisterNewCourt}
        options={{
          headerTitle: "",
        }}
      />
      <Screen
        name="RegisterNewCourtAdded"
        component={RegisterNewCourtAdded}
        options={{
          headerTitle: "",
        }}
      />
      <Screen
        name="EstablishmentRegister"
        component={RegisterEstablishment}
        options={{
          title: "",
          headerLeft: () => (
            <TouchableOpacity className="ml-4" onPress={navigation.goBack}>
              <Icon name="arrow-back" size={25} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Screen
        name="RegisterCourts"
        component={RegisterCourt}
        options={{
          title: "",
          headerLeft: () => (
            <TouchableOpacity className="ml-4" onPress={navigation.goBack}>
              <Icon name="arrow-back" size={25} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Screen
        name="AllVeryWell"
        component={AllVeryWell}
        options={{
          title: "",
          headerLeft: () => (
            <TouchableOpacity className="ml-4" onPress={navigation.goBack}>
              <Icon name="arrow-back" size={25} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Screen
        name="CourtDetails"
        component={CourtDetails}
        options={{
          title: "",
          headerLeft: () => (
            <TouchableOpacity className="ml-4" onPress={navigation.goBack}>
              <Icon name="arrow-back" size={25} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Screen
        name="PaymentScheduleUpdate"
        component={PaymentScheduleUpdate}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="CompletedEstablishmentRegistration"
        component={CompletedEstablishmentRegistration}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="HomeVariant"
        options={({ route: { params } }) => ({
          headerTitleStyle: {
            fontSize: 26,
          },
          headerTitleAlign: "center",
          headerTintColor: "white",
          headerStyle: {
            height: 125,
            backgroundColor: "#292929",
          },
          headerLeftContainerStyle: {
            marginLeft: 12,
          },
          headerRight: () => (
            <TouchableOpacity
              className="w-12 h-12 bg-gray-500 mr-3 rounded-full overflow-hidden"
              onPress={() => {
                navigation.navigate("ProfileSettings", {
                  userPhoto: params.userPhoto,
                });
              }}
            >
              <Image
                source={
                  params.userPhoto
                    ? { uri: `${HOST_API}${params.userPhoto}` }
                    : require("../../assets/default-user-image.png")
                }
                className="w-full h-full"
              />
            </TouchableOpacity>
          ),
        })}
      >
        {props => <Home {...props} menuBurguer={menuBurguer} />}
      </Screen>
      <Screen
        name="AmountAvailableWithdrawal"
        component={AmountAvailableWithdrawal}
        options={({ route: { params } }) => ({
          headerTitleAlign: "center",
          headerTitle: "Detalhes",
          headerTintColor: "white",
          headerStyle: {
            height: 125,
            backgroundColor: "#292929",
          },
          headerLeftContainerStyle: {
            marginLeft: 10,
          },
          headerRight: () => (
            <TouchableOpacity
              className="w-12 h-12 bg-gray-500 mr-3 rounded-full overflow-hidden"
              onPress={() =>
                navigation.navigate("InfoProfileEstablishment", {
                  establishmentId: params.establishmentId,
                  establishmentPhoto: HOST_API + params.logo ?? "",
                })
              }
            >
              <Image
                source={
                  params?.logo
                    ? { uri: `${HOST_API}${params?.logo}` }
                    : require("../../assets/default-user-image.png")
                }
                className="w-full h-full"
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Screen
        name="RegisterPassword"
        component={Password}
        options={{
          title: "",
          headerLeft: () => (
            <TouchableOpacity className="ml-4" onPress={navigation.goBack}>
              <Icon name="arrow-back" size={25} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Screen
        name="DeleteAccountSuccess"
        component={DeleteAccountSuccess}
        options={{
          headerTintColor: "white",
          headerStyle: {
            height: 100,
            backgroundColor: "#292929",
          },
          headerTitleAlign: "center",
          headerTitle: () => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 18, fontWeight: "900" }}>
                PERFIL
              </Text>
            </View>
          ),
        }}
      />
      <Screen
        name="InfoReserva"
        component={InfoReserva}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="DescriptionReserve"
        component={DescriptionReserve}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="DescriptionInvited"
        component={DescriptionInvited}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="editCourt"
        component={editCourt}
        options={{
          headerShown: false,
        }}
      />

      <Screen
        name="RegisterSuccess"
        component={RegisterSuccess}
        options={{
          title: "",
          headerTransparent: true,
          headerShown: false,
        }}
      />
      <Screen
        name="FavoriteEstablishments"
        component={FavoriteEstablishments}
        options={({ route: { params } }) => ({
          headerTitle: "FAVORITOS",
          headerTitleStyle: {
            fontSize: 26,
          },
          headerTitleAlign: "center",
          headerTintColor: "white",
          headerStyle: {
            height: 125,
            backgroundColor: "#292929",
          },
          headerLeftContainerStyle: {
            marginLeft: 12,
          },
          headerRight: () => (
            <TouchableOpacity
              className="w-12 h-12 bg-gray-500 mr-3 rounded-full overflow-hidden"
              onPress={() => {
                if (params && userData?.id) {
                  navigation.navigate("ProfileSettings", {
                    userPhoto: params.userPhoto,
                  });
                } else navigation.navigate("Login");
              }}
            >
              <Image
                source={
                  params.userPhoto
                    ? { uri: `${params.userPhoto}` }
                    : require("../../assets/default-user-image.png")
                }
                className="w-full h-full"
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Screen
        name="ProfileSettings"
        component={ProfileSettings}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="EstablishmentInfo"
        options={({ route: { params } }) => ({
          headerTintColor: "white",
          headerStyle: {
            height: 125,
            backgroundColor: "#292929",
          },
          headerTitleAlign: "center",
          headerTitle: () => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 18, fontWeight: "900" }}>
                ESTABELECIMENTO
              </Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              className="w-12 h-12 bg-gray-500 mr-3 rounded-full overflow-hidden py-3"
              onPress={() => {
                if (userData?.id !== undefined && userData?.id !== null)
                  navigation.navigate("ProfileSettings", {
                    userPhoto: params.userPhoto,
                  });
                else navigation.navigate("Login");
              }}
            >
              <Image
                source={
                  params?.userPhoto
                    ? { uri: `${HOST_API}${params.userPhoto}` }
                    : require("../../assets/default-user-image.png")
                }
                className="w-full h-full"
              />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="ml-4"
            >
              <Icon name="arrow-back" size={25} color="white" />
            </TouchableOpacity>
          ),
        })}
      >
        {props => <EstablishmentInfo {...props} />}
      </Screen>
      <Screen
        name="ReservationPaymentSign"
        component={ReservationPaymentSign}
        options={({ route: { params } }) => ({
          headerTintColor: "white",
          headerStyle: {
            height: 100,
            backgroundColor: "#292929",
          },
          headerTitleAlign: "center",
          headerTitle: () => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                className="py-5"
                style={{ color: "white", fontSize: 18, fontWeight: "900" }}
              >
                SINAL
              </Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              className="w-12 h-12 bg-gray-500 mr-3 rounded-full overflow-hidden"
              onPress={() =>
                navigation.navigate("ProfileSettings", {
                  userPhoto: params.userPhoto,
                })
              }
            >
              <Image
                source={
                  params?.userPhoto
                    ? { uri: `${HOST_API}${params.userPhoto}` }
                    : require("../../assets/default-user-image.png")
                }
                className="w-full h-full"
              />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={navigation.goBack} className="ml-4">
              <Icon name="arrow-back" size={25} color="white" />
            </TouchableOpacity>
          ),
        })}
      />
      <Screen
        name="CompletedEstablishmentResgistration"
        component={CompletedEstablishmentRegistration}
        options={{
          headerTintColor: "white",
          headerStyle: {},
          headerTitleAlign: "center",
        }}
      />
      <Screen
        name="DeleteAccountEstablishment"
        component={DeleteAccountEstablishment}
        options={{
          headerTintColor: "white",
          headerStyle: {
            height: 100,
            backgroundColor: "#292929",
          },
          headerTitleAlign: "center",
          headerTitle: () => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 18, fontWeight: "900" }}>
                PERFIL
              </Text>
            </View>
          ),
        }}
      />
      <Screen
        name="FinancialEstablishment"
        component={FinancialEstablishment}
        options={({ route: { params } }) => ({
          headerTintColor: "white",
          headerStyle: {
            height: 125,
            backgroundColor: "#292929",
          },
          headerTitleAlign: "center",
          headerTitle: () => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 18, fontWeight: "900" }}>
                FINANCEIRO
              </Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              className="w-12 h-12 bg-gray-500 mr-3 rounded-full overflow-hidden"
              onPress={() =>
                navigation.navigate("InfoProfileEstablishment", {
                  establishmentId: params.establishmentId ?? "",
                  establishmentPhoto: HOST_API + params.logo ?? "",
                })
              }
            >
              <Image
                source={
                  params?.logo
                    ? { uri: HOST_API + params.logo }
                    : require("../../assets/default-user-image.png")
                }
                className="w-full h-full"
              />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="ml-4"
            >
              <Icon name="arrow-back" size={25} color="white" />
            </TouchableOpacity>
          ),
        })}
      />
      <Screen
        name="WithdrawScreen"
        component={WithdrawScreen}
        options={({ route: { params } }) => ({
          headerTintColor: "white",
          headerStyle: {
            height: 125,
            backgroundColor: "#292929",
          },
          headerTitleAlign: "center",
          headerTitle: () => (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 18, fontWeight: "900" }}>
                SAQUE
              </Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              className="w-12 h-12 bg-gray-500 mr-3 rounded-full overflow-hidden"
              onPress={() =>
                navigation.navigate("InfoProfileEstablishment", {
                  establishmentId: params.establishmentId,
                  establishmentPhoto: HOST_API + params.logo ?? "",
                })
              }
            >
              <Image
                source={
                  params?.logo
                    ? { uri: `${HOST_API}${params?.logo}` }
                    : require("../../assets/default-user-image.png")
                }
                className="w-full h-full"
              />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="ml-4"
            >
              <Icon name="arrow-back" size={25} color="white" />
            </TouchableOpacity>
          ),
        })}
      />
      <Screen
        name="DetailsAmountReceivable"
        component={DetailsAmountReceivable}
        options={({ route: { params } }) => ({
          headerTintColor: "white",
          headerStyle: {
            height: 100,
            backgroundColor: "#292929",
          },
          headerTitleAlign: "center",
          title: "Detalhes",
          headerRight: () => (
            <TouchableOpacity
              className="w-12 h-12 bg-gray-500 mr-3 rounded-full overflow-hidden"
              onPress={() =>
                navigation.navigate("InfoProfileEstablishment", {
                  establishmentId: params.establishmentId,
                  establishmentPhoto: HOST_API + params.logo ?? "",
                })
              }
            >
              <Image
                source={
                  params?.logo
                    ? { uri: `${HOST_API}${params?.logo}` }
                    : require("../../assets/default-user-image.png")
                }
                className="w-full h-full"
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Screen
        name="HistoryPayment"
        component={HistoryPayment}
        options={({ route: { params } }) => ({
          headerTintColor: "white",
          headerStyle: {
            height: 100,
            backgroundColor: "#292929",
          },
          headerTitleAlign: "center",
          title: "Histórico",
          headerRight: () => (
            <TouchableOpacity
              className="w-12 h-12 bg-gray-500 mr-3 rounded-full overflow-hidden"
              onPress={() =>
                navigation.navigate("InfoProfileEstablishment", {
                  establishmentId: params.establishmentId,
                  establishmentPhoto: HOST_API + params.logo ?? "",
                })
              }
            >
              <Image
                source={
                  params?.logo
                    ? { uri: `${HOST_API}${params?.logo}` }
                    : require("../../assets/default-user-image.png")
                }
                className="w-full h-full"
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Screen
        name="CourtPriceHour"
        component={CourtPriceHour}
        options={{
          headerShown: false,
          headerTitle: "Definir hora/valor",
          headerLeft: () => (
            <TouchableOpacity onPress={navigation.goBack} className="ml-4">
              <Icon name="arrow-back" size={25} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
      <Screen
        name="CourtAvailabilityInfo"
        component={CourtAvailabilityInfo}
        options={({ route: { params } }) => ({
          headerTintColor: "white",
          headerStyle: {
            height: 100,
            backgroundColor: "#292929",
          },
          headerTitleAlign: "center",
          headerTitle: () => (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 18, fontWeight: "900" }}>
                RESERVA
              </Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              className="w-12 h-12 bg-gray-500 mr-3 rounded-full overflow-hidden"
              onPress={() => {
                if (
                  userData?.id &&
                  userData?.id !== "0" &&
                  userData?.id !== ""
                ) {
                  navigation.navigate("ProfileSettings", {
                    userPhoto: params.userPhoto,
                  });
                } else {
                  navigation.navigate("Login");
                }
              }}
            >
              <Image
                source={
                  params?.userPhoto
                    ? { uri: `${HOST_API}${params.userPhoto}` }
                    : require("../../assets/default-user-image.png")
                }
                className="w-full h-full"
              />
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={navigation.goBack} className="ml-4">
              <Icon name="arrow-back" size={25} color="white" />
            </TouchableOpacity>
          ),
        })}
      />
      <Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="InsertResetCode"
        component={InsertResetCode}
        options={{
          headerShown: false,
        }}
      />
      <Screen
        name="SetNewPassword"
        component={SetNewPassword}
        options={{
          headerShown: false,
        }}
      />
    </Navigator>
  );
}
