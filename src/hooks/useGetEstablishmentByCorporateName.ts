import {QueryResult, useQuery} from "@apollo/client";
import {IAllEstablishmentsResponse, allEstablishmentsQuery} from "../graphql/queries/searchEstablishmentsByCorporateName";


export default function useAllEstablishments(): QueryResult<IAllEstablishmentsResponse> {
	return useQuery<IAllEstablishmentsResponse>(allEstablishmentsQuery);
}