type RootStackParamList = {
	Login: undefined;
	ChooseUserType: undefined;
	Register: undefined;
	EstablishmentRegister: {
		name: string
		email: string
		phoneNumber: string
		cpf: string
		password: string
	};
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
	DescriptionReserve: {
		userId: string
		courtId: string
	};
	DescriptionInvited: undefined;
	EstablishmentInfo: {
		courtID:string,
		userPhoto: string | undefined,
	};
	CourtAvailabilityInfo: {
		courtId: string,
		courtImage: string,
		courtName: string
	};
	ReservationPaymentSign: {
		courtId: string,
		courtImage: string,
		courtName: string
	}
	RegisterCourt: Omit<Establishment, 'id' | 'fantasyName' | 'cellphoneNumber' | 'photo'> & {
		address: Omit<Address, 'id' | 'longitude' | 'latitude'>
	} & {
		photos: string[] | undefined
	}
	PixScreen: {
		courtName: string,
		value: string
	}
}