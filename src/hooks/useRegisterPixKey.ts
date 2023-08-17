import { MutationResult, useMutation } from "@apollo/client";
import {
    IRegisterPixKeyResponse,
    IRegisterPixKeyVariables,
    registerPixKey
} from "../graphql/mutations/registerPixKey";

export default function useRegisterPixKey() {
    return useMutation<IRegisterPixKeyResponse, IRegisterPixKeyVariables>(registerPixKey)
}