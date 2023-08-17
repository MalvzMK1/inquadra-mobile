import { QueryResult, useQuery } from "@apollo/client";
import {
    establishmentCardInformationsQuery,
    IEstablishmentCardInformationsResponse
} from "../graphql/queries/establishmentCardInformations";

export default function useEstablishmentCardInformations(): QueryResult<IEstablishmentCardInformationsResponse> {
    return useQuery<IEstablishmentCardInformationsResponse>(establishmentCardInformationsQuery)
}