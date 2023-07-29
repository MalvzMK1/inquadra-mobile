import { QueryResult, useQuery } from "@apollo/client";
import {
	IEstablishmentByCourtId,
    establishmentSchedulingQuery
} from "../graphql/queries/EstablishmentByCourtId";

export default function useGetEstablishmentByCourtId(id: string): QueryResult<IEstablishmentByCourtId> {
	return useQuery<IEstablishmentByCourtId>(establishmentSchedulingQuery, {
		variables: {
			id
		}
	});
}
