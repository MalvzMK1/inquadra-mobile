import {MutationTuple, useMutation} from "@apollo/client";
import {deletePhotoMutation, IDeletePhotoResponse, IDeletePhotoVariables} from "../graphql/mutations/deletePhoto";

export default function useDeletePhoto(): MutationTuple<IDeletePhotoResponse, IDeletePhotoVariables> {
	return useMutation<IDeletePhotoResponse, IDeletePhotoVariables>(deletePhotoMutation);
}
