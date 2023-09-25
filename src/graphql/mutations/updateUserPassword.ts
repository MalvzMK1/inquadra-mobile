import { gql } from "@apollo/client";

export interface IUpdateUserPasswordResponse {
    user: {
        email: User['email']
    }
}

export interface IUpdateUserPasswordVariables {
    current_password: string
    password: string
    password_confirmation: string
}

export const updateUserPasswordMutation = gql`
    mutation updatePassword($current_password: String!, $password: String!, $password_confirmation: String!) {
        changePassword(
            currentPassword: $current_password,
            password: $password,
            passwordConfirmation: $password_confirmation
        ) {
            user {
                email
        }
    }
}
`