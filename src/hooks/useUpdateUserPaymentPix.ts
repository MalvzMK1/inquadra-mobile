import {useMutation} from "@apollo/client"
import {
    IUpdateUserPaymentPixResponse,
    IUpdateUserPaymentPixVariables,
    updateUserPaymentPixMutation
} from "../graphql/mutations/updateUserPaymentPix"


export default function useUpdateUserPaymentPix(){
    return useMutation<IUpdateUserPaymentPixResponse, IUpdateUserPaymentPixVariables>(updateUserPaymentPixMutation)
}