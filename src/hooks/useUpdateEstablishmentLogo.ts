import {MutationTuple, useMutation} from "@apollo/client";
import {
	IUpdateEstablishmentLogoResponse,
	IUpdateEstablishmentLogoVariables, updateEstablishmentLogoMutation
} from "../graphql/mutations/updateEstablishmentLogo";

export default function useUpdateEstablishmentUser(): MutationTuple<IUpdateEstablishmentLogoResponse, IUpdateEstablishmentLogoVariables> {
	return useMutation<IUpdateEstablishmentLogoResponse, IUpdateEstablishmentLogoVariables>(updateEstablishmentLogoMutation);
}
