import { View, Text } from "react-native"
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type CourtSchedulingContainerT = {
    date: string
    children: JSX.Element
}

export default function CourtSchedulingContainer(props: CourtSchedulingContainerT) {
    const date = new Date(props.date)

    const formattedDayMonth = format(date, 'dd-MM').replace("-", "/")
    const formattedWeekday = format(date, 'eeee', { locale: ptBR }).split("-")[0]
    const capitalize = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    return (
        <View className="h-fit w-full flex flex-col mb-[10px]">
            <Text className="font-normal text-[14px] text-[#292929] opacity-50 mb-[10px]">{capitalize(formattedWeekday)} {formattedDayMonth}</Text>

            {props.children}

        </View>
    )
}