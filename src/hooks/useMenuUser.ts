import { QueryResult, useQuery } from "@apollo/client";
import { IMenuUserResponse, IMenuUserVariables, menuUserQuery } from "../graphql/queries/menuUser";


export function useGetMenuUser(id: string): QueryResult<IMenuUserResponse, IMenuUserVariables> {
	return useQuery<IMenuUserResponse, IMenuUserVariables>(menuUserQuery, {
		variables: {
			id
		}
	});
}
