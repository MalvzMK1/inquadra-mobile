import {gql} from "@apollo/client";

export interface IUpdateEstablishmentLogoResponse {
	updateEstablishment: {
		data?: {
			id: Establishment['id'],
		}
	}
}

export interface IUpdateEstablishmentLogoVariables {
	establishment_id: string | number;
	photo_id: string | number;
}

export const updateEstablishmentLogoMutation = gql`
    mutation updateEstablishmentLogo($establishment_id: ID!, $photo_id: ID!) {
        updateEstablishment(id: $establishment_id, data: { logo: $photo_id }) {
            data {
                id
            }
        }
    }
`;
