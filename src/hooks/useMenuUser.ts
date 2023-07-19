import { QueryResult, useQuery } from "@apollo/client";
import { IMenuUserResponse, IMenuUserVariables, menuUserQuery } from "../graphql/queries/menuUser";


export default function useGetUserEstablishmentInfos(id: string): QueryResult<IMenuUserResponse, IMenuUserVariables> {
	return useQuery<IMenuUserResponse, IMenuUserVariables>(menuUserQuery, {
		variables: {
			id
		}
	});
}
