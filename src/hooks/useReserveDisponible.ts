import { QueryResult, useQuery } from "@apollo/client";
import { IReserveDisponibleResponse, IReserveDisponibleVariables, reserveDisponibleQuery } from "../graphql/queries/reserveDisponible";

export default function useReserveDisponible(weekDay: string): QueryResult<IReserveDisponibleResponse, IReserveDisponibleVariables> {
    return useQuery<IReserveDisponibleResponse, IReserveDisponibleVariables>(reserveDisponibleQuery, {
		variables: {
			weekDay
		}
    })
}