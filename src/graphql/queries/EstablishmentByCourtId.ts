import { gql } from "@apollo/client";
import { CourtType } from "../../__generated__/graphql";

export interface IEstablishmentByCourtId {
	establishment: {
		data: {
			id: Establishment['id'],
			attributes: {
				corporateName: Establishment['corporateName'],
				cellPhoneNumber: Establishment['cellphoneNumber']
				address: {
					latitude: Address['latitude'],
					longitude: Address['longitude'],
					cep: Address['cep'],
					streetName: Address['streetName']
				},
				photos: {
					data: Array<{
						attributes: {
							url: string,
						}
					}>
				},
				logo: {
					data: {
						attributes: {
							url: string
						}
					}
				}
				courts: {
					data: Array<{
						id: Court['id'],
						attributes: {
							rating?: Court['rating'],
							name: Court['fantasy_name'],
							court_types: {
								data: Array<{
									attributes: {
										name: CourtType['name']
									}
								}>
							}
							court_availabilities: {
								data: Array<{
									attributes: {
										schedulings: {
											data: Array<{
												id: Scheduling['id']
											}>
										}
									}
								}>
							}
							photo: {
								data: Array<{
									attributes: {
										url: string
									}
								}>
							}
						}
					}>
				}
				amenities: {
					data: Array<{
						id: Amenitie['id'],
						attributes: {
							name: Amenitie['name'],
							iconAmenitie: {
								data: {
									attributes: {
										url: Amenitie['icon']
									}
								}
							}
						}
					}>
				}

			}
		}
	}
}

export const EstablishmentByCourtIdQuery = gql`
    query getEstablishment($id: ID) {
        establishment(id: $id) {
            data {
                id
                attributes {
                    corporateName
                    cellPhoneNumber
                    address {
                        latitude
                        longitude
                        streetName
		                    cep
                    }
                    photos {
                        data {
                            attributes {
                                url
                            }
                        }
                    }
		                logo {
				                data {
						                attributes {
								                url
						                }
				                }
		                }
                    courts {
                        data {
                            id
                            attributes {
                                rating
                                name
                                court_types {
                                    data {
                                        attributes {
                                            name
                                        }
                                    }
                                }
                                court_availabilities {
                                    data {
                                        attributes {
                                            schedulings {
                                                data {
                                                    id
                                                }
                                            }
                                        }
                                    }
                                }
		                            photo {
				                            data {
						                            attributes {
								                            url
						                            }
				                            }
		                            }
                            }
                        }
                    }
                    amenities {
                        data {
                            id
                            attributes {
                                name
                                iconAmenitie {
                                    data {
                                        attributes {
                                            url
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