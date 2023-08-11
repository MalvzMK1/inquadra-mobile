import { MutationResult, useMutation } from "@apollo/client";
import {
    IUpdateEstablishmentAddressResponse,
    IUpdateEstablishmentAddress,
    updateEstablishmentAddressMutation
} from "../graphql/mutations/updateEstablishmentAddress";

export default function useUpdateEstablishmentAddress() {
    return useMutation<IUpdateEstablishmentAddressResponse, IUpdateEstablishmentAddress>(updateEstablishmentAddressMutation)
}