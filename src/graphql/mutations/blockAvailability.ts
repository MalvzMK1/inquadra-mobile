import {gql} from "@apollo/client";

export interface IBlockAvailabilityResponse {
	createBlockedAvailability: {
		data?: {
			id: string;
		}
	}
}

export interface IBlockAvailabilityVariables {
	courts_id: Array<string | number>;
	starts_at: string;
	ends_at: string;
	published_at: string;
}

export const blockAvailabilityMutation = gql`
    mutation BlockAvailability(
        $courts_id: [ID!]
        $starts_at: DateTime
        $ends_at: DateTime
        $published_at: DateTime
    ) {
        createBlockedAvailability(
            data: {
                courts: $courts_id
                startAt: $starts_at
                endAt: $ends_at
                publishedAt: $published_at
            }
        ) {
            data {
                id
            }
        }
    }
`;
