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
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 15,
        marginBottom: 5,
        borderRadius: 25,
        borderWidth: 1,
        backgroundColor:
          props.selectedTimes && props.selectedTimes.id === props.id
            ? "#ff7c36"
            : "transparent",
      }}
    >
      <Text style={{ fontSize: 15 }}>
        {props.startsAt} - {props.endsAt}
      </Text>
      <Text style={{ fontSize: 15 }}>{status}</Text>
    </TouchableOpacity>
  );
}
