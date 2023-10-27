import {QueryResult, useQuery} from "@apollo/client";
import {
	IUserPaymentCountryVariable,
	IUserPaymentsCountryResponse,
	userPaymentCountryQuery
} from "../graphql/queries/userPaymentsCountry";

export default function useUserPaymentCountry(userId: string): QueryResult<IUserPaymentsCountryResponse, IUserPaymentCountryVariable> {
	return useQuery<IUserPaymentsCountryResponse, IUserPaymentCountryVariable>(userPaymentCountryQuery, {
		variables: {
			id: userId
		}
	})
}
