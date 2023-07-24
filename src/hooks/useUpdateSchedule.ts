import { useMutation } from "@apollo/client";
import {
    IUpdateScheduleResponse,
    IUpdateSchedulingVariables,
    updateSchedulingMutation
} from "../graphql/mutations/updateSchedule"

export default function useUpdateSchedule(){
    return useMutation<IUpdateScheduleResponse, IUpdateSchedulingVariables>(updateSchedulingMutation)
}