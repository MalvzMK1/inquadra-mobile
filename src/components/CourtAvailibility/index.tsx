import { Text, TouchableOpacity, View } from "react-native";

type CourtAvailibility = {
  id: string;
  startsAt: string;
  endsAt: string;
  price?: number;
  busy: boolean;
  selectedTimes:
    | {
        id: string;
        value: number;
      }
    | null
    | undefined;
  toggleTimeSelection: Function;
};

export default function CourtAvailibility(props: CourtAvailibility) {
  let status = "";

  if (props.busy) {
    status = "OCUPADO";
  } else if (props.price) {
    status = `R$${props.price.toFixed(2).replace(".", ",")}`;
  }

  if (props.busy) {
    return (
      <View
        className={`flex flex-row h-fit w-max ${
          props.busy ? "" : "border"
        } rounded-[25px] p-[15px] mb-[5px] items-center justify-between ${
          props.busy ? "bg-[#D9D9D9]" : ""
        }`}
      >
        <Text
          className={`font-black text-[15px] ${
            props.busy ? "text-[#808080]" : ""
          }`}
        >
          {props.startsAt} - {props.endsAt}
        </Text>
        <Text
          className={`font-black text-[15px] ${
            props.busy ? "text-[#808080]" : ""
          }`}
        >
          OCUPADO
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={() => props.toggleTimeSelection(props.id, props.price)}
      className={`flex flex-row h-fit space-x-4 w-max border rounded-[25px] p-[15px] mb-[5px] items-center justify-between px-2${
        props.selectedTimes
          ? props.selectedTimes.id == props.id
            ? "bg-[#f3ffe4]"
            : ""
          : ""
      } `}
    >
      <Text className="font-black text-[15px]">
        {props.startsAt} - {props.endsAt}
      </Text>
      <Text className="font-black text-[15px]">{status}</Text>
    </TouchableOpacity>
  );
}
