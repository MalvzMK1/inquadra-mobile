import { useMutation } from "@apollo/client";
import {
    IUpdateCourtResponse,
    IUpdateCourtVariables,
    updateCourtMutation
} from "../graphql/mutations/updateCourt"

export default function useUpdateCourt(){
    return useMutation<IUpdateCourtResponse, IUpdateCourtVariables>(updateCourtMutation)
}