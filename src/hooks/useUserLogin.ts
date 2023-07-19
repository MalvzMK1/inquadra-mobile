import {ILoginHeaders, ILoginResponse, loginQuery} from '../graphql/queries/login'
import {QueryResult, useQuery} from "@apollo/client";

export default function useUserLogin(bearerToken: string): QueryResult<ILoginResponse, ILoginHeaders> {
	return useQuery<ILoginResponse, ILoginHeaders>(loginQuery, {
		context: {
			headers: {
				Authorization: `bearer ${bearerToken}`
			}
		}
	});
}
