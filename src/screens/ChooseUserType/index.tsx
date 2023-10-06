import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ImageBackground, TouchableOpacity, View } from "react-native";
import { UserTypeCard } from "../../components/UserTypeCard";

export default function ChooseUserType() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../../assets/football_field.jpg")}
      className="flex-1 bg-football-field flex flex-col pt-12 px-3"
    >
      <TouchableOpacity onPress={navigation.goBack}>
        <AntDesign
          size={24}
          color="white"
          name="arrowleft"
          className="pl-2 pt-2"
        />
      </TouchableOpacity>

      <View className="h-[90%] w-full flex flex-col items-center justify-around">
        <UserTypeCard
          flow="normal"
          title="Jogador InQuadra"
          pageNavigation="Register"
          image={require("../../assets/player_inquadra.png")}
          subtitle="Jogue seus esportes favoritos em quadras por todo o Brasil"
        />

        <UserTypeCard
          flow="establishment"
          title="Parceiro InQuadra"
          pageNavigation="RegisterEstablishmentProfile"
          image={require("../../assets/partner_inquadra.png")}
          subtitle="Anuncie suas quadras e facilite a gestão do seu negócio"
        />
      </View>
    </ImageBackground>
  );
}
