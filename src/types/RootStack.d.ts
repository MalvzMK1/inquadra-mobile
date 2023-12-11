type RootStackParamList = {
  Login: undefined;
  HistoryPayment: {
    establishmentId: string;
    logo: string;
    dateFilter: string | null;
  };
  DetailsAmountReceivable: {
    establishmentId: string;
    logo: string;
  };
  CompletedEstablishmentRegistration: undefined;
  CourtSchedule: {
    establishmentPhoto: string | undefined;
    establishmentId: string;
  };
  AmountAvailableWithdrawal: {
    establishmentId: string;
    logo: string;
    valueDisponible: number;
  };
  RegisterEstablishmentProfile: undefined;
  CompletedEstablishmentResgistration: undefined;
  HomeEstablishment: {
    userPhoto?: string | undefined;
  };
  DeleteAccountEstablishment: {
    establishmentName: string | undefined;
  };
  InfoProfileEstablishment: {
    establishmentPhoto: string | undefined;
    establishmentId: string;
  };
  FinancialEstablishment: {
    establishmentId: string | undefined;
    logo: string | undefined;
  };
  CourtPriceHour: {
    minimumCourtPrice?: string;
  };
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
    name: string;
    cpf: string;
    email: string;
    password: string;
    role: string;
    phone_number: string;
  };
  CancelScheduling: {
    scheduleID: string;
    establishmentID: string;
    establishmentPicture: string;
  };
  Home: {
    userGeolocation?:
      | {
          latitude: number;
          longitude: number;
        }
      | undefined;
    userPhoto?: string | undefined;
    loadUserInfos?: boolean | undefined;
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
  InfoReserva: undefined;
  FavoriteEstablishments: {
    userPhoto: string | undefined;
  };
  ProfileSettings: {
    userPhoto: string | undefined;
  };
  WithdrawScreen: {
    establishmentId: string;
    logo: string;
    valueDisponible: number;
  };
  DeleteAccountSuccess: undefined;
  DescriptionReserve: {
    scheduleId: string;
  };
  DescriptionInvited: undefined;
  EstablishmentInfo: {
    establishmentId: string;
    userPhoto: string | undefined;
    colorState?: string;
    setColorState?: React.Dispatch<React.SetStateAction<string>>;
  };
  CourtAvailabilityInfo: {
    courtId: string;
    courtImage: string;
    courtName: string;
    userPhoto: string | undefined;
  };
  ReservationPaymentSign: {
    courtId: string;
    courtImage: string;
    courtName: string;
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
    profileInfos: {
      name: string;
      cpf: string;
      email: string;
      password: string;
      phone_number: string;
      role: string;
    };
    establishmentInfos: {
      amenities: string[];
      cellphone_number: string;
      cnpj: string | undefined;
      cep: string;
      corporate_name: string;
      phone_number: string;
      street_name: string;
      photos: string[];
      logo: string;
      latitude: string;
      longitude: string;
    };
  };
  PixScreen: {
    courtName: string;
    value: string;
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
    courtId?: string;
    courtImage?: string;
    pricePayed?: number;
    userPhoto?: string;
  };
  RegisterNewCourt: {
    courtArray: CourtAdd[];
  };
  RegisterNewCourtAdded: {
    courtArray: CourtAdd[];
  };
  AllVeryWell: {
    profileInfos: {
      name: string;
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
      logo: string;
      latitude: string;
      longitude: string;
    };
    courtArray: CourtAddRawPayload[];
  };
  CourtDetails: {
    courtArray: CourtAddRawPayload[];
  };
  editCourt: {
    courtArray: CourtAddRawPayload[];
    indexCourtArray: number;
  };
  UpdateSchedule: {
    userPhoto: string;
    courtId: string;
    courtImage: string | undefined;
    courtName: string;
    valuePayed: number;
    scheduleUpdateID: string;
    activationKey: string | null;
  };
  PaymentScheduleUpdate: {
    courtId: string;
    courtImage: string;
    courtName: string;
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
  };
  SetNewPassword: {
    code: string;
  };
};
