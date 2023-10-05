import { gql } from "@apollo/client";

export interface SendResetPasswordTokenResponse {
  sendResetPasswordTokenCustom: {
    success: boolean;
    status: number;
  };
}

export interface SendResetPasswordTokenVariables {
  email: string;
}

export const sendResetPasswordTokenMutation = gql`
  mutation SendResetPasswordToken($email: String!) {
    sendResetPasswordTokenCustom(email: $email) {
      success
      status
    }
  }
`;
