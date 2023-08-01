import {MutationResult, MutationTuple, useMutation} from "@apollo/client";
import {
	IUpdatePaymentCardInformationsResponse,
	IUpdatePaymentCardInformationsVariables,
	updatePaymentCardInformationsQuery
} from "../graphql/mutations/updatePaymentCardInformations";

export default function useUpdatePaymentCardInformations(): MutationTuple<IUpdatePaymentCardInformationsResponse, IUpdatePaymentCardInformationsVariables> {
	return useMutation<IUpdatePaymentCardInformationsResponse, IUpdatePaymentCardInformationsVariables>(updatePaymentCardInformationsQuery)
}