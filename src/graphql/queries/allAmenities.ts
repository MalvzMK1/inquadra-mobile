import {gql} from "@apollo/client";

export interface IAllAmenitiesResponse {
	amenities: {
		data: Array<{
			id: Amenitie['id'],
			attributes: {
				name: Amenitie['name'],
				iconAmenitie: {
					data: {
						id: string,
						attributes: {
							url: string
						}
					}
				}
			}
		}>
	}
}

export const allAmenitiesQuery = gql`
    query allAmenities {
        amenities {
            data {
                id
                attributes {
                    name
                    iconAmenitie {
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
