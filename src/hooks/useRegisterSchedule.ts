import {useMutation} from "@apollo/client";
import {
    IRegisterScheduleResponse,
    IRegisterScheduleVariables,
    registerScheduleMutation
} from "../graphql/mutations/registerSchedule"

export default function useRegisterSchedule(){
    return useMutation<IRegisterScheduleResponse, IRegisterScheduleVariables>(registerScheduleMutation)
}