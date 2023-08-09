import { useMutation } from "@apollo/client";
import {
    IRegisterScheduleResponse,
    IRegisterScheduleVariables,
    registerScheduleMutation
} from "../graphql/mutations/registerSchedule"

export function useRegisterSchedule(){
    return useMutation<IRegisterScheduleResponse, IRegisterScheduleVariables>(registerScheduleMutation)
}