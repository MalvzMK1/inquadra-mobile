import { ScrollView, TouchableOpacity } from 'react-native';
import SportItem from '../SportItem';
import { useState } from 'react';
const iconFutebol = require('./icons/iconFutebol.png');
const iconVoley = require('./icons/iconVoley.png');
const iconBasquete = require('./icons/iconBasquete.png');
const iconBTennis = require('./icons/iconBTennis.png');
const iconTennis = require('./icons/iconTennis.png');
const iconFVoley = require('./icons/iconFVoley.png');
const activeIconFutebol = require('./icons/activeIconFutebol.png');
const activeIconVoley = require('./icons/activeIconVoley.png');
const activeIconBasquete = require('./icons/activeIconBasquete.png');
const activeIconBTennis = require('./icons/activeIconBTennis.png');
const activeIconTennis = require('./icons/activeIconTennis.png');
const activeIconFVoley = require('./icons/activeIconFVoley.png');
import Animated, {
	FadeOut,
	FadeIn
} from 'react-native-reanimated';
import {NativeStackNavigatorProps} from "react-native-screens/lib/typescript/native-stack/types";

const arrayIcons = [
	{
		id: 1,
		name: "Futebol",
		image: iconFutebol,
		activeImage: activeIconFutebol
	},
	{
		id: 2,
		name: "Beach Tennis",
		image: iconBTennis,
		activeImage: activeIconBTennis
	},
	{
		id: 3,
		name: "Futsal",
		image: iconFutebol,
		activeImage: activeIconFutebol
	},
	{
		id: 4,
		name: "Volei",
		image: iconVoley,
		activeImage: activeIconVoley
	},
	{
		id: 5,
		name: "Footvolley",
		image: iconFVoley,
		activeImage: activeIconFVoley
	},
	{
		id: 6,
		name: "Tenis",
		image: iconTennis,
		activeImage: activeIconTennis
	},
	{
		id: 7,
		name: "Basquete",
		image: iconBasquete,
		activeImage: activeIconBasquete
	},
]

interface ISportsMenuProps {
	sports: SportType[]
}

export default function SportsMenu({sports}: ISportsMenuProps) {

	const [selected, setSelected] = useState<string>()
	
	return (
		<Animated.View entering={FadeIn.duration(500)} exiting={FadeOut.duration(500)} className={`flex w-full justify-center items-center h-[8%] `}>
			<ScrollView horizontal={true}>
				{
					sports.map((item) => (
						<TouchableOpacity className='justify-center' onPress={() => setSelected(item.id)}>
							{selected !== item.id ? (
								<SportItem key={item.id} id={item.id} name={item.name} image={arrayIcons[0].image} />
							) : (
								<SportItem key={item.id} id={item.id} name={item.name} image={arrayIcons[0].activeImage} />
							)}
						</TouchableOpacity>
					))
				}
			</ScrollView>
		</Animated.View>
	)
}