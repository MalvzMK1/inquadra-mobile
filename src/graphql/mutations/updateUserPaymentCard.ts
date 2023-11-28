import {gql} from "@apollo/client";

enum EPayedStatus {
	Waiting,
	Payed,
	Canceled,
}

export interface IUpdateUserPaymentCardResponse {
	updateUserPayment: {
		data?: {
			id: string;
			data: {
				paymentId: string;
			}
		}
	}
}

export interface IUpdateUserPaymentCardVariables {
	userPaymentId: string | number;
	paymentId: string;
	paymentStatus: keyof typeof EPayedStatus;
	scheduleId: string | number;
}

export const updateUserPaymentCardMutation = gql`
    mutation updateUserPayment(
        $userPaymentId: ID!
        $paymentId: String
        $paymentStatus: ENUM_USERPAYMENT_PAYEDSTATUS
        $scheduleId: ID!
    ) {
        updateUserPayment(
            id: $userPaymentId
            data: {
                paymentId: $paymentId
                payedStatus: $paymentStatus
                scheduling: $scheduleId
            }
        ) {
            data {
                id
                attributes {
                    paymentId
                }
            }
        }
    }
`;