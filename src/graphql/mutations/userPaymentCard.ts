import { gql } from "@apollo/client";

export interface IUserPaymentCardResponse {
  createUserPayment: {
    data: {
      id: string;
    };
  };
}

export interface IUserPaymentCardVariables {
  value: number;
  schedulingId?: string | number;
  userId: string | number;
  name: string;
  cpf: string;
  cvv: number;
  date: string;
  countryID: string | number;
  publishedAt: string;
  cep: string;
  state: string;
  city: string;
  number: string;
  complement: string | null | undefined;
  street: string;
  neighborhood: string;
  paymentId: string;
  payedStatus: "Waiting" | "Payed" | "Canceled";
}

export const userPaymentCardMutation = gql`
 mutation newUserPayment(
  $value: Float
  $schedulingId: ID!
  $userId: ID
  $name: String
  $cpf: String
  $cvv: Int
  $date: Date
  $countryID: ID
  $publishedAt: DateTime
  $cep: String
  $state: String
  $city: String
  $number: String
  $complement: String
  $street: String
  $neighborhood: String
  $paymentId: String
  $payedStatus: ENUM_USERPAYMENT_PAYEDSTATUS
) {
  createUserPayment(
    data: {
      scheduling: $schedulingId
      value: $value
      users_permissions_user: $userId
      name: $name
      cpf: $cpf
      paymentId: $paymentId
      country: $countryID
      card: {
        cvv: $cvv
        dueDate: $date
        cep: $cep
        state: $state
        city: $city
        number: $number
        complement: $complement
        street: $street
        neighborhood: $neighborhood
      }
      publishedAt: $publishedAt
      payedStatus: $payedStatus
    }
  ) {
    data {
      id
    }
  }
}
`;
