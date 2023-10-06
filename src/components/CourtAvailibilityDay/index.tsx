import { Image, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function CourtAvailibilityDay({
  day,
  isOpen,
  children,
  onToggleOpen,
}: CourtAvailibilityDay) {
  return (
    <View>
      <View className="w-full flex-row justify-between items-center border-b border-white p-[10px]">
        <Text className="text-white text-[12px] font-black leading-[18px]">
          {day}
        </Text>

        <TouchableOpacity onPress={onToggleOpen}>
          <Image
            source={
              isOpen
                ? require("../../assets/open_arrow.png")
                : require("../../assets/close_arrow.png")
            }
          />
        </TouchableOpacity>
      </View>

      {isOpen && children}
    </View>
  );
}
