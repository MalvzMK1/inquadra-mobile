import {QueryResult, useQuery} from "@apollo/client";
import {
	getAllBlockedAvailabilitiesFromCourtQuery,
	IGetAllBlockedAvailabilitiesFromCourtResponse,
	IGetAllBlockedAvailabilitiesFromCourtVariables
} from "../graphql/queries/getAllBlockedAvailabilitiesFromCourt";

export default function useAllBlockedAvailabilitiesFromCourt(courtId: string): QueryResult<IGetAllBlockedAvailabilitiesFromCourtResponse, IGetAllBlockedAvailabilitiesFromCourtVariables> {
	return useQuery<IGetAllBlockedAvailabilitiesFromCourtResponse, IGetAllBlockedAvailabilitiesFromCourtVariables>(getAllBlockedAvailabilitiesFromCourtQuery, {
		variables: {
			court_id: courtId
		}
	});
}
