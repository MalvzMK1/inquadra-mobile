type Address = {
	Street: string;
	Number: string;
	Complement: string;
	ZipCode: string;
	City: string;
	State: string;
	Country: string;
	AddressType: number;
};

type Customer = {
	Name: string;
	Identity: string;
	IdentityType: string;
	Email: string;
	Birthdate: string;
	Address: Address;
	DeliveryAddress: Address;
};

type CreditCard = {
	CardNumber: string;
	Holder: string;
	ExpirationDate: string;
	SaveCard: boolean;
	Brand: string;
	PaymentAccountReference: string;
};

type Payment = {
	ServiceTaxAmount: number;
	Installments: number;
	Interest: number;
	Capture: boolean;
	Authenticate: boolean;
	Recurrent: boolean;
	CreditCard: CreditCard;
	Tid: string;
	ProofOfSale: string;
	AuthorizationCode: string;
	SoftDescriptor: string;
	Provider: string;
	IsQrCode: boolean;
	Amount: number;
	ReceivedDate: string;
	Status: number;
	IsSplitted: boolean;
	ReturnMessage: string;
	ReturnCode: string;
	PaymentId: string;
	Type: string;
	Currency: string;
	Country: string;
	Links: Link[];
};

type Link = {
	Method: string;
	Rel: string;
	Href: string;
};

type IAuthorizeCreditCardPaymentResponse = {
	MerchantOrderId: string;
	Customer: Customer;
	Payment: Payment;
};
