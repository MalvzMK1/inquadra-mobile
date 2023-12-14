import {MutationTuple, useMutation} from "@apollo/client";
import {deletePixKeyMutation, IDeletePixKeyResponse, IDeletePixKeyVariables} from "../graphql/mutations/deletePixKey";

export default function useDeletePixKey(): MutationTuple<IDeletePixKeyResponse, IDeletePixKeyVariables> {
	return useMutation<IDeletePixKeyResponse, IDeletePixKeyVariables>(deletePixKeyMutation);
}
