import ProgressBar from 'react-native-progress/Bar'
import {Text, View} from "react-native";

interface InfoCourtCardContentPaymentProgressBarProps {
	progress: number
}

export function InfoCourtCardContentPaymentProgressBar({progress}: InfoCourtCardContentPaymentProgressBarProps) {
	return(
		<View className='w-full mt-1'>
			<View className='relative w-full'>
				<Text className='absolute z-10 self-center text-white font-bold'>R$ 170 / R$ 200</Text>
				<ProgressBar progress={progress / 100} width={null} height={20} borderRadius={5} color={'#0FA958'} unfilledColor={'#0FA95866'} />
			</View>
			<Text className='text-white text-xs font-bold mt-1'>Reserva feita em 00/00/00 as 12:00</Text>
		</View>
	)
}