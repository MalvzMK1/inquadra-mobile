import {MutationTuple, useMutation} from "@apollo/client";
import {
	blockAvailabilityMutation,
	IBlockAvailabilityResponse,
	IBlockAvailabilityVariables
} from "../graphql/mutations/blockAvailability";

export default function useBlockAvailability(): MutationTuple<IBlockAvailabilityResponse, IBlockAvailabilityVariables> {
	return useMutation<IBlockAvailabilityResponse, IBlockAvailabilityVariables>(blockAvailabilityMutation);
}
