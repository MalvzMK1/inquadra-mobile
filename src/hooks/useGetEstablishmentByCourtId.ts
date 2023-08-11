import { QueryResult, useQuery } from "@apollo/client";
import {
	IEstablishmentByCourtId,
    EstablishmentByCourtIdQuery
} from "../graphql/queries/EstablishmentByCourtId";

export default function useGetEstablishmentByCourtId(id: string): QueryResult<IEstablishmentByCourtId> {
	return useQuery<IEstablishmentByCourtId>(EstablishmentByCourtIdQuery, {
		variables: {
			id
		}
	});
}
