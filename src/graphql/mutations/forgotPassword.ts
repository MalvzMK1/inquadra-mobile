import { gql } from "@apollo/client";

export interface IForgotPasswordResponse {
    forgotPassword: {
        ok: boolean
    }
}

export interface IForgotPasswordVariables {
    email: string
}

export const forgotPasswordMutation = gql`
mutation forgetPassword($email: String!) {
  forgotPassword(
    email: $email
  ) {
    ok
  }
}
`