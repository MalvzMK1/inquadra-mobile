import {MutationResult, useMutation} from "@apollo/client";
import {
    IUpdateUserResponse,
    IUpdateUserVariables,
    updateUserMutation
} from "../graphql/mutations/updateUser"

export default function useUpdateUser(){
    return useMutation<IUpdateUserResponse, IUpdateUserVariables>(updateUserMutation)
}