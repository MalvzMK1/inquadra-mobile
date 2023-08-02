import { useMutation } from "@apollo/client";
import {
    IDeleteCourtResponse,
    IDeleteCourtVariables,
    deleteCourtMutation
} from "../graphql/mutations/deleteCourt"

export default function useDeleteCourt(){
    return useMutation<IDeleteCourtResponse, IDeleteCourtVariables>(deleteCourtMutation)
}
