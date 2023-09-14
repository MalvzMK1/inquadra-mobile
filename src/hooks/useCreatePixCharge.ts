import {MutationTuple, useMutation} from "@apollo/client";
import {
	createPixChargeMutation,
	ICreatePixChargeResponse,
	ICreatePixChargeVariables
} from "../graphql/mutations/createPixCharge";

export function useCreatePixCharge(): MutationTuple<ICreatePixChargeResponse, ICreatePixChargeVariables> {
	return useMutation<ICreatePixChargeResponse, ICreatePixChargeVariables>(createPixChargeMutation)
}
