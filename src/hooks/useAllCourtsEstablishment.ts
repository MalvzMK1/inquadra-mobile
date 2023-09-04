import {QueryResult, useQuery} from "@apollo/client";
import {IAllCourtsEstablishmentResponse, IAllCourtsEstablishmentVariable, allCourtsEstablishmentVariableQuery} from "../graphql/queries/allCourtsEstablishment"

export default function useAllCourtsEstablishment(establishmentID: string): QueryResult<IAllCourtsEstablishmentResponse,IAllCourtsEstablishmentVariable>{
    return useQuery<IAllCourtsEstablishmentResponse, IAllCourtsEstablishmentVariable>(allCourtsEstablishmentVariableQuery, {
        variables: {
            establishmentID: establishmentID
        }
    })
}