import { MutationResult, useMutation } from "@apollo/client";
import {
    IUpdateEstablishmentFantasyNameResponse,
    IUpdateEstablishmentFantasyName,
    updateEstablishmentFantasyName
} from "../graphql/mutations/updateEstablishmentFantasyName";

export default function useUpdateEstablishmentFantasyName() {
    return useMutation<IUpdateEstablishmentFantasyNameResponse, IUpdateEstablishmentFantasyName>(updateEstablishmentFantasyName)
}