import {MutationTuple, useMutation} from "@apollo/client";
import {
	deleteUserPaymentCardMutation,
	IDeleteUserPaymentCardResponse,
	IDeleteUserPaymentCardVariables
} from "../graphql/mutations/deleteUserPaymentCardMutation";

export default function useDeleteUserPaymentCard(): MutationTuple<IDeleteUserPaymentCardResponse, IDeleteUserPaymentCardVariables> {
	return useMutation<IDeleteUserPaymentCardResponse, IDeleteUserPaymentCardVariables>(deleteUserPaymentCardMutation)
}
