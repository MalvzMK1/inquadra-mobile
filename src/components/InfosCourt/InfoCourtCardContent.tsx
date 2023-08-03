import {Text, View} from "react-native";
import {ReactNode} from "react";

interface InfoCourtCardContentProps {
	lastScheduling?: Date
	hasDisponibility?: boolean
	children: ReactNode
}

function formatHour(date: Date): string {
	return [
		date.getHours(),
		date.getMinutes()
	].join(':');
}

export function InfoCourtCardContent({children, lastScheduling, hasDisponibility}: InfoCourtCardContentProps) {
	let formatedDate = '';
	let formatedHour = '';
	if (lastScheduling) {
		formatedDate = lastScheduling.toLocaleDateString('pt-BR', {
			hour12: false
		})
		formatedHour = formatHour(lastScheduling)
	}
	return(
		<View className='flex-1 flex flex-col justify-between'>
			<View className='w-full flex-1'>
				{children}
			</View>
			{lastScheduling ?
				<Text className='text-white text-xs font-bold mt-2'>Última reserva {formatedDate} às {formatedHour}</Text> :
				null
			}
			{hasDisponibility ?
				<Text className='text-white text-xs font-bold mt-2'>Tem horários disponíveis</Text> :
				null
			}
		</View>
	)
}