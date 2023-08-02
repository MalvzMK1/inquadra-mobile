import { gql } from "@apollo/client";



export interface ICourtType {
	data: {
		id: SportType['id']
		attributes: {
			name: SportType['name']
		}
	}
}

export interface ISportTypesResponse {
	courts: {
		data: Array<{
			attributes: {
				court_type: ICourtType
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
                    court_type {
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
