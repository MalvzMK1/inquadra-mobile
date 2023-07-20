import { useMutation } from "@apollo/client";
import {
    ILoginUserResponse,
    ILoginUserVariables,
    loginUserMutation
} from "../graphql/mutations/loginUser"

export default function useLoginUser(){
    return useMutation<ILoginUserResponse, ILoginUserVariables>(loginUserMutation)
}

