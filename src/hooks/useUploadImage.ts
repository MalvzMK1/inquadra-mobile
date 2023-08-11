import {useMutation} from "@apollo/client";
import {IUploadImageResponse, IUploadImageVariables, uploadImageMutation} from "../graphql/mutations/uploadImage";

export default function useUploadImage() {
	return useMutation<IUploadImageResponse, IUploadImageVariables>(uploadImageMutation)
}