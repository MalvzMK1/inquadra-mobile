import {gql} from "@apollo/client";

export interface IGetAllBlockedAvailabilitiesFromCourtResponse {
	blockedAvailabilities: {
		data: Array<{
			id: string;
			attributes: {
				startAt: string;
				endAt: string;
			}
		}>
	}
}

export interface IGetAllBlockedAvailabilitiesFromCourtVariables {
	court_id: string | number;
}

export const getAllBlockedAvailabilitiesFromCourtQuery = gql`
    query GetAllBlockedAvailabilitiesFromCourt($court_id: ID!) {
        blockedAvailabilities(filters: { courts: { id: { eq: $court_id } } }) {
            data {
                id
                attributes {
                    startAt
		                endAt
                }
            }
        }
    }
`;
