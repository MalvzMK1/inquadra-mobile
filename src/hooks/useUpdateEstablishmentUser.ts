import {MutationTuple, useMutation} from "@apollo/client";
import {
	IUpdateEstablishmentUserResponse,
	IUpdateEstablishmentUserVariables, updateEstablishmentUserMutation
} from "../graphql/mutations/updateEstablishmentUser";

export default function useUpdateEstablishmentUser(): MutationTuple<IUpdateEstablishmentUserResponse, IUpdateEstablishmentUserVariables> {
	return useMutation<IUpdateEstablishmentUserResponse, IUpdateEstablishmentUserVariables>(updateEstablishmentUserMutation);
}
