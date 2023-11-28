import {MutationTuple, useMutation} from "@apollo/client";
import {
	IUpdateUserPaymentCardResponse,
	IUpdateUserPaymentCardVariables, updateUserPaymentCardMutation
} from "../graphql/mutations/updateUserPaymentCard";

export default function useUpdateUserPaymentCard(): MutationTuple<IUpdateUserPaymentCardResponse, IUpdateUserPaymentCardVariables> {
	return useMutation<IUpdateUserPaymentCardResponse, IUpdateUserPaymentCardVariables>(updateUserPaymentCardMutation);
}
