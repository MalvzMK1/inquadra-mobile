import {useMutation} from "@apollo/client";
import {
    IDeleteScheduleResponse,
    IDeleteScheduleVariables,
    deleteScheduleMutation
} from "../graphql/mutations/deleteSchedule"

export default function useDeleteSchedule(){
    return useMutation<IDeleteScheduleResponse, IDeleteScheduleVariables>(deleteScheduleMutation)
}