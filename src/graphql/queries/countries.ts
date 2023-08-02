import {gql} from "@apollo/client";
<<<<<<< HEAD
import { Country } from "../../types/Country";

export interface ICountriesResponse {
    countries: {
        data: Array<{
            id: Country['id']
            attributes: Omit<Country, 'id' | 'flag'> & {
                name: Country['name']
                ISOCode: Country['ISOCode']
                flag: {
                    data: {
                        id: Country['flag']['id'],
                        attributes: Omit<Country['flag'], 'id'>
                    }
                }
            }
        }>
    }
=======

export interface ICountriesResponse {
	countries: {
		data: Array<{
			id: Country['id']
			attributes: Omit<Country, 'id' | 'flag'> & {
				flag: {
					data: {
						id: Country['flag']['id'],
						attributes: Omit<Country['flag'], 'id'>
					}
				}
			}
		}>
	}
>>>>>>> c0e5801257af601f89511f7d4cbbc4208ce740f8
}

export const countriesQuery = gql`
    query getCountriesData {
        countries {
            data {
                id
                attributes {
                    name
                    ISOCode
                    flag {
                        data {
                            id
                            attributes {
                                name
                                alternativeText
                                hash
                                url
                            }
                        }
                    }
                }
            }
        }
    }
<<<<<<< HEAD
`
=======
`
>>>>>>> c0e5801257af601f89511f7d4cbbc4208ce740f8
