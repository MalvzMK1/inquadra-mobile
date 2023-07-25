import {useMutation} from "@apollo/client";
import {
    IUpdateCourtAvailabilityResponse,
    IUpdateCourtAvailabilityVariables,
    updateCourtAvailabilityMutation
} from "../graphql/mutations/updateCourtAvailability"

export default function useUpdateCourtAvailability(){
    return useMutation<IUpdateCourtAvailabilityResponse, IUpdateCourtAvailabilityVariables>(updateCourtAvailabilityMutation)
}