import {useMutation} from "@apollo/client";
import {IUpdateScheduleDayResponse, UpdateScheduleDayMutation, IUpdateScheduleDayVariables} from "../graphql/mutations/updateScheduleDay"

export default function useUpdateScheduleDay(){
    return useMutation<IUpdateScheduleDayResponse, IUpdateScheduleDayVariables>(UpdateScheduleDayMutation)
}