import {TouchableOpacity, View} from "react-native";
import {useState} from "react";
import {CheckBox} from "react-native-elements";

interface ICaptchaCardProps {
	onChange: (checked: boolean) => void;
	checked: boolean;
}

export function CaptchaCard(props: ICaptchaCardProps) {
	const [checked, setIsChecked] = useState<boolean>(false);

	function handleCaptchaClick(): string {
		props.onChange(checked)
		return String(checked)
	}

	return (
		<View>
			<TouchableOpacity>
				<CheckBox
					checked={checked}
				/>
			</TouchableOpacity>
		</View>
	)
}