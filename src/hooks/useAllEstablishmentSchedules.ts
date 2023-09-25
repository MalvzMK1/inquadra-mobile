import {QueryResult, useQuery} from "@apollo/client";
import {
	allEstablishmentSchedulesQuery,
	IEstablishmentAllSchedulesResponse, IEstablishmentAllSchedulesVariables
} from "../graphql/queries/establishmentAllSchedules";

export default function useAllEstablishmentSchedules(establishmentId: string): QueryResult<IEstablishmentAllSchedulesResponse, IEstablishmentAllSchedulesVariables> {
	return useQuery<IEstablishmentAllSchedulesResponse, IEstablishmentAllSchedulesVariables>(allEstablishmentSchedulesQuery, {
		variables: {
			id: establishmentId
		}
	})
}