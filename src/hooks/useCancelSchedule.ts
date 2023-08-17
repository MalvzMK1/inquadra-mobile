import {MutationTuple, useMutation} from "@apollo/client";
import {cancelReserveQuery, ICancelReserveResponse, ICancelReserveVariables} from "../graphql/mutations/cancelSchedule";

export default function useCancelSchedule(): MutationTuple<ICancelReserveResponse, ICancelReserveVariables> {
	return useMutation<ICancelReserveResponse, ICancelReserveVariables>(cancelReserveQuery);
}
