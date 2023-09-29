import {QueryResult, useQuery} from "@apollo/client";
import {IsearchEstablishmentsByCorporateName, searchEstablishmentsByCorporateNameQuery} from "../graphql/queries/searchEstablishmentsByCorporateName";


export default function useGetEstablishmentByCorporateName(corporateName: string): QueryResult<IsearchEstablishmentsByCorporateName> {
	return useQuery<IsearchEstablishmentsByCorporateName>(searchEstablishmentsByCorporateNameQuery, {
		variables :{
			name: corporateName
		}
	});
}