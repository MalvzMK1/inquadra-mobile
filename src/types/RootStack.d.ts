import {z} from "zod";

type RootStackParamList = {
	Login: undefined;
	CourtSchedule: undefined;
	AmountAvailableWithdrawal: undefined;
	RegisterEstablishmentProfile: undefined;
	CompletedEstablishmentResgistration: undefined;
	HomeEstablishment: undefined
	DeleteAccountEstablishment: undefined;
	InfoProfileEstablishment: undefined;
	FinancialEstablishment: undefined;
	CourtPriceHour: undefined;
	EditCourt: undefined;
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
	InfoReserva: undefined;
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
		courtID: string,
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
	AllVeryWell: Pick<RootStackParamList, 'RegisterCourts'> | undefined
}