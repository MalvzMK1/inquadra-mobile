import {useMutation} from "@apollo/client";
import {
    IGenerateActivationKeyResponse, 
    IGenerateActivationKeyVariables,
    generateActivationKeyMutation
} from "../graphql/mutations/generateActivationKey"

export default function useGenerateActivationKey(){
    return useMutation<IGenerateActivationKeyResponse, IGenerateActivationKeyVariables>(generateActivationKeyMutation)
}