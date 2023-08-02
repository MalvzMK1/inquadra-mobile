import { useMutation } from "@apollo/client";
import {
    IDeleteEstablishmentResponse,
    IDeleteEstablishmentVariables,
    deleteEstablishmentMutation
} from "../graphql/mutations/deleteEstablishment"

export default function useDeleteEstablishment(){
    return useMutation<IDeleteEstablishmentResponse, IDeleteEstablishmentVariables>(deleteEstablishmentMutation)
}