import { useMutation } from "@apollo/client";
import {
    IUpdateCordenationsResponse,
    IUpdateCordenationsVariables,
    updateCordenationsMutation
} from "../graphql/mutations/updateCordenations"

export default function useUpdateCordenationUser(){
    return useMutation<IUpdateCordenationsResponse, IUpdateCordenationsVariables>(updateCordenationsMutation)
}
