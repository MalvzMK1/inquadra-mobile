import {gql} from "@apollo/client";

export interface IUpdateEstablishmentUserResponse {
	userPermissionsUser: {
		data?: {
			id: User['id'],
			attributes: {

			}
		}
	}
}

export interface IUpdateEstablishmentUserVariables {
	username: string;
	email: string;
	phone_number: string;
	cpf: string;
	user_id: string | number;
}

export const updateEstablishmentUserMutation = gql`
    mutation updateUser(
        $username: String!
        $email: String!
        $phone_number: String!
        $cpf: String!
        $user_id: ID!
    ) {
        updateUsersPermissionsUser(
            id: $user_id
            data: {
                username: $username
                email: $email
                phoneNumber: $phone_number
                cpf: $cpf
            }
        ) {
            data {
                id
                attributes {
                    username
                    email
                    phoneNumber
                    cpf
                    role {
                        data {
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
