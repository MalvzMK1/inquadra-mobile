import {Text, View} from "react-native";
import {ReactNode} from "react";

interface InfoEstablishmentCardContentProps {
	children: ReactNode
}

export function InfoEstablishmentCardContent({children}: InfoEstablishmentCardContentProps) {
	return(
		<View className='flex-1 flex flex-col justify-between'>
			<View className='w-full flex-1'>
				{children}
			</View>
		</View>
	)
}