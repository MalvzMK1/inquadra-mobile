import {Text, View} from "react-native";
// import SvgUri from "react-native-svg-uri";

interface InfoCourtCardContentRatingProps {
	rating: number
}

export function InfoCourtCardContentRating({rating}: InfoCourtCardContentRatingProps) {
	return(
		<View className='flex flex-row items-center'>
			<Text className='text-white text-xs font-bold'>Avaliação {rating.toString()}</Text>
			{/* <SvgUri
				height={10}
				width={10}
				source={require('../../assets/star.svg')}
			/> */}
		</View>
	)
}