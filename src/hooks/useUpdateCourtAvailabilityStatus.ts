import {useMutation} from "@apollo/client";
import {
    IUpdateCourtAvailabilityStatusResponse,
    IUpdateCourtAvailabilityStatusVariables,
    updateCourtAvailabilityStatusMutation
} from "../graphql/mutations/updateCourtAvailabilityStatus"

export default function useUpdateCourtAvailabilityStatus(){
    return useMutation<IUpdateCourtAvailabilityStatusResponse, IUpdateCourtAvailabilityStatusVariables>(updateCourtAvailabilityStatusMutation)
}
