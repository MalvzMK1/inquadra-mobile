import {gql} from "@apollo/client";

export interface ILoginResponse {
	usersPermissionsUsers: {
		data: Array<{
				username: User['username'];
				email: User['email'];
			}>;
		__typename: string;
	};
}

export interface ILoginHeaders {
	Authentication: string;
}

export const loginQuery = gql`
    query Login {
        usersPermissionsUsers {
            data {
                attributes {
                    username
                    email
                }
            }
        }
    }
`;
