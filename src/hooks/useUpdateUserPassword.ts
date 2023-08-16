import { MutationResult, useMutation } from "@apollo/client";
import {
    IUpdateUserPasswordResponse,
    IUpdateUserPasswordVariables,
    updateUserPasswordMutation
} from "../graphql/mutations/updateUserPassword";

export default function useUpdateUserPassword() {
    return useMutation<IUpdateUserPasswordResponse, IUpdateUserPasswordVariables>(updateUserPasswordMutation)
}