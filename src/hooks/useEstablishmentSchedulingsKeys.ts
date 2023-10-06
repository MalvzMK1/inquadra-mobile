import { QueryResult, useQuery } from "@apollo/client";
import {IEstablishmentSchedulingsKeysResponse, IEstablishmentSchedulingsKeysVariables, establishmentSchedulingsKeysQuery} from "../graphql/queries/establishmentSchedulingsKeys"

export function useEstablishmentSchedulingsKeys(fantasyName: string, establishmentID: string):QueryResult<IEstablishmentSchedulingsKeysResponse, IEstablishmentSchedulingsKeysVariables>{
    return useQuery<IEstablishmentSchedulingsKeysResponse, IEstablishmentSchedulingsKeysVariables>(establishmentSchedulingsKeysQuery, {
        variables: {
            fantasyName,
           establishmentID 
        }
    })
}