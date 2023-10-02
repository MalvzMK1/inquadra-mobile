import {gql} from "@apollo/client";

export interface ICreateStrapiChargeResponse {
	data: {
		createPixInfo: {
			data?: {
				attributes: {
					code: string,
					txid: string,
				}
			}
		}
	}
}

export interface ICreateStrapiChargeVariables {
	code: string;
	txid: string;
	establishmentID: string;
	userID: string;
	publishedAt: string;
}

export const createStrapiChargeMutation = gql`
    mutation storePixInfos(
        $code: String!
        $txid: String!
        $establishmentID: ID
        $userID: ID
        $publishedAt: DateTime
    ) {
        createPixInfo(
            data: {
                code: $code
                txid: $txid
                establishment: $establishmentID
                users_permissions_user: $userID
                publishedAt: $publishedAt
            }
        ) {
            data {
                attributes {
                    code
                    txid
                }
            }
        }
    }
`
