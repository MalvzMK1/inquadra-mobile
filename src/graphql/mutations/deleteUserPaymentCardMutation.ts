import {gql} from "@apollo/client";

export interface IDeleteUserPaymentCardResponse {
	deleteUserPayment: {
		data?: {
			id: string;
		}
	}
}

export interface IDeleteUserPaymentCardVariables {
	userPaymentId: string | number;
}

export const deleteUserPaymentCardMutation = gql`
    mutation deleteUserPayment($userPaymentId: ID!) {
        deleteUserPayment(id: $userPaymentId) {
            data {
                id
            }
        }
    }
`;
