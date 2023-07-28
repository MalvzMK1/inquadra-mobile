import { gql } from "@apollo/client";


export interface ICourtByIdResponse {
	court: {
		data: {
			id: Court ['id'];
			attributes: {
				name: Court ['name']
				court_type: {
					data: {
						attributes: {
							name: SportType['name']
						}
					},
				},
				photo: {
					data: {
						attributes:{
							url: Photo['url']
						}
					}
				},
				establishment: {
					data: {
						id: Establishment['id']
						attributes: Omit<Establishment, 'id'> & {
							address: {
								data: {
									latitude: Address['latitude']
									longitude: Address['longitude']
								}
							}
						}
					}
				}
			}
		}
	}
}

export interface ICourtByIdVariables {
	id: string
}

export const courtByIdQuery = gql`
    query courtById($id: ID) {
        court(id: $id) {
            data {
                id
                attributes {
                    court_type {
                        data {
                            attributes {
                                name
                            }
                        }
                    }
                    name
                    photo {
                        data {
                            attributes {
                                url
                            }
                        }
                    }
                    establishment {
                        data {
                            id
                            attributes {
                                corporateName
                                address {
                                    latitude
                                    longitude
                                }
                            }
                        }
                    }
                    court_type {
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
`;
