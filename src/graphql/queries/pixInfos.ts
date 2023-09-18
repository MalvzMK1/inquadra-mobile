import {gql} from "@apollo/client";

export interface IPixInfosResponse {
	data: {
		pixInfos: {
			data: Array<{
				id: string,
				attributes: {
					code: string,
					txid: string,
					establishment: {
						data?: {
							id: Establishment['id'],
							attributes: {
								corporateName: Establishment['corporateName'],
							}
						}
					}
				}
			}>
		}
	}
}

export interface IPixInfosVariables {
	txid: string;
}

export const pixInfosQuery = gql`
    query PixInfo($txid: String!) {
        pixInfos(filters: { txid: { eq: $txid } }) {
            data {
                id
                attributes {
                    code
                    txid
                    establishment {
                        data {
                            id
                            attributes {
                                corporateName
                            }
                        }
                    }
                }
            }
        }
    }

`
