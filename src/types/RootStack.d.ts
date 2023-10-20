type RootStackParamList = {
  Login: undefined;
  HistoryPayment: {
    establishmentId: string;
    logo: string;
  };
  DetailsAmountReceivable: {
    establishmentId: string;
    logo: string;
  };
  CompletedEstablishmentRegistration: undefined;
  CourtSchedule: {
    establishmentPhoto: string | undefined;
    establishmentId: string;
    userId: string;
  };
  AmountAvailableWithdrawal: {
    establishmentId: string;
    logo: string;
    valueDisponible: number
  };
  RegisterEstablishmentProfile: undefined;
  CompletedEstablishmentResgistration: undefined;
  HomeEstablishment: {
    userPhoto?: string | undefined;
    userID?: string;
  };
  DeleteAccountEstablishment: {
    establishmentName: string | undefined;
  };
  InfoProfileEstablishment: {
    userPhoto: string;
    establishmentId: string;
  };
  FinancialEstablishment: {
    establishmentId: string | undefined;
    logo: string | undefined;
  };
  CourtPriceHour: undefined;
  EditCourt: {
    courtId: string | undefined;
    userPhoto: string | undefined;
  };
  Schedulings: {
    establishmentId: string;
    establishmentPhoto: string | undefined;
  };
  ChooseUserType: undefined;
  TermsOfService: undefined;
  Register: {
    flow: "normal" | "establishment";
  };
  EstablishmentRegister: {
    username: string;
    cpf: string;
    email: string;
    password: string;
    phone_number: string;
    role: string;
    // id: string;
  };
  CancelScheduling: {
    scheduleID: string;
    establishmentID: string;
    establishmentPicture: string;
  };
  Home: {
    userGeolocation: {
      latitude: number;
      longitude: number;
    };
    userPhoto: string | undefined;
    userID: string;
  };
  HomeVariant: {
    userPhoto: string;
    name: string;
  };
  RegisterPassword: {
    flow: "normal" | "establishment";
    data: {
      name: string;
      email: string;
      cpf: string;
      phoneNumber: string;
    };
  };
  RegisterSuccess: {
    nextRoute: "Home" | "HomeEstablishment";
    routePayload: any;
  };
  InfoReserva: {
    userId: string;
  };
  FavoriteEstablishments: {
    userPhoto: string | undefined;
    userID: string;
  };
  ProfileSettings: {
    userPhoto: string | undefined;
    userID: string;
  };
  WithdrawScreen: {
    establishmentId: string;
    logo: string;
    valueDisponible: number;
  };
  DeleteAccountSuccess: undefined;
  DescriptionReserve: {
    userId: string;
    scheduleId: string;
  };
  DescriptionInvited: undefined;
  EstablishmentInfo: {
    establishmentId: string;
    userId: string;
    userPhoto: string | undefined;
  };
  CourtAvailabilityInfo: {
    courtId: string;
    courtImage: string;
    courtName: string;
    userId: string;
    userPhoto: string | undefined;
  };
  ReservationPaymentSign: {
    courtId: string;
    courtImage: string;
    courtName: string;
    userId: string;
    userPhoto: string | undefined;
    courtAvailabilities: string;
    amountToPay: number;
    courtAvailabilityDate: string;
  };
  RegisterCourts: Omit<
    Establishment,
    "id" | "fantasyName" | "cellphoneNumber"
  > & {
    address: Omit<Address, "id" | "longitude" | "latitude">;
    profileInfos?: {
      username: string;
      cpf: string;
      email: string;
      password: string;
      phone_number: string;
      role: string;
    };
    establishmentInfos: {
      amenities: string[];
      cellphone_number: string;
      cnpj: string;
      cep: string;
      corporate_name: string;
      phone_number: string;
      street_name: string;
      photos: string[];
      latitude: string;
      longitude: string;
    }
  };
  PixScreen: {
    courtName: string;
    value: string;
    userID: string;
    scheduleID?: number;
    QRcodeURL: string;
    paymentID: string;
    userPaymentPixID: string;
    serviceRate?: number;
    schedulePrice?: number;
    scheduleValuePayed?: number;
    screen: "signal" | "historic" | "updateSchedule";
    court_availabilityID?: string;
    date?: string;
    pay_day?: string;
    value_payed?: number;
    ownerID?: string;
    service_value?: number;
    isPayed?: boolean;
    userMoney?: number;
    newDate?: string;
    randomKey?: string;
    isPayed?: boolean;
  };
  RegisterNewCourt: {
    courtArray: CourtAdd[];
  };
  RegisterNewCourtAdded: {
    courtArray: CourtAdd[];
  };
  AllVeryWell: {
    profileInfos: {
      username: string;
      cpf: string;
      email: string;
      password: string;
      phone_number: string;
      role: string;
    };
    establishmentInfos: {
      amenities: string[];
      cellphone_number: string;
      cnpj: string;
      cep: string;
      corporate_name: string;
      phone_number: string;
      street_name: string;
      photos: string[];
      latitude: string;
      longitude: string;
    };
    courtArray: CourtAddRawPayload[];
  };
  CourtDetails: {
    courtArray: CourtAdd[];
  };
  editCourt: {
    courtArray: CourtAdd[];
    indexCourtArray: number;
  };
  UpdateSchedule: {
    userPhoto: string;
    userId: string;
    courtId: string;
    courtImage: string;
    courtName: string;
    valuePayed: number;
    scheduleUpdateID: string;
    activationKey: string | null;
  };
  PaymentScheduleUpdate: {
    courtId: string;
    courtImage: string;
    courtName: string;
    userId: string;
    userPhoto: string | undefined;
    courtAvailabilities: string;
    amountToPay: number;
    courtAvailabilityDate: string;
    scheduleUpdateID: string;
    pricePayed: number;
    activationKey: string | null;
  };
  ForgotPassword: undefined;
  InsertResetCode: {
    email: string;
    username: string;
    id: string;
  };
  SetNewPassword: {
    code: string;
  };
};
