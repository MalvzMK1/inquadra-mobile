import {createContext, FC, ReactNode, useContext, useState} from "react";

interface IUserData {
	id: string | number;
	jwt: string;
}

interface IUserContextProps {
	userData: IUserData | undefined;
	setUserData: (userData: IUserData) => void;
}

const UserContext = createContext<IUserContextProps | undefined>(undefined);

interface IUserProviderProps {
	children: ReactNode;
}

export function UserProvider({children}: IUserProviderProps) {
	const [userData, setUserData] = useState<IUserData | undefined>(undefined)

	function handleSetUserData(props: IUserData): void {
		setUserData(props);
	}

	return (
		<UserContext.Provider value={{userData, setUserData}}>
			{children}
		</UserContext.Provider>
	);
}

export function useUser() {
	const context = useContext(UserContext);

	if (!context) throw new Error('useUser must be used within a UserProvider');

	return context;
}
