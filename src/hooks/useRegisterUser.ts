import {MutationResult, useMutation} from "@apollo/client";
import{
    IRegisterUserResponse,
    IRegisterUserVariables,
    registerUserMutation
} from "../graphql/mutations/register"

export default function useRegisterUser(){
    return useMutation<IRegisterUserResponse, IRegisterUserVariables>(registerUserMutation)
}