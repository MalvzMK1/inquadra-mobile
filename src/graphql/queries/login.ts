import type { User } from "../../types/User";
import {gql} from "@apollo/client";

export interface ILoginResponse {
	usersPermissionsUsers: {
		data: {
			attributes: {
				username: User['username'];
				email: User['email'];
			};
		};
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
