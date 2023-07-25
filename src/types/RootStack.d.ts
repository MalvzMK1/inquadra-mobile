type RootStackParamList = {
	Login: undefined;
	ChooseUserType: undefined;
	Register: undefined;
	Home: {
		userGeolocation: {
			latitude: number,
			longitude: number,
		}
	};
	HomeVariant: undefined;
	RegisterPassword: {
		name: string
		email: string
		cpf: string
		phoneNumber: string
	};
	RegisterSuccess: undefined;
	InfoReserva: undefined;
	FavoriteCourts: undefined;
	ProfileSettings: undefined;
}