import { QueryResult, useQuery } from "@apollo/client";
import {
    IEstablishmentSchedulingsDetailsResponse,
    IEstablishmentSchedulingsDetailsVariables,
    establishmentSchedulingsDetails
} from "../graphql/queries/establishmentSchedulingsDetails"

export function useGetEstablishmentSchedulingDetails(establishmentID: string, fantasy_name: string, dayWeek: string, date:string):QueryResult<IEstablishmentSchedulingsDetailsResponse, IEstablishmentSchedulingsDetailsVariables>{
    return useQuery<IEstablishmentSchedulingsDetailsResponse, IEstablishmentSchedulingsDetailsVariables>(establishmentSchedulingsDetails, {
        variables: {
            establishmentID,
            fantasy_name,
            dayWeek,
            date
        }
    })
}