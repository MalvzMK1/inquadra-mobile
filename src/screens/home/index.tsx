import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { View, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import { BottomNavigationBar } from '../../components/BottomNavigationBar';
import BarHome from '../../components/BarHome';
import SportsMenu from '../../components/SportsMenu';
import FilterComponent from '../../components/FilterComponent';

export default function Home() {

	const [isDisabled, setIsDisabled] = useState(true);

	return (
		<View className="flex-1 flex flex-col">
			{/* {
				isDisabled ? <SportsMenu /> : <></>
			} */}
			<View className='flex-1'>
				<FilterComponent/>
				<MapView
					className='w-screen h-screen flex'
					onPress={() => setIsDisabled(false)}
					showsCompass={false}
					initialRegion={{
						latitude: -23.550520,
						longitude: -46.633308,
						latitudeDelta: 0.004,
						longitudeDelta: 0.004,
					}}
				/>
				{
					!isDisabled ? 
					<TouchableOpacity className={`absolute left-3 top-3`} onPress={() => setIsDisabled((prevState) => !prevState)}>
						<AntDesign name="left" size={30} color="black" />
					</TouchableOpacity>
					:
					<></>
				}
			</View>
			{
				isDisabled ? <BarHome /> : <></>
			}
			<BottomNavigationBar isDisabled={isDisabled} />
		</View>
	);
}
