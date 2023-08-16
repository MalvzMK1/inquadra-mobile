import {QueryResult, useQuery} from "@apollo/client";
import {countriesQuery, ICountriesResponse} from "../graphql/queries/countries";

export default function useCountries(): QueryResult<ICountriesResponse> {
	return useQuery(countriesQuery)
}