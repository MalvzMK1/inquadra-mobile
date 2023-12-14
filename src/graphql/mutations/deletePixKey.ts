import {gql} from "@apollo/client";

export interface IDeletePixKeyResponse {
	deletePixKey: {
		data: {
			id: string;
			attributes: {
				key: string;
			}
		}
	}
}

export interface IDeletePixKeyVariables {
	id: string | number;
}

export const deletePixKeyMutation = gql`
    mutation($id: ID!) {
        deletePixKey(id: $id) {
            data {
                id
                attributes {
                    key
                }
            }
        }
    }
`;
