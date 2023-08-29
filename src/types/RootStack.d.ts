type RootStackParamList = {
	Login: undefined;
	HistoryPayment: {
		establishmentId: string,
	};
	DetailsAmountReceivable: {
		establishmentId: string,
	};
	CompletedEstablishmentRegistration: undefined;
	CourtSchedule: {
		establishmentPhoto: string | undefined
	};
	AmountAvailableWithdrawal: {
		establishmentId: string,
	};
	RegisterEstablishmentProfile: undefined;
	CompletedEstablishmentResgistration: undefined;
	HomeEstablishment: {
		userPhoto: string | undefined,
		userID: string
	}
	DeleteAccountEstablishment: {
		establishmentName: string | undefined
	};
	InfoProfileEstablishment: {
		userPhoto: string
	}
	FinancialEstablishment: undefined;
	CourtPriceHour: undefined;
	EditCourt: {
		courtId: string | undefined,
		userPhoto: string | undefined
	};
	Schedulings: undefined
	ChooseUserType: undefined;
	Register: undefined;
	EstablishmentRegister: {
		username: string;
		cpf: string;
		email: string;
		password: string;
		phone_number: string;
		role: string
	};
	CancelScheduling: {
		scheduleID: string
	}
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
	InfoReserva: {
		userId: string
	};
	FavoriteCourts: {
		userPhoto: string | undefined,
		userID: string
	};
	ProfileSettings: {
		userPhoto: string | undefined,
		userID: string
	};
	DeleteAccountSuccess: undefined
	DescriptionReserve: {
		userId: string
		scheduleId:string
	};
	DescriptionInvited: undefined;
	EstablishmentInfo: {
		establishmentID: string,
		userPhoto: string | undefined,
	};
	CourtAvailabilityInfo: {
		courtId: string,
		courtImage: string,
		courtName: string,
		userId: string
	};
	ReservationPaymentSign: {
		courtId: string,
		courtImage: string,
		courtName: string,
		userId: string,
	}
	RegisterCourts: Omit<Establishment, 'id' | 'fantasyName' | 'cellphoneNumber'> & {
		address: Omit<Address, 'id' | 'longitude' | 'latitude'>
		
		photos: string[] | undefined
		profileInfos: {
			username: string;
			cpf: string;
			email: string;
			password: string;
			phone_number: string;
			role: string
		}
	}
	PixScreen: {
		courtName: string,
		value: string,
		userID: string,
	}
	RegisterNewCourt: {
		courtArray: CourtAdd[]
	}
	RegisterNewCourtAdded: {
		courtArray: CourtAdd[]
	}
	AllVeryWell: {
		courtArray: CourtAdd[]
	}
	CourtDetails: {
		courtArray: CourtAdd[]
	}
	editCourt: {
		courtArray: CourtAdd[]
		indexCourtArray: number
	}

}