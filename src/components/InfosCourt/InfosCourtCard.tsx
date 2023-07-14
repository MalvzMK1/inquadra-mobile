import {Image, ImageSourcePropType, Text, View} from "react-native";
import SvgUri from "react-native-svg-uri";

interface InfosCourtProps {
	imageUrl: ImageSourcePropType
	courtName: string
	courtType: string
	distance: string
	lastScheduling: Date
}

function formatHour(date: Date): string {
	return [
		date.getHours(),
		date.getMinutes()
	].join(':');
}

export function InfosCourtCard({imageUrl, courtName, courtType, lastScheduling, distance}: InfosCourtProps) {
	const formatedDate = lastScheduling.toLocaleDateString('pt-BR', {
		hour12: false
	})
	const formatedHour = formatHour(lastScheduling)
	return(
		<View className='w-full h-28 flex flex-row items-center justify-between gap-2 overflow-hidden'>
			<Image source={imageUrl} className='h-max w-34 rounded-md' />
			<View className='flex-1 flex-1 flex flex-col justify-between'>
				<View className='w-full flex-1'>
					<View className='w-full flex flex-row justify-between items-center'>
						<Text className='font-bold text-2xl text-orange-600'>{courtName}</Text>
						<SvgUri
							height={18}
							width={18}
							source={require('../../assets/filled-heart.svg')}
						/>
					</View>
					<Text className='text-white text-sm'>{courtType}</Text>
					<Text className='text-white text-sm font-bold'>{distance} de distancia</Text>
				</View>
				<Text className='text-white text-sm font-bold'>Última reserva {formatedDate} as {formatedHour}</Text>
			</View>
		</View>
	)
}
