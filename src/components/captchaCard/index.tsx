import {Image, View, Text} from "react-native";
import {useState} from "react";
import {CheckBox} from "react-native-elements";

interface ICaptchaCardProps {
	// onChange: (checked: boolean) => void;
	// checked: boolean;
}

export function CaptchaCard(props: ICaptchaCardProps) {
	const [checked, setIsChecked] = useState<boolean>(false);

	function handleCaptchaClick(): string {
		setIsChecked(!checked)
		// props.onChange(checked)
		return String(checked)
	}

	return (
		<View className='flex flex-row justify-center items-center h-fit w-fit bg-white px-4 py-2 dark:bg-white'>
			<View className='flex flex-row justify-center items-center gap-2 relative group bg-white dark:bg-white'>
				<CheckBox className='w-10 h-10 outline-none border-none z-10 opacity-100 bg-white' id='custom-checkbox' checked={checked} onPress={handleCaptchaClick}/>
				<View className='absolute w-10 h-10 left-0 top-0 bottom-0 border-[3px] border-solid border-zinc-400 rounded group-checked:bg-green-500 bg-white transition-all duration-300 ease-in-out' id='custom-checkbox-span'>
					<Image
						className='bg-white opacity-0 transition-all duration-500'
						source={{uri: 'https://cdn.icon-icons.com/icons2/2131/PNG/512/checkmark_apply_check_checked_icon_131551.png'}}
					/>
				</View>
				<Text className='text-xl text-zinc-400 bg-white'>Não sou um robô</Text>
			</View>
			<View className='flex flex-col'>
				<Image
					className='w-20 h-20 bg-white'
					source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/RecaptchaLogo.svg/2048px-RecaptchaLogo.svg.png'}}
				/>
			</View>
		</View>
	)
}

/*
*
* <div class="flex justify-center items-center h-fit w-fit bg-white px-4 py-2">
  <label class="flex justify-center items-center gap-2 relative group bg-white">
    <input type="checkbox" class="w-10 h-10 outline-none border-none z-10 opacity-0 bg-white" id="custom-checkbox" />
    <span class="absolute w-10 h-10 left-0 top-0 bottom-0 border-[3px] border-solid border-zinc-400 rounded group-checked:bg-green-500 bg-white transition-all duration-300 ease-in-out" id="custom-checkbox-span">
      <img class="bg-white opacity-0 transition-all duration-500" src="https://cdn.icon-icons.com/icons2/2131/PNG/512/checkmark_apply_check_checked_icon_131551.png" />
    </span>
    <p class="text-2xl text-zinc-400 bg-white">Não sou um robô</p>
  </label>
  <span>
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/RecaptchaLogo.svg/2048px-RecaptchaLogo.svg.png"
      class="w-20 h-20 bg-white"
    />
    <p class="text-xs text-zinc-400 bg-white">Privacy - Terms</p>
  </span>
  <style>
    #custom-checkbox:checked + #custom-checkbox-span img {
      opacity: 100;
    }
    #custom-checkbox:checked + #custom-checkbox-span {
      border: none;
    }
  </style>
</div>
*
* */