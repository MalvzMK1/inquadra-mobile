import { QueryResult, useQuery } from "@apollo/client";
import { ICourtsByEstablishmentIdResponse, ICourtsByEstablishmentIdVariable, courtsByEstablishmentIdQuery } from "../graphql/queries/courtsByEstablishmentId";

export default function useCourtsByEstablishmentId(establishmentId: string): QueryResult<ICourtsByEstablishmentIdResponse, ICourtsByEstablishmentIdVariable> {
    return useQuery<ICourtsByEstablishmentIdResponse, ICourtsByEstablishmentIdVariable>(courtsByEstablishmentIdQuery, {
        variables: {
            establishment_id: establishmentId
        }
    })
}