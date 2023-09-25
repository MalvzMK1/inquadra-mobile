import { useMutation } from "@apollo/client";
import {IUpdateScheduleActivatedStatusResponse, IUpdateScheduleActivatedStatusVariables, updateScheduleActivatedStatusMutation} from "../graphql/mutations/updateScheduleActivatedStatus"

export default function useUpdateScheduleActivateStatus(){
    return useMutation<IUpdateScheduleActivatedStatusResponse, IUpdateScheduleActivatedStatusVariables>(updateScheduleActivatedStatusMutation)
}