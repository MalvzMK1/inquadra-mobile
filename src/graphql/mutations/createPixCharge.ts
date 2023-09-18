import {gql} from "@apollo/client";

export interface ICreatePixChargeResponse {
	txid: string;
	code: string;
}

export interface ICreatePixChargeVariables {
	code: string;
	txid: string;
	establishmentID: string;
	userID: string;
}

export const createPixChargeMutation = gql`
    mutation storePixInfos(
        $code: String!
        $txid: String!
        $establishmentID: ID
        $userID: ID
    ) {
        createPixInfo(
            data: {
                code: $code
                txid: $txid
                establishment: $establishmentID
                users_permissions_user: $userID
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
