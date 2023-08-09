import {useMutation} from "@apollo/client";
import {
    IUpdateScheduleValueResponse,
    IUpdateScheduleValueVariables,
    updateScheduleValueMutation
} from "../graphql/mutations/updateScheduleValue"

export default function useUpdateScheduleValue(){
    return useMutation<IUpdateScheduleValueResponse, IUpdateScheduleValueVariables>(updateScheduleValueMutation)
}