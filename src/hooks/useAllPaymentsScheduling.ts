import { QueryResult, useQuery } from "@apollo/client";
import {AllPaymentsSchedulingQuery, IAllPaymentsSchedulingResponse, IAllPaymentsSchedulingVariable} from "../graphql/queries/allPaymentsOfScheduling"

export function useAllPaymentsSchedulingById(id:string): QueryResult<IAllPaymentsSchedulingResponse, IAllPaymentsSchedulingVariable>{
    return useQuery<IAllPaymentsSchedulingResponse, IAllPaymentsSchedulingVariable>(AllPaymentsSchedulingQuery, {
        variables: {
            id
        }
    })
}