import {gql} from "@apollo/client";

export interface IDeletePhotoResponse {
	deleteUploadFile: {
		data?: {
			id: Photo['id'],
			attributes: {
				url: Photo['url'],
			}
		}
	}
}

export interface IDeletePhotoVariables {
	photo_id: string | number;
}

export const deletePhotoMutation = gql`
    mutation deletePhoto($photo_id: ID!) {
        deleteUploadFile(id: $photo_id) {
            data {
                id
                attributes {
                    url
                }
            }
        }
    }
`;