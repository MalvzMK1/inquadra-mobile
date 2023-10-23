//Types of generate pix
interface Customer {
  Name: string;
  Identity: string;
  IdentityType: "CPF" | "CNPJ";
}

interface PaymentPix{
  Type: "Pix" | "Boleto" | "Cartao";
  Amount: number;
}
interface Payment {
  Type: "Pix" | "Boleto" | "Cartao";
  Amount: number;
}

interface RequestGeneratePix {
  MerchantOrderId: string;
  Customer: Customer;
  Payment: PaymentPix;
}

//Types of the response of the generate pix
interface Customer {
  Name: string;
  Identity: string;
  IdentityType: string;
}

interface Link {
  Method: string;
  Rel: string;
  Href: string;
}

interface GeneratedPixInfos {
  QrCodeBase64Image: string;
  QrCodeString: string;
  Tid: string;
  ProofOfSale: string;
  SentOrderId: string;
  Amount: number;
  ReceivedDate: string;
  Provider: string;
  Status: number;
  IsSplitted: boolean;
  ReturnMessage: string;
  ReturnCode: string;
  PaymentId: string;
  Type: string;
  Currency: string;
  Country: string;
  Links: Link[];
}

interface ResponseGeneratedPix {
  MerchantOrderId: string;
  Customer: Customer;
  Payment: GeneratedPixInfos;
}

interface PixResponse {
  MerchantOrderId: string;
  Customer: Customer;
  Payment: Payment;
}

//Types of the response of the query check pix
type ResponseVerifyPixStatus = {
  MerchantOrderId: string;
  AcquirerOrderId: string;
  Customer: {
    Name: string;
    Identity: string;
    Address: Record<string, unknown>;
  };
  Payment: {
    Installments: number;
    Tid: string;
    ProofOfSale: string;
    PaymentId: string;
    Type: string;
    Amount: number;
    ReceivedDate: string;
    Currency: string;
    Country: string;
    Provider: string;
    Status: number;
    Links: Array<{
      Method: string;
      Rel: string;
      Href: string;
    }>;
  };
};


//Type of the query devolution pix

type ResponseDevolutionPix = {
  Status: number;
  ReasonCode: number;
  ReasonMessage: string;
  ProviderReturnCode: string;
  ProviderReturnMessage: string;
  ReturnCode: string;
  ReturnMessage: string;
  Tid: string;
  ProofOfSale: string;
  Links: {
    Method: string;
    Rel: string;
    Href: string;
  }[];
};