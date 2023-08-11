import {gql} from "@apollo/client";
import {CourtType} from "../../__generated__/graphql";

export interface IEstablishmentCardInformationsResponse {
	establishments: {
		data: Array<{
			id: Establishment['id'],
			attributes: {
				corporateName: Establishment['corporateName'],
				address: {
					latitude: Address['latitude'],
					longitude: Address['longitude'],
				},
				photos: {
					data?: Array<{
						attributes: {
							name: string,
							url: string,
							height: number,
							width: number,
						}
					}>
				},
				courts: {
					data?: Array<{
						attributes: {
							court_types: {
								data: Array<{
									attributes: {
										name: CourtType['name']
									}
								}>
							}
						}
					}>
				}
			}
		}>
	}
}

export const establishmentCardInformationsQuery = gql`
    query getEstablishmentCardInformations {
        establishments {
            data {
                id
                attributes {
                    corporateName
                    photos {
                        data {
                            attributes {
                                name
                                width
                                height
                                url
                            }
                        }
                    }
                    address {
                        latitude
                        longitude
                    }
                    courts {
                        data {
                            attributes {
                                court_types {
                                    data {
                                        attributes {
                                            name
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

`