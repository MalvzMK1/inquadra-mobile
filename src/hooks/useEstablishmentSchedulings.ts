import { QueryResult, useQuery } from "@apollo/client";
import { IEstablishmentSchedulingsResponse, IEstablishmentSchedulingsVariables, establishmentSchedulingQuery } from "../graphql/queries/EstablishmentSchedulings";



export function useEstablishmentSchedulings(id: string, date: string): QueryResult<IEstablishmentSchedulingsResponse, IEstablishmentSchedulingsVariables> {
    return useQuery<IEstablishmentSchedulingsResponse, IEstablishmentSchedulingsVariables>(establishmentSchedulingQuery, {
		variables: {
			id,
      date
		}
    })
}

