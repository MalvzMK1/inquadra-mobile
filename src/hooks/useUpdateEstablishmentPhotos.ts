import {MutationTuple, useMutation} from "@apollo/client";
import {
	IUpdateEstablishmentPhotosResponse,
	IUpdateEstablishmentPhotosVariables, updateEstablishmentPhotosMutation
} from "../graphql/mutations/updateEstablishmentPhotos";

export default function useUpdateEstablishmentPhotos(): MutationTuple<IUpdateEstablishmentPhotosResponse, IUpdateEstablishmentPhotosVariables> {
	return useMutation<IUpdateEstablishmentPhotosResponse, IUpdateEstablishmentPhotosVariables>(updateEstablishmentPhotosMutation);
}
