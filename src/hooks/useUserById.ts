import { QueryResult, useQuery } from "@apollo/client";
import { IUserByIdResponse, IUserByIdVariables, userByIdQuery } from "../graphql/queries/userById";


export default function useGetUserById(id: string): QueryResult<IUserByIdResponse, IUserByIdVariables> {
	return useQuery<IUserByIdResponse, IUserByIdVariables>(userByIdQuery, {
		variables: {
			id
		}
	});
}
