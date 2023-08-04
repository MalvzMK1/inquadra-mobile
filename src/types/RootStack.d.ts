type RootStackParamList = {
	Login: undefined;
	CourtSchedule: undefined;
	RegisterCourts: undefined;
	RegisterEstablishmentProfile: undefined;
	CompletedEstablishmentResgistration: undefined;
	DeleteAccountEstablishment: undefined;
	InfoProfileEstablishment: undefined;
	FinancialEstablishment: undefined;
	CourtPriceHour: undefined;
	EditCourt: undefined;
	ChooseUserType: undefined;
	Register: undefined;
	EstablishmentRegister: {
		ownerID: string
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
	PixScreen: {
		courtName: string,
		value: string
	}
}