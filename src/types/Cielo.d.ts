enum StringedBoolean {
	true,
	false
}

enum EIdentityType {
	cpf,
	rg,
	cnpj
}

type CieloAddress = {
	Street: string;
	Number: string;
	Complement: string;
	ZipCode: string;
	City: string;
	State: string;
	Country: string;
	AddressType?: number;
};

type Customer = {
	Name: string;
	Identity?: string;
	IdentityType?: keyof typeof EIdentityType;
	Email: string;
	Birthdate: string;
	Address: CieloAddress;
	DeliveryAddress: CieloAddress;
};

type CreditCard = {
	CardNumber: string;
	Holder: string;
	ExpirationDate: string;
	SaveCard: boolean;
	Brand: string;
	PaymentAccountReference?: string;
	SecurityCode?: string;
};

type Payment = {
	ServiceTaxAmount: number;
	Installments: number;
	Interest?: string | number;
	Capture: keyof typeof StringedBoolean;
	Authenticate: keyof typeof StringedBoolean;
	Recurrent: keyof typeof StringedBoolean;
	CreditCard: CreditCard;
	Tid?: string;
	ProofOfSale?: string;
	AuthorizationCode?: string;
	SoftDescriptor?: string;
	Provider?: string;
	IsQrCode?: boolean;
	Amount: number;
	ReceivedDate?: string;
	Status?: number;
	IsSplitted?: boolean;
	ReturnMessage?: string;
	ReturnCode?: string;
	PaymentId?: string;
	Type: string;
	Currency: string;
	Country: string;
	Links?: Link[];
	IsCryptoCurrencyNegotiation?: boolean
};

type Link = {
	Method: string;
	Rel: string;
	Href: string;
};

type AuthorizeCreditCardPaymentResponse = {
	MerchantOrderId: string;
	Customer: Customer;
	Payment: Payment;
};

type ConfirmCreditCardPaymentResponse = {
	Status: number;
	ReasonCode: number;
	ReasonMessage: string;
	ProviderReturnCode: string;
	ProviderReturnMessage: string;
	ReturnCode: string;
	ReturnMessage: string;
	Tid: string;
	ProofOfSale: string;
	AuthorizationCode: string;
	Links: Link[];
}

type TransactionResponse = {
	MerchantOrderId: string;
	AcquirerOrderId: string;
	Customer: Customer;
	Payment: Payment & {
		PaymentId: string;
		Type: string;
		ReceivedDate: string;
		Currency: string;
		Provider: string;
		Status: number;
	};
}
