import { gql } from "@apollo/client";

export interface ICourtType {
	id: SportType['id']
	attributes: {
		name: SportType['name']
	}
}

export interface ISportTypesResponse {
	courts: {
		data: Array<{
			attributes: {
				court_types: {
					data: Array<ICourtType>
				}
			}
		}>
		__typename: string
	}
}

export const availablesSportTypesQuery = gql`
    query typeSports {
        courts {
            data {
                attributes {
                    court_types {
                        data {
                            id
                            attributes {
                                name
                            }
                        }
                    }
                }
            }
        }
    }
`;
