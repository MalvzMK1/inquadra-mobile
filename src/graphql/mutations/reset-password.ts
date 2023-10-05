import { gql } from "@apollo/client";

export interface ResetPasswordResponse {
  resetUserPasswordCustom: {
    success: boolean;
    message: string;
  };
}

export interface ResetPasswordVariables {
  token: string;
  password: string;
}

export const resetPasswordMutation = gql`
  mutation ResetPassword($token: String!, $password: String!) {
    resetUserPasswordCustom(token: $token, password: $password) {
      success
      message
    }
  }
`;
