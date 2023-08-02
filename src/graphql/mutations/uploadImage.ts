import {gql} from "@apollo/client";

export interface IUploadImageResponse {
	upload: {
		data: {
			id: string,
			attributes: {
				url: string
			}
		}
	}
}

export interface IUploadImageVariables {
	ref_id: string,
	ref: string,
	field: string,
	file: MediaStream | Buffer
}

export const uploadImageMutation = gql`
    mutation uploadPhoto(
        $ref_id: ID!
        $ref: String
        $field: String
        $file: Upload!
    ) {
        upload(refId: $ref_id, ref: $ref, field: $field, file: $file) {
            data {
                id
                attributes {
                    url
                }
            }
        }
    }
`
