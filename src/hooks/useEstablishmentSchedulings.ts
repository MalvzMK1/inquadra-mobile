import { QueryResult, useQuery } from "@apollo/client";
import { IEstablishmentSchedulingsResponse, IEstablishmentSchedulingsVariables, establishmentSchedulingQuery } from "../graphql/queries/establishmentSchedulings";



export default function useEstablishmentSchedulings(id: string, date: String): QueryResult<IEstablishmentSchedulingsResponse, IEstablishmentSchedulingsVariables> {
    return useQuery<IEstablishmentSchedulingsResponse, IEstablishmentSchedulingsVariables>(establishmentSchedulingQuery, {
		variables: {
			id,
            date
		}
    })
}