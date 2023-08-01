type RootStackParamList = {
	Login: undefined;
	ChooseUserType: undefined;
	Register: undefined;
	EstablishmentRegister: undefined;
	Home: {
		userGeolocation: {
			latitude: number,
			longitude: number,
		},
		userPhoto: string | undefined,
		userID: string
	};
	HomeVariant: {
		userPhoto: string | undefined,
	};
	RegisterPassword: {
		name: string
		email: string
		cpf: string
		phoneNumber: string
	};
	RegisterSuccess: undefined;
	InfoReserva: undefined;
	FavoriteCourts: {
		userPhoto: string | undefined,
	};
	ProfileSettings: {
		userPhoto: string | undefined
	};
	DeleteAccountSuccess: undefined
	DescriptionReserve: undefined;
	DescriptionInvited: undefined;
	EstablishmentInfo: undefined;
	CourtAvailibilityInfo: {
		courtId: string,
		courtImage: string,
		courtName: string
	};
	ReservationPaymentSign: {
		courtId: string,
		courtImage: string,
		courtName: string
	}
	RegisterCourt: Omit<Establishment, 'id' | 'fantasyName' | 'cellphoneNumber'> & {
		address: Omit<Address, 'id' | 'longitude' | 'latitude'>
	} & {
		photos: string[]
	}
}