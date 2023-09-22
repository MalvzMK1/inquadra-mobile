import { useMutation, MutationTuple } from "@apollo/client";
import { IForgotPasswordResponse, IForgotPasswordVariables, forgotPasswordMutation } from "../graphql/mutations/forgotPassword";

export default function useForgetPassword(): MutationTuple<IForgotPasswordResponse, IForgotPasswordVariables> {
    return useMutation<IForgotPasswordResponse, IForgotPasswordVariables>(forgotPasswordMutation)
}