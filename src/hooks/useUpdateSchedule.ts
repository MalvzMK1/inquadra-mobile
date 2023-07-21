import {useMutation} from "@apollo/client";
import {
    IUpdateScheduleResponse,
    IUpdateScheduleVariables,
    updateScheduleMutation
} from "../graphql/mutations/updateSchedule"

export default function useUpdateSchedule(){
    return useMutation<IUpdateScheduleResponse, IUpdateScheduleVariables>(updateScheduleMutation)
}