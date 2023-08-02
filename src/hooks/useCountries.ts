import {QueryResult, useQuery} from "@apollo/client";
import {countriesQuery, ICountriesResponse} from "../graphql/queries/countries";

export default function useCountries(): QueryResult<ICountriesResponse> {
<<<<<<< HEAD
    return useQuery(countriesQuery)
=======
	return useQuery(countriesQuery)
>>>>>>> c0e5801257af601f89511f7d4cbbc4208ce740f8
}