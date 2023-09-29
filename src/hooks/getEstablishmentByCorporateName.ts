import {QueryResult, useQuery} from "@apollo/client";
import {IsearchEstablishmentsByCorporateName, searchEstablishmentsByCorporateNameQuery} from "../graphql/queries/searchEstablishmentsByCorporateName";


export default function useAllAmenities(): QueryResult<IsearchEstablishmentsByCorporateName> {
	return useQuery<IsearchEstablishmentsByCorporateName>(searchEstablishmentsByCorporateNameQuery);
}