import {gql} from "@apollo/client";

export interface IResetPasswordResponse {

}

export interface IResetPasswordVariables {
	code: string;
	password: string;
	confirmPassword: string;
}

export const resetPasswordMutation = gql`
    mutation resetPassword {
        resetPassword(
            password: "123123"
            passwordConfirmation: "123123"
            code: "c852b962ceaeb8b2a40a505aeef115809efabadf50c9c6c38949894f965dfdc776e4057a6a9c181198b9d267de69e4e4b72d404df3dfd17f41ed408ce2492fbf"
        ) {
            jwt
            user {
                id
            }
        }
    }

`;