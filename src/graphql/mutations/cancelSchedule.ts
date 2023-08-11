import {gql} from "@apollo/client";

export interface ICancelReserveResponse {
	updateScheduling: {
		data: {
			id: string,
			attributes: {
				status: boolean
			}
		}
	}
}

export interface ICancelReserveVariables {
	scheduleId: string,
	reason: string,
}

export const cancelReserveQuery = gql`
    mutation cancelReserve($scheduleId: ID!, $reason: String) {
        updateScheduling(id: $scheduleId, data: { cancelMessage: $reason, status: false }) {
            data {
                id
                attributes {
                    status
                }
            }
        }
    }
`
