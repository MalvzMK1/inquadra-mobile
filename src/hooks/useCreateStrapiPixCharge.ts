import {MutationTuple, useMutation} from "@apollo/client";
import {
	createStrapiChargeMutation,
	ICreateStrapiChargeResponse,
	ICreateStrapiChargeVariables
} from "../graphql/mutations/createStrapiCharge";

export function useCreateStrapiPixCharge(): MutationTuple<ICreateStrapiChargeResponse, ICreateStrapiChargeVariables> {
	return useMutation<ICreateStrapiChargeResponse, ICreateStrapiChargeVariables>(createStrapiChargeMutation);
}