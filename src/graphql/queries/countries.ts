import { gql } from "@apollo/client";

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
`