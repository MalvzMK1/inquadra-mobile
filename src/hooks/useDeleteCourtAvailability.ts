import {useMutation} from "@apollo/client";
import {
    IDeleteCourtAvailabilityResponse,
    IDeleteCourtAvailabilityVariables,
    deleteCourtAvailabilityMutation
} from "../graphql/mutations/deleteCourtAvailability"

 export default function useDeleteCourtAvailability(){
    return useMutation<IDeleteCourtAvailabilityResponse, IDeleteCourtAvailabilityVariables>(deleteCourtAvailabilityMutation)
 }