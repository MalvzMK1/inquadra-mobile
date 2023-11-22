import {gql} from "@apollo/client";

export interface IUpdateEstablishmentPhotosResponse {
	updateEstablishment: {
		data?: {
			id: Establishment['id'],
			attributes: {
				photos: {
					data: Array<{
						id: Photo['id'],
						attributes: {
							url: Photo['url'],
						}
					}>
				}
			}
		}
	}
}

export interface IUpdateEstablishmentPhotosVariables {
	establishment_id: string | number,
	photos_id: Array<string | number>,
}

export const updateEstablishmentPhotosMutation = gql`
    mutation updateEstablishmentPhotos($establishment_id: ID! $photos_id: [ID!]) {
        updateEstablishment(
            id: $establishment_id
            data: {
                photos: $photos_id
            }
        ) {
            data {
                id
                attributes {
                    photos {
                        data {
                            id
                            attributes {
                                url
                            }
                        }
                    }
                }
            }
        }
    }
`;
