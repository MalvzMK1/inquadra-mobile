import {createContext, FC, ReactNode, useContext, useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {APP_DEBUG_VERBOSE} from "@env";
import {UserGeolocation} from "../types/UserGeolocation";

interface IUserData {
	id?: string;
	jwt?: string;
	geolocation?: {
		latitude: number,
		longitude: number,
	}
}

interface IUserContextProps {
	userData: IUserData | undefined;
	setUserData: (userData: IUserData | undefined) => Promise<void>;
}

const UserContext = createContext<IUserContextProps | undefined>(undefined);

interface IUserProviderProps {
	children: ReactNode;
}

export function UserProvider({children}: IUserProviderProps) {
	const [userData, setUserData] = useState<IUserData | undefined>(undefined)

	async function handleSetUserData(props: IUserData | undefined): Promise<void> {
		if (props !== undefined)
			await AsyncStorage.setItem(
				'@inquadra/user_data',
				JSON.stringify(props)
			);
		else
			await AsyncStorage.removeItem(
				'@inquadra/user_data',
			)

		setUserData(props);
	}

	useEffect(() => {
		async function loadDataFromAsyncStorage(): Promise<{ newUserData: IUserData | undefined, newUserGeolocation: UserGeolocation | undefined }> {
			let newUserData: IUserData | undefined = undefined;
			let newUserGeolocation: UserGeolocation | undefined = undefined;

			const loadedUserData = await AsyncStorage.getItem(
				'@inquadra/user_data',
			)

			const loadedUserGeolocation = await AsyncStorage.getItem(
				'@inquadra/user_geolocation'
			)

			if (loadedUserData) {
				try {
					const parsedLoadedUserData = JSON.parse(loadedUserData);

					setUserData({
						...parsedLoadedUserData
					});

					newUserData = parsedLoadedUserData;
				} catch (error) {
					console.log(JSON.stringify(error));

					if (JSON.parse(APP_DEBUG_VERBOSE)) alert(JSON.stringify(error, null, 2));
					else alert('Não foi possível guardar as informações do usuário');
				}
			}

			// ADICIONAR AS INFORMAÇÕES DA GEOLOCALIZAÇÃO

			if (newUserData && loadedUserGeolocation) {
				try {
					const parsedLoadedUserGeolocation = JSON.parse(loadedUserGeolocation);

					setUserData(prevState => ({
						id: prevState?.id,
						jwt: prevState?.jwt,
						geolocation: {
							...parsedLoadedUserGeolocation,
						}
					}))

					newUserGeolocation = parsedLoadedUserGeolocation;
				} catch (error) {
					console.log(JSON.stringify(error));

					if (JSON.parse(APP_DEBUG_VERBOSE)) alert(JSON.stringify(error, null, 2));
					else alert('Não foi possível guardar as informações do usuário');
				}
			}

			return {
				newUserData,
				newUserGeolocation
			}
		}

		loadDataFromAsyncStorage().then((response) => console.log('Infos loaded successfully\n' + JSON.stringify(response, null, 2)));
	}, [])

	return (
		<UserContext.Provider value={{userData, setUserData: handleSetUserData}}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const context = useContext(UserContext);

	if (!context) throw new Error('useUser must be used within a UserProvider');

	return context;
}
