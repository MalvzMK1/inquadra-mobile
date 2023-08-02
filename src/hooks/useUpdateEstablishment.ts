import {MutationResult, useMutation} from "@apollo/client";
import{
    IUpdateEstablishmentResponse,
    IUpdateEstablishmentVariables,
    updateEstablishmentMutation
} from "../graphql/mutations/updateEstablishment"

export default function useUpdateEstablishment(){
    return useMutation<IUpdateEstablishmentResponse, IUpdateEstablishmentVariables>(updateEstablishmentMutation)
}

