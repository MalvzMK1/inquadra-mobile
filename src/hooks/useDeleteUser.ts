import {MutationResult, useMutation} from "@apollo/client";
import {
    IDeleteUserResponse,
    IDeleteUserVariables,
    deleteUserMutation 
} from "../graphql/mutations/deleteUser"

 export  default function useDeleteUser(){
    return useMutation<IDeleteUserResponse, IDeleteUserVariables>(deleteUserMutation)
 }

